import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ClaimStatus } from '../types';
import Card from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const DeliveryTracker: React.FC<{ status: ClaimStatus }> = ({ status }) => {
  const steps = [
    { name: 'Accepted', icon: 'fas fa-check' },
    { name: 'Out for Delivery', icon: 'fas fa-truck' },
    { name: 'Delivered', icon: 'fas fa-box-open' }
  ];

  const getStepIndex = () => {
    switch (status) {
      case ClaimStatus.Accepted: return 0;
      case ClaimStatus.OutForDelivery: return 1;
      case ClaimStatus.Delivered: return 2;
      default: return -1;
    }
  };
  const currentStepIndex = getStepIndex();

  if (currentStepIndex === -1) return null;

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${index <= currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <i className={step.icon}></i>
              </div>
              <p className={`text-xs mt-1 font-medium ${index <= currentStepIndex ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};


const MyClaimsPage: React.FC = () => {
  const { claims, foodItems, users, addCommunityPost, conversations } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const myClaims = claims
    .filter(c => c.claimerId === currentUser?.id)
    .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());

  const getStatusBadgeColor = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.Pending: return 'bg-yellow-100 text-yellow-800';
      case ClaimStatus.Accepted: return 'bg-blue-100 text-blue-800';
      case ClaimStatus.Rejected: return 'bg-red-100 text-red-800';
      case ClaimStatus.OutForDelivery: return 'bg-indigo-100 text-indigo-800';
      case ClaimStatus.Delivered: return 'bg-green-100 text-green-800';
      case ClaimStatus.DeliveryFailed: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenChat = (claimId: string) => {
    const conversation = conversations.find(c => c.claimId === claimId);
    if(conversation) {
      navigate(`/chat/${conversation.id}`);
    } else {
      alert("Chat for this claim is not available yet.");
    }
  }

  if (!currentUser) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Claimed Items</h1>
      
      {myClaims.length === 0 ? (
        <p className="text-gray-500">You haven't claimed any items yet. <Link to="/" className="text-green-600 hover:underline">Browse available food.</Link></p>
      ) : (
        <div className="space-y-6">
          {myClaims.map(claim => {
            const item = foodItems.find(f => f.id === claim.foodItemId);
            const poster = users.find(u => u.id === claim.posterId);
            const driver = claim.deliveryPartnerId ? users.find(u => u.id === claim.deliveryPartnerId) : null;
            if (!item || !poster) return null;

            return (
              <Card key={claim.id} className="p-4 flex flex-col sm:flex-row gap-4">
                <img src={item.imageUrl} alt={item.title} className="w-full sm:w-32 h-32 object-cover rounded-md"/>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(claim.status)}`}>
                          {claim.status}
                      </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted by <Link to={`/profile/${poster.id}`} className="font-medium text-green-700 hover:underline">{poster.name}</Link>
                  </p>
                  <div className="text-xs text-gray-500 mt-1 space-y-1">
                    <p>Delivery: {claim.deliveryOption}
                      {claim.deliveryFee && <span className="font-bold text-red-600"> (${claim.deliveryFee.toFixed(2)} fee)</span>}
                    </p>
                     {driver && (
                       <p>
                         Driver: <Link to={`/profile/${driver.id}`} className="font-medium text-green-700 hover:underline">{driver.name}</Link>
                       </p>
                     )}
                  </div>
                  
                  <DeliveryTracker status={claim.status} />

                  <div className="mt-3 pt-3 border-t">
                    {claim.status === ClaimStatus.Pending && (
                        <p className="text-sm text-yellow-800 bg-yellow-100 p-2 rounded-md flex items-center">
                            <i className="fas fa-clock mr-2"></i>
                            Waiting for the poster to respond.
                        </p>
                    )}
                    {(claim.status === ClaimStatus.Accepted || claim.status === ClaimStatus.OutForDelivery) && (
                         <Button variant="primary" onClick={() => handleOpenChat(claim.id)}>
                            <i className="fas fa-comments mr-2"></i> Open Chat
                        </Button>
                    )}
                    {claim.status === ClaimStatus.Rejected && (
                        <p className="text-sm text-red-800 bg-red-100 p-2 rounded-md flex items-center">
                            <i className="fas fa-times-circle mr-2"></i>
                            This request was not accepted.
                        </p>
                    )}
                    {claim.status === ClaimStatus.Delivered && (
                         <Button variant="secondary" onClick={() => {
                            const title = prompt("Enter a title for your community post:", `Thank you for the ${item.title}!`);
                            const content = prompt("Share your experience:", "It was delicious and helped a lot. Thank you!");
                            if (title && content) {
                                addCommunityPost({
                                    authorId: currentUser.id,
                                    title,
                                    content,
                                    claimId: claim.id
                                });
                                alert("Your story has been shared to the community feed!");
                            }
                         }}>
                            <i className="fas fa-pen mr-2"></i> Share Your Story
                        </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClaimsPage;