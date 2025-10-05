
import React from 'react';
import { FoodItem, User, FoodStatus } from '../types';
import { calculateDistance } from '../hooks/useGeolocation';
import Card from './ui/Card';

interface FoodItemCardProps {
  item: FoodItem;
  poster: User | undefined;
  userLocation: { lat: number; lng: number } | null;
  onClaim: (item: FoodItem) => void;
  onReport: (item: FoodItem) => void;
  distance?: number;
}

const getStatusBadge = (status: FoodStatus) => {
  switch (status) {
    case FoodStatus.Available:
      return <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">Available</div>;
    case FoodStatus.Reserved:
      return <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">Reserved</div>;
    case FoodStatus.Collected:
      return <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">Collected</div>;
    default:
      return null;
  }
};

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, poster, userLocation, onClaim, onReport, distance: propDistance }) => {
  const distance = propDistance !== undefined
    ? propDistance
    : userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, item.location.lat, item.location.lng)
    : null;
  
  return (
    <Card className="flex flex-col h-full">
      <div className="relative">
        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
        {getStatusBadge(item.status)}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); // Prevent card click events
            onReport(item); 
          }} 
          className="absolute top-2 left-2 bg-white/70 text-gray-600 hover:bg-white hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm" 
          aria-label="Report this item"
          title="Report this item"
        >
          <i className="fas fa-flag"></i>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{item.description.substring(0, 100)}...</p>
        <div className="text-xs text-gray-500 space-y-2 mb-4">
          <div className="flex items-center">
            <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
            <span>{item.location.address}</span>
            {distance !== null && <span className="ml-2 font-semibold">({distance.toFixed(1)} km away)</span>}
          </div>
          <div className="flex items-center">
            <i className="fas fa-box mr-2 text-gray-400"></i>
            <span>Quantity: {item.quantity}</span>
          </div>
        </div>
        {poster && (
          <div className="flex items-center mb-4 pt-4 border-t">
            <img src={poster.avatarUrl} alt={poster.name} className="w-8 h-8 rounded-full mr-2" />
            <div>
              <p className="text-sm font-semibold text-gray-700">{poster.name}</p>
              <div className="flex items-center">
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                <span className="text-xs text-gray-600">{poster.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
       <div className="p-4 bg-gray-50">
        {item.status === FoodStatus.Available ? (
          <button onClick={() => onClaim(item)} className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition-colors">
            Claim Item
          </button>
        ) : (
          <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-md font-semibold cursor-not-allowed">
            Unavailable
          </button>
        )}
      </div>
    </Card>
  );
};

export default FoodItemCard;