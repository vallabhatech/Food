import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, User, VerificationStatus } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AdminDashboardPage: React.FC = () => {
  const { users, updateUserRole, removeUser, updateVerificationStatus } = useData();
  const { currentUser } = useAuth();

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole(userId, newRole);
  };

  const handleRemoveUser = (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
      removeUser(userId);
    }
  };
  
  const handleVerification = (partnerId: string, newStatus: VerificationStatus.Verified | VerificationStatus.Rejected) => {
      updateVerificationStatus(partnerId, newStatus);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.id === currentUser?.id ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role} (You)
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      >
                        {Object.values(UserRole).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role === UserRole.DeliveryPartner && user.deliveryPartner ? (
                          <div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                {
                                    [VerificationStatus.Verified]: 'bg-green-100 text-green-800',
                                    [VerificationStatus.Pending]: 'bg-yellow-100 text-yellow-800',
                                    [VerificationStatus.Rejected]: 'bg-red-100 text-red-800',
                                    [VerificationStatus.NotSubmitted]: 'bg-gray-100 text-gray-800',
                                }[user.deliveryPartner.verificationStatus]
                            }`}>
                                {user.deliveryPartner.verificationStatus}
                            </span>
                             {user.deliveryPartner.verificationStatus === VerificationStatus.Pending && (
                                 <div className="mt-2 space-y-2">
                                     <div>
                                         <a href={user.deliveryPartner.driversLicenseUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View License</a>
                                          <a href={user.deliveryPartner.insuranceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-blue-600 hover:underline">View Insurance</a>
                                     </div>
                                     <div>
                                         <Button onClick={() => handleVerification(user.id, VerificationStatus.Rejected)} variant="danger" className="text-xs px-2 py-0.5 mr-1">Reject</Button>
                                         <Button onClick={() => handleVerification(user.id, VerificationStatus.Verified)} variant="primary" className="text-xs px-2 py-0.5">Approve</Button>
                                     </div>
                                 </div>
                             )}
                          </div>
                      ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.id !== currentUser?.id && (
                      <Button onClick={() => handleRemoveUser(user.id)} variant="danger" className="text-xs px-3 py-1">
                        Remove
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;