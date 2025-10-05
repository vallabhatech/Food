
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation, calculateDistance } from '../hooks/useGeolocation';
import FoodItemCard from '../components/FoodItemCard';
import ClaimModal from '../components/ClaimModal';
import ReportModal from '../components/ui/ReportModal';
import { FoodItem, FoodStatus, UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

enum SortOption {
  RecentlyAdded = 'Recently Added',
  ExpiringSoon = 'Expiring Soon',
  Distance = 'Distance',
}

const HomePage: React.FC = () => {
  const { foodItems, users, addClaim } = useData();
  const { currentUser } = useAuth();
  const { location: userLocation, error: locationError } = useGeolocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingItem, setReportingItem] = useState<FoodItem | null>(null);
  
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.RecentlyAdded);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userLocation) {
      setSortOption(SortOption.Distance);
    }
  }, [userLocation]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { value: SortOption.RecentlyAdded, label: 'Recently Added', icon: 'fas fa-clock' },
    { value: SortOption.ExpiringSoon, label: 'Expiring Soon', icon: 'fas fa-calendar-times' },
    { value: SortOption.Distance, label: 'Distance', icon: 'fas fa-map-marker-alt', disabled: !userLocation },
  ];

  const suggestedItems = useMemo(() => {
    if (!userLocation) {
        return [];
    }

    return foodItems
        .filter(item => item.status === FoodStatus.Available)
        .map(item => ({
            ...item,
            distance: calculateDistance(
                userLocation.lat,
                userLocation.lng,
                item.location.lat,
                item.location.lng
            ),
        }))
        .filter(item => item.distance <= 5)
        .sort((a, b) => a.distance - b.distance);
  }, [foodItems, userLocation]);

  const availableItems = useMemo(() => {
    const filtered = foodItems
      .filter(item => item.status === FoodStatus.Available)
      .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const sorted = [...filtered].sort((a, b) => {
        switch (sortOption) {
            case SortOption.ExpiringSoon:
                return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
            case SortOption.Distance:
                if (userLocation) {
                    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng);
                    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
                    return distA - distB;
                }
                return 0;
            case SortOption.RecentlyAdded:
            default:
                return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        }
    });
    return sorted;
  }, [foodItems, searchTerm, sortOption, userLocation]);

  const handleClaimClick = (item: FoodItem) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setSelectedItem(item);
    setIsClaimModalOpen(true);
  };
  
  const handleClaimSubmit = (reason: string, deliveryOption: any) => {
      if(selectedItem && currentUser){
          addClaim({
              foodItemId: selectedItem.id,
              claimerId: currentUser.id,
              posterId: selectedItem.postedBy,
              reason,
              deliveryOption
          });
          alert("Claim submitted successfully! The poster will be notified.");
      }
  }

  const handleReportClick = (item: FoodItem) => {
    setReportingItem(item);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = (reportDetails: { reason: string; comments: string }) => {
    console.log('Report submitted for food item:', reportingItem?.id, reportDetails);
    // In a real app, this would send the report to a backend service.
  };


  return (
    <div>
      <div className="bg-brand-gradient text-white rounded-lg shadow-xl p-8 md:p-12 mb-8 text-center relative overflow-hidden">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/10 rounded-full"></div>
        <h1 className="text-4xl md:text-5xl font-bold">Share More, Waste Less</h1>
        <p className="text-lg text-green-100 mt-2">Connecting communities to fight food waste and hunger.</p>
        <div className="mt-6 max-w-xl mx-auto relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search for apples, bread, soup..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-12 rounded-full border-2 border-transparent focus:ring-white focus:border-white text-gray-800"
          />
        </div>
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0 text-xs">Produce</Button>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0 text-xs">Baked Goods</Button>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0 text-xs">Meals</Button>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0 text-xs">Pantry</Button>
        </div>
      </div>
      
      {locationError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
            <p className="font-bold">Location Warning</p>
            <p>{locationError}. Distances to items cannot be calculated.</p>
          </div>
        )}

      {suggestedItems.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Suggestions For You (within 5km)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {suggestedItems.map(item => {
              const poster = users.find(u => u.id === item.postedBy);
              return (
                <FoodItemCard
                  key={`suggested-${item.id}`}
                  item={item}
                  poster={poster}
                  userLocation={userLocation}
                  onClaim={handleClaimClick}
                  onReport={handleReportClick}
                  distance={item.distance}
                />
              );
            })}
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">All Available Items</h2>
        <div className="relative" ref={sortDropdownRef}>
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-2 w-full sm:w-auto justify-between px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-haspopup="true"
            aria-expanded={isSortDropdownOpen}
          >
            <i className="fas fa-sort-amount-down text-gray-500"></i>
            Sort by: <span className="font-semibold">{sortOption}</span>
            <i className={`fas fa-chevron-down text-gray-500 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-fade-in-down" role="menu" aria-orientation="vertical">
              <div className="py-1">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (!option.disabled) {
                        setSortOption(option.value);
                        setIsSortDropdownOpen(false);
                      }
                    }}
                    disabled={option.disabled}
                    className={`flex items-center w-full px-4 py-2 text-sm text-left ${sortOption === option.value ? 'bg-green-50 text-green-800' : 'text-gray-700'} ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    <i className={`${option.icon} mr-3 w-5 text-center text-gray-500`}></i>
                    <span>{option.label}</span>
                    {sortOption === option.value && <i className="fas fa-check ml-auto text-green-600"></i>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {availableItems.length > 0 ? (
          availableItems.map(item => {
            const poster = users.find(u => u.id === item.postedBy);
            return (
              <FoodItemCard
                key={item.id}
                item={item}
                poster={poster}
                userLocation={userLocation}
                onClaim={handleClaimClick}
                onReport={handleReportClick}
              />
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">No available food items match your search. Check back later!</p>
        )}
      </div>

      <ClaimModal 
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        foodItem={selectedItem}
        onSubmit={handleClaimSubmit}
      />
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        itemType="Food Item"
      />
       <style>{`
        @keyframes fade-in-down {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default HomePage;