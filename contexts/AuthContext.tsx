import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants'; // Using mock data again

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (userId: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  users: User[]; // Expose users for management
  setUsers: React.Dispatch<React.SetStateAction<User[]>>; // Allow modification
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS); // Manage users in state
  const [loading, setLoading] = useState(false); // No real async work, so loading is simpler

  // FIX: This effect synchronizes the currentUser state with any updates made to the global users list.
  // This is crucial for changes like updating a user's profile or toggling availability to be reflected
  // across the app without requiring a re-login.
  useEffect(() => {
    if (currentUser) {
      const updatedCurrentUser = users.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
        // By stringifying, we avoid an infinite render loop if the object reference changes but the data hasn't.
        if (JSON.stringify(currentUser) !== JSON.stringify(updatedCurrentUser)) {
          setCurrentUser(updatedCurrentUser);
        }
      } else {
        // User was deleted, so log them out.
        setCurrentUser(null);
      }
    }
  }, [users, currentUser]);

  const login = (userId: string) => {
    setLoading(true);
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  };
  
  const register = (name: string, email: string) => {
    // This is a mock registration
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        avatarUrl: `https://picsum.photos/seed/${name}/100`,
        role: UserRole.Applicant,
        rating: 0,
        location: { lat: 40.7128, lng: -74.0060 }, // Default location
        socialLinks: {},
        bio: 'A new member of the NourishNet community!',
        achievements: [],
        following: [],
        followers: [],
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser); // Auto-login after registration
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Provide users and setUsers in the context value
  const value = { currentUser, loading, login, register, logout, users, setUsers };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};