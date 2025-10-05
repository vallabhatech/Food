import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { USERS } from '../constants';

const LoginPage: React.FC = () => {
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate backend validation
    setTimeout(() => {
      const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        // In a real app, you'd validate the password here.
        // For this demo, we'll accept the hardcoded password.
        if (password === 'password') {
            login(user.id);
        } else {
            setError('Invalid email or password.');
        }
      } else {
        setError('Invalid email or password.');
      }
      setIsLoading(false);
    }, 500);
  };

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
              create a new account
            </Link>
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
              <Button type="submit" isLoading={isLoading} className="w-full">
                Sign in
              </Button>
            </div>
          </form>
        </Card>
        
        <Card className="p-6 bg-green-50 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 text-center mb-4">Demo Accounts</h3>
            <div className="text-sm text-gray-700 space-y-2">
                <p>You can use the following credentials to explore the app:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong className="font-medium">Admin:</strong> admin@nourish.net</li>
                    <li><strong className="font-medium">Donor (Baker):</strong> alice@nourish.net</li>
                    <li><strong className="font-medium">Donor (Gardener):</strong> grace@nourish.net</li>
                    <li><strong className="font-medium">Claimer:</strong> frank@nourish.net</li>
                    <li><strong className="font-medium">Verified Partner:</strong> diana@nourish.net</li>
                    <li><strong className="font-medium">Unverified Partner:</strong> dave@nourish.net</li>
                    <li><strong className="font-medium">New Applicant:</strong> bob@nourish.net</li>
                </ul>
                <p className="text-center font-semibold pt-2">Note: The password for all accounts is <code className="bg-gray-200 px-1 rounded">password</code>.</p>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;