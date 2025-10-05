import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import { FoodStatus } from '../types';

const ExpirationChecker: React.FC = () => {
  const { currentUser } = useAuth();
  const { foodItems } = useData();
  const { addNotification } = useNotification();

  useEffect(() => {
    const checkExpiration = () => {
      if (!currentUser) return;

      const myActiveItems = foodItems.filter(
        item =>
          item.postedBy === currentUser.id &&
          (item.status === FoodStatus.Available || item.status === FoodStatus.Reserved)
      );

      myActiveItems.forEach(item => {
        const hoursUntilExpiry = (new Date(item.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60);
        const notificationKey = `expiration_notified_${item.id}`;

        if (hoursUntilExpiry > 0 && hoursUntilExpiry <= 24) {
          // Check if user has already been notified in this session
          if (!sessionStorage.getItem(notificationKey)) {
            addNotification(`Your item "${item.title}" is expiring soon!`, 'warning');
            sessionStorage.setItem(notificationKey, 'true');
          }
        }
      });
    };

    // Check immediately on load and then every minute
    checkExpiration();
    const intervalId = setInterval(checkExpiration, 60 * 1000); 

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);

  }, [currentUser, foodItems, addNotification]);

  return null; // This component does not render anything
};

export default ExpirationChecker;