import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const icons = {
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
  };

  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  return (
    <div className="fixed top-20 right-0 p-4 space-y-3 z-[100]">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`relative flex items-center text-white p-4 pr-10 rounded-lg shadow-lg w-80 animate-fade-in-right ${colors[notification.type]}`}
        >
          <i className={`${icons[notification.type]} text-xl mr-3`}></i>
          <p className="text-sm font-medium">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="absolute top-1 right-1 text-white opacity-70 hover:opacity-100"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
       <style>{`
        @keyframes fade-in-right {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        .animate-fade-in-right {
            animation: fade-in-right 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default NotificationContainer;