import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Link, Navigate } from 'react-router-dom';
import { Claim, FoodItem, UserRole, ClaimStatus, Achievement } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ACHIEVEMENTS } from '../constants';
import AchievementBadge from '../components/AchievementBadge';

const StatBlock: React.FC<{ icon: string; value: string | number; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className="bg-white rounded-lg p-6 flex items-center shadow-soft">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <i className={`${icon} text-white text-xl`}></i>
        </div>
        <div className="ml-4">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { foodItems, claims, users, updateClaimStatus } = useData();

  // Redirect delivery partners to their specific dashboard
  if (currentUser?.role === UserRole.DeliveryPartner) {
    return <Navigate to="/delivery-dashboard" replace />;
  }
  
  if (!currentUser) return <p>Loading...</p>;

  const myFoodItems = foodItems.filter(item => item.postedBy === currentUser.id);
  const claimsOnMyItems = claims.filter(claim => claim.posterId === currentUser.id);
  const myRecentAchievements = currentUser.achievements
    .sort((a,b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
    .slice(0, 3)
    .map(ua => ACHIEVEMENTS.find(a => a.id === ua.achievementId))
    .filter((a): a is Achievement => a !== undefined);

  const handleClaimAction = (claimId: string, status: ClaimStatus) => {
    updateClaimStatus(claimId, status);
  };

  const getClaimerName = (claimerId: string) => users.find(u => u.id === claimerId)?.name || 'Unknown User';
  const getFoodTitle = (foodItemId: string) => foodItems.find(f => f.id === foodItemId)?.title || 'Unknown Item';

  const inProgressClaims = claimsOnMyItems.filter(c => c.status === ClaimStatus.Accepted || c.status === ClaimStatus.OutForDelivery);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-lg text-gray-600">Here's what's happening in your community.</p>
        </div>
        {(currentUser.role === UserRole.VerifiedMember || currentUser.role === UserRole.Admin) && (
            <Link to="/post-food">
                <Button variant="primary" className="mt-4 md:mt-0">
                    <i className="fas fa-plus mr-2"></i> Post New Food Item
                </Button>
            </Link>
        )}
      </div>

       {/* User Stats Section */}
      <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
              <StatBlock icon="fas fa-box" value={myFoodItems.length} label="Items Posted" color="bg-blue-500" />
              <StatBlock icon="fas fa-handshake-angle" value={claimsOnMyItems.filter(c => c.status === ClaimStatus.Delivered).length} label="Items Shared" color="bg-green-500" />
              <StatBlock icon="fas fa-star" value={currentUser.rating.toFixed(1)} label="Your Rating" color="bg-yellow-500" />
              <StatBlock icon="fas fa-user-plus" value={currentUser.following.length} label="Following" color="bg-purple-500" />
              <StatBlock icon="fas fa-users" value={currentUser.followers.length} label="Followers" color="bg-pink-500" />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Incoming/In-Progress Section */}
        <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Incoming Claim Requests</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {claimsOnMyItems.filter(c => c.status === ClaimStatus.Pending).length > 0 ? (
                  claimsOnMyItems.filter(c => c.status === ClaimStatus.Pending).map(claim => (
                    <div key={claim.id} className="p-4 bg-gray-50 rounded-lg border">
                      <p className="font-semibold text-gray-700">{getClaimerName(claim.claimerId)} requested: <span className="text-green-700">{getFoodTitle(claim.foodItemId)}</span></p>
                      <p className="text-sm text-gray-600 mt-2 p-2 bg-white rounded italic">"{claim.reason}"</p>
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button onClick={() => handleClaimAction(claim.id, ClaimStatus.Rejected)} variant="danger" className="px-3 py-1 text-xs">Reject</Button>
                        <Button onClick={() => handleClaimAction(claim.id, ClaimStatus.Accepted)} variant="primary" className="px-3 py-1 text-xs">Accept & Chat</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <i className="fas fa-inbox text-4xl text-gray-300"></i>
                    <p className="text-gray-500 mt-2">You have no pending claim requests.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">In-Progress Deliveries</h2>
               <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {inProgressClaims.length > 0 ? (
                  inProgressClaims.map(claim => (
                    <div key={claim.id} className="p-4 bg-gray-50 rounded-lg border">
                      <p className="font-semibold text-gray-700">{getFoodTitle(claim.foodItemId)} <span className="font-normal text-gray-600">for</span> {getClaimerName(claim.claimerId)}</p>
                      <p className="text-sm text-gray-500">Status: <span className="font-semibold">{claim.status}</span></p>
                      <div className="flex justify-end space-x-2 mt-3">
                         {claim.status === ClaimStatus.Accepted && (
                          <Button onClick={() => handleClaimAction(claim.id, ClaimStatus.OutForDelivery)} variant="primary" className="px-3 py-1 text-xs">
                            <i className="fas fa-truck mr-2"></i> Mark Out for Delivery
                          </Button>
                        )}
                        {claim.status === ClaimStatus.OutForDelivery && (
                          <>
                            <Button onClick={() => handleClaimAction(claim.id, ClaimStatus.DeliveryFailed)} variant="danger" className="px-3 py-1 text-xs">Delivery Failed</Button>
                            <Button onClick={() => handleClaimAction(claim.id, ClaimStatus.Delivered)} variant="primary" className="px-3 py-1 text-xs">
                              <i className="fas fa-check-circle mr-2"></i> Mark Delivered
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <i className="fas fa-box-open text-4xl text-gray-300"></i>
                    <p className="text-gray-500 mt-2">No active deliveries at the moment.</p>
                  </div>
                )}
              </div>
            </Card>
        </div>
        
        {/* Recent Achievements */}
        <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h2>
            <div className="space-y-3">
                {myRecentAchievements.length > 0 ? myRecentAchievements.map(ach => (
                    <div key={ach.id} className="flex items-center p-3 bg-green-50 rounded-md">
                        <i className={`${ach.icon} text-green-500 text-2xl w-8 text-center`}></i>
                        <div className="ml-3">
                            <p className="font-semibold text-sm text-gray-800">{ach.title}</p>
                            <p className="text-xs text-gray-600">{ach.description}</p>
                        </div>
                    </div>
                )) : (
                     <div className="text-center py-10">
                        <i className="fas fa-trophy text-4xl text-gray-300"></i>
                        <p className="text-gray-500 mt-2 text-sm">Start sharing to earn badges!</p>
                    </div>
                )}
                 <Link to={`/profile/${currentUser.id}`} className="text-sm text-green-600 hover:underline font-semibold mt-4 block text-center">View All Achievements</Link>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;