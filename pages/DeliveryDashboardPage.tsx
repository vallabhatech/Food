import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Claim, ClaimStatus, DeliveryOption, User, FoodItem, UserRole, VerificationStatus } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { calculateDistance } from '../hooks/useGeolocation';
import ChatWindow from '../components/ChatWindow';
import ProofOfDeliveryModal from '../components/ProofOfDeliveryModal';
import VerificationModal from '../components/VerificationModal';
import { useNotification } from '../contexts/NotificationContext';

const StatBlock: React.FC<{ icon: string; value: string | number; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className="bg-white rounded-lg p-4 flex items-center shadow-soft">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <i className={`${icon} text-white text-lg`}></i>
        </div>
        <div className="ml-3">
            <p className="text-xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    </div>
);

type ActiveTab = 'available' | 'active' | 'history';

const VerificationBanner: React.FC<{status: VerificationStatus, onStart: () => void}> = ({ status, onStart }) => {
    if(status === VerificationStatus.Verified) return null;
    
    const bannerContent = {
        [VerificationStatus.NotSubmitted]: {
            icon: 'fas fa-exclamation-triangle',
            color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
            title: 'Action Required: Verify Your Identity',
            text: 'To accept delivery jobs, you need to submit your documents for verification.',
            button: <Button onClick={onStart}>Start Verification</Button>
        },
        [VerificationStatus.Pending]: {
            icon: 'fas fa-clock',
            color: 'bg-blue-100 border-blue-500 text-blue-800',
            title: 'Verification Pending',
            text: 'Your documents have been submitted and are currently under review. We will notify you once the process is complete.',
            button: null
        },
        [VerificationStatus.Rejected]: {
            icon: 'fas fa-times-circle',
            color: 'bg-red-100 border-red-500 text-red-800',
            title: 'Verification Rejected',
            text: 'There was an issue with your submitted documents. Please review the feedback and resubmit.',
            button: <Button onClick={onStart}>Resubmit Documents</Button>
        },
        [VerificationStatus.Verified]: { icon: '', color: '', title: '', text: '', button: null } // Should not render
    };

    const { icon, color, title, text, button } = bannerContent[status];

    return (
        <div className={`border-l-4 p-4 rounded-r-lg ${color}`} role="alert">
            <div className="flex">
                <div className="py-1"><i className={`${icon} text-2xl`}></i></div>
                <div className="ml-4 flex-grow">
                    <p className="font-bold">{title}</p>
                    <p className="text-sm">{text}</p>
                </div>
                {button && <div className="flex items-center">{button}</div>}
            </div>
        </div>
    );
}

const DeliveryDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  // FIX: Added `conversations` to the destructuring to find the chat associated with a claim.
  const { claims, foodItems, users, acceptDeliveryJob, updateClaimStatus, updateUser, submitVerificationDocs, conversations } = useData();
  const { addNotification } = useNotification();

  const [activeTab, setActiveTab] = useState<ActiveTab>('available');
  const [activeChatClaim, setActiveChatClaim] = useState<Claim | null>(null);
  const [podModalClaim, setPodModalClaim] = useState<Claim | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const deliveryJobs = useMemo(() => {
    const platformJobs = claims.filter(c => c.deliveryOption === DeliveryOption.PlatformDelivery);
    const available = platformJobs.filter(c => c.status === ClaimStatus.Accepted && !c.deliveryPartnerId);
    const active = platformJobs.filter(c => c.deliveryPartnerId === currentUser?.id && [ClaimStatus.Accepted, ClaimStatus.OutForDelivery].includes(c.status));
    const history = platformJobs.filter(c => c.deliveryPartnerId === currentUser?.id && ![ClaimStatus.Accepted, ClaimStatus.OutForDelivery].includes(c.status));
    return { available, active, history };
  }, [claims, currentUser]);

  // FIX: Added memoized value to find the conversation corresponding to the selected delivery claim.
  const activeConversation = useMemo(() => {
    if (!activeChatClaim) return null;
    return conversations.find(c => c.claimId === activeChatClaim.id);
  }, [activeChatClaim, conversations]);

  const handleAcceptJob = (claimId: string) => {
    if (!currentUser) return;
    if (currentUser.deliveryPartner?.verificationStatus !== VerificationStatus.Verified) {
        addNotification("You must be a verified partner to accept jobs.", 'error');
        return;
    }
    acceptDeliveryJob(claimId, currentUser.id);
    addNotification('Job accepted! You can now coordinate with the participants.', 'success');
  };

  const handleUpdateStatus = (claimId: string, status: ClaimStatus) => {
    updateClaimStatus(claimId, status);
    if (status === ClaimStatus.Delivered) {
        addNotification('Delivery completed and logged!', 'success');
    }
  };
  
  const handleVerificationSubmit = (docs: { license: File; insurance: File }) => {
      if(!currentUser) return;
      // In a real app, you would upload these files and get URLs
      const mockUrls = {
          licenseUrl: `/docs/mock-license-${currentUser.id}.pdf`,
          insuranceUrl: `/docs/mock-insurance-${currentUser.id}.pdf`
      };
      submitVerificationDocs(currentUser.id, mockUrls);
      addNotification("Your documents have been submitted for review.", "success");
  };

  const toggleAvailability = () => {
    if (!currentUser || !currentUser.deliveryPartner) return;
    const newStatus = currentUser.deliveryPartner.availability === 'Online' ? 'Offline' : 'Online';
    // FIX: Explicitly cast `updatedUser` to the `User` type to resolve the type incompatibility for `deliveryPartner.availability`.
    // The type inference was widening `availability` to a generic `string` instead of the expected `'Online' | 'Offline'` union type.
    const updatedUser: User = {
        ...currentUser,
        deliveryPartner: {
            ...currentUser.deliveryPartner,
            availability: newStatus
        }
    };
    updateUser(updatedUser);
  };
  
  if (!currentUser || !currentUser.deliveryPartner) {
    return <p>Loading delivery partner data...</p>;
  }
  
  const renderJobCard = (claim: Claim, type: 'available' | 'active') => {
      const item = foodItems.find(f => f.id === claim.foodItemId);
      const poster = users.find(u => u.id === claim.posterId);
      const claimer = users.find(u => u.id === claim.claimerId);
      if(!item || !poster || !claimer) return null;

      const distance = calculateDistance(poster.location.lat, poster.location.lng, claimer.location.lat, claimer.location.lng);

      return (
          <Card key={claim.id} className="p-4">
              <h3 className="font-bold text-gray-800">{item.title}</h3>
              <div className="text-xs text-gray-500 my-3 space-y-2">
                  <p><i className="fas fa-arrow-up text-blue-500 w-4"></i> <strong>From:</strong> {poster.name} - {item.location.address}</p>
                  <p><i className="fas fa-arrow-down text-green-500 w-4"></i> <strong>To:</strong> {claimer.name} - {claimer.location.lat.toFixed(4)}, {claimer.location.lng.toFixed(4)}</p>
                  <p><i className="fas fa-road text-purple-500 w-4"></i> <strong>Distance:</strong> {distance.toFixed(1)} km</p>
                  <p><i className="fas fa-dollar-sign text-yellow-500 w-4"></i> <strong>Fee:</strong> ${claim.deliveryFee?.toFixed(2)}</p>
              </div>
              <div className="flex justify-end gap-2">
                  {type === 'available' && (
                      <>
                        <Button variant="secondary" className="text-xs px-2 py-1">Decline</Button>
                        <Button variant="primary" onClick={() => handleAcceptJob(claim.id)} className="text-xs px-2 py-1">Accept</Button>
                      </>
                  )}
                  {type === 'active' && (
                      <>
                        <Button variant="secondary" onClick={() => setActiveChatClaim(claim)} className="text-xs px-2 py-1"><i className="fas fa-comments mr-1"></i> Chat</Button>
                        {claim.status === ClaimStatus.Accepted && <Button onClick={() => handleUpdateStatus(claim.id, ClaimStatus.OutForDelivery)} className="text-xs px-2 py-1"><i className="fas fa-truck mr-1"></i> Picked Up</Button>}
                        {claim.status === ClaimStatus.OutForDelivery && <Button onClick={() => setPodModalClaim(claim)} className="text-xs px-2 py-1"><i className="fas fa-signature mr-1"></i> Deliver</Button>}
                      </>
                  )}
              </div>
          </Card>
      )
  };

  const renderHistoryCard = (claim: Claim) => {
      const item = foodItems.find(f => f.id === claim.foodItemId);
      if (!item) return null;
      return (
        <div key={claim.id} className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center">
            <div>
                <p className="font-semibold text-gray-700">{item.title}</p>
                <p className="text-xs text-gray-500">Completed on {new Date(claim.requestedAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${claim.status === ClaimStatus.Delivered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {claim.status}
            </span>
        </div>
      )
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome, {currentUser.name.split(' ')[0]}!</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
             <span className="font-medium text-sm">Availability:</span>
             <label htmlFor="availability-toggle" className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" id="availability-toggle" className="sr-only peer" checked={currentUser.deliveryPartner.availability === 'Online'} onChange={toggleAvailability} />
                 <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                 <span className="ml-3 text-sm font-semibold">{currentUser.deliveryPartner.availability}</span>
             </label>
        </div>
      </div>
      
      {/* Verification Banner */}
      <VerificationBanner status={currentUser.deliveryPartner.verificationStatus} onStart={() => setIsVerificationModalOpen(true)} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBlock icon="fas fa-dollar-sign" value={`$${currentUser.deliveryPartner.earnings.toFixed(2)}`} label="Total Earnings" color="bg-green-500" />
          <StatBlock icon="fas fa-check-circle" value={deliveryJobs.history.filter(c => c.status === ClaimStatus.Delivered).length} label="Deliveries Made" color="bg-blue-500" />
          <StatBlock icon="fas fa-star" value={currentUser.rating.toFixed(1)} label="Your Rating" color="bg-yellow-500" />
          <StatBlock icon="fas fa-road" value={deliveryJobs.active.length} label="Active Deliveries" color="bg-purple-500" />
      </div>

      {/* Main Content */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('available')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'available' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Available Jobs <span className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">{deliveryJobs.available.length}</span>
                    </button>
                    <button onClick={() => setActiveTab('active')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'active' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Active Deliveries <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{deliveryJobs.active.length}</span>
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        History
                    </button>
                </nav>
            </div>
            {/* Tab Content */}
             <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                 {activeTab === 'available' && (deliveryJobs.available.length > 0 ? deliveryJobs.available.map(c => renderJobCard(c, 'available')) : <p className="text-gray-500 text-center py-8">No available jobs right now.</p>)}
                 {activeTab === 'active' && (deliveryJobs.active.length > 0 ? deliveryJobs.active.map(c => renderJobCard(c, 'active')) : <p className="text-gray-500 text-center py-8">You have no active deliveries.</p>)}
                 {activeTab === 'history' && (deliveryJobs.history.length > 0 ? deliveryJobs.history.map(c => renderHistoryCard(c)) : <p className="text-gray-500 text-center py-8">Your delivery history is empty.</p>)}
             </div>
        </div>

        <div>
            {/* FIX: Replaced `claim` prop with `conversationId` and passed the correct conversation ID.
                This resolves the type error, as the ChatWindow component expects a `conversationId` string, not a `claim` object. */}
            {activeConversation ? (
                <ChatWindow key={activeConversation.id} conversationId={activeConversation.id} />
            ) : (
                <div className="border-2 border-dashed rounded-lg h-full flex flex-col justify-center items-center text-center p-6 bg-gray-50">
                    <i className="fas fa-route text-5xl text-gray-300 mb-4"></i>
                    <h3 className="font-semibold text-lg text-gray-600">Delivery Details & Chat</h3>
                    <p className="text-sm text-gray-500">Accept a job or select an active delivery to see details and chat with participants.</p>
                </div>
            )}
        </div>
       </div>
       <ProofOfDeliveryModal
        isOpen={!!podModalClaim}
        onClose={() => setPodModalClaim(null)}
        claim={podModalClaim}
        onSubmit={(claimId) => handleUpdateStatus(claimId, ClaimStatus.Delivered)}
       />
       <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSubmit={handleVerificationSubmit}
       />
    </div>
  );
};

export default DeliveryDashboardPage;