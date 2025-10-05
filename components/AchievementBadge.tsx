import React from 'react';
import { Achievement } from '../types';
import Card from './ui/Card';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, unlocked }) => {
    return (
        <div className={`text-center p-4 rounded-lg border-2 transition-all duration-300 transform ${unlocked ? 'border-green-400 bg-green-50 shadow-soft scale-100' : 'border-gray-200 bg-gray-100 opacity-60 scale-95'}`}>
            <i className={`${achievement.icon} text-4xl mb-3 ${unlocked ? 'text-green-500' : 'text-gray-400'}`}></i>
            <h3 className={`font-bold text-md ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>{achievement.title}</h3>
            {unlocked && <p className="text-xs text-gray-600">{achievement.description}</p>}
        </div>
    );
};

export default AchievementBadge;
