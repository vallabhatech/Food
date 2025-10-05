import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { User, VerificationStatus, ChatRequestStatus } from '../types';
import AchievementBadge from '../components/AchievementBadge';
import { ACHIEVEMENTS } from '../constants';
import Button from '../components/ui/Button';
import { useNotification } from '../contexts/NotificationContext';

const Rating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
      {halfStar && <i className="fas fa-star-half-alt"></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
      <span className="ml-2 text-gray-600 text-sm">({rating.toFixed(1)})</span>
    </div>
  );
};

const VerificationStatusBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
    const statusMap = {
        [VerificationStatus.Verified]: { text: 'Verified', icon: 'fas fa-check-circle', color: 'bg-green-100 text-green-800' },
        [VerificationStatus.Pending]: { text: 'Pending Review', icon: 'fas fa-clock', color: 'bg-yellow-100 text-yellow-800' },
        [VerificationStatus.Rejected]: { text: 'Rejected', icon: 'fas fa-times-circle', color: 'bg-red-100 text-red-800' },
        [VerificationStatus.NotSubmitted]: { text: 'Verification Required', icon: 'fas fa-exclamation-triangle', color: 'bg-gray-100 text-gray-800' },
    };
    const { text, icon, color } = statusMap[status];
    return (
         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
            <i className={`${icon} mr-2`}></i> {text}
        </span>
    );
};

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { users, toggleFollowUser, conversations, chatRequests, sendChatRequest } = useData();
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const user = users.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">User not found</h2>
        <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  const socialIcons: { [key: string]: string } = {
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin',
    github: 'fab fa-github',
  };

  const userHasAchievement = (achievementId: string) => {
      return user.achievements.some(a => a.achievementId === achievementId);
  }

  const isFollowing = currentUser?.following.includes(user.id);

  const handleFollowToggle = () => {
    if (currentUser) {
      toggleFollowUser(currentUser.id, user.id);
      if (isFollowing) {
        addNotification(`You have unfollowed ${user.name}.`, 'info');
      } else {
        addNotification(`You are now following ${user.name}!`, 'success');
      }
    }
  };
  
  const handleMessage = () => {
    if (!currentUser) return;
    
    // Check if conversation already exists
    const existingConversation = conversations.find(c => 
        c.participantIds.includes(currentUser.id) && c.participantIds.includes(user.id)
    );
    if(existingConversation) {
        navigate(`/chat/${existingConversation.id}`);
        return;
    }

    // Check if a request is already pending
    const pendingRequest = chatRequests.find(r => 
        (r.fromUserId === currentUser.id && r.toUserId === user.id && r.status === ChatRequestStatus.Pending) ||
        (r.fromUserId === user.id && r.toUserId === currentUser.id && r.status === ChatRequestStatus.Pending)
    );
    if(pendingRequest) {
        addNotification('A chat request is already pending with this user.', 'info');
        navigate('/chat');
        return;
    }
    
    // Send new request
    sendChatRequest(currentUser.id, user.id);
    addNotification(`Chat request sent to ${user.name}!`, 'success');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center text-center">
                <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full border-4 border-green-300 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-md text-gray-500 mb-2">{user.role}</p>
                <Rating rating={user.rating} />
                <div className="flex space-x-6 my-4 text-gray-600">
                    <div>
                        <span className="font-bold text-gray-800">{user.followers.length}</span> Followers
                    </div>
                    <div>
                        <span className="font-bold text-gray-800">{user.following.length}</span> Following
                    </div>
                </div>
                <p className="mt-2 text-gray-700 max-w-lg">{user.bio}</p>
                
                {currentUser && currentUser.id !== user.id && (
                    <div className="mt-6 flex gap-2">
                        <Button onClick={handleFollowToggle} variant={isFollowing ? 'secondary' : 'primary'}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                        <Button onClick={handleMessage}>
                            <i className="fas fa-comment-dots mr-2"></i> Message
                        </Button>
                    </div>
                )}
            </div>
        </div>

        {user.deliveryPartner && (
           <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Delivery Partner Details</h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-center">
                    <div>
                        <VerificationStatusBadge status={user.deliveryPartner.verificationStatus} />
                         <p className="text-xs text-gray-500 mt-1">Status</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-800 flex items-center gap-2"><i className="fas fa-car text-gray-500"></i> {user.deliveryPartner.vehicleType}</p>
                        <p className="text-xs text-gray-500 mt-1">Vehicle</p>
                    </div>
                    <div>
                         <p className={`font-semibold flex items-center gap-2 ${user.deliveryPartner.availability === 'Online' ? 'text-green-700' : 'text-gray-600'}`}>
                            <span className={`h-2 w-2 rounded-full ${user.deliveryPartner.availability === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {user.deliveryPartner.availability}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Availability</p>
                    </div>
                </div>
           </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg p-8">
             <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Achievements</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {ACHIEVEMENTS.map(ach => (
                     <AchievementBadge 
                        key={ach.id} 
                        achievement={ach} 
                        unlocked={userHasAchievement(ach.id)} 
                    />
                 ))}
             </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connect with {user.name.split(' ')[0]}</h2>
            <div className="space-y-3 max-w-sm mx-auto">
            {Object.entries(user.socialLinks).map(([platform, url]) => (
                <a 
                key={platform} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-full p-4 bg-gray-100 rounded-lg hover:bg-green-100 transition-colors"
                >
                <i className={`${socialIcons[platform]} text-xl text-gray-600 group-hover:text-green-700`}></i>
                <span className="ml-4 font-semibold text-gray-700 group-hover:text-green-800 capitalize">{platform}</span>
                </a>
            ))}
            {Object.keys(user.socialLinks).length === 0 && (
                <p className="text-center text-gray-500">This user has not added any social links yet.</p>
            )}
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;