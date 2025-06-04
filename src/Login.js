import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const API_BASE_URL = 'https://alumnibackend.42web.io/vwobackend';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use GET request to avoid CORS preflight issues
      const url = `${API_BASE_URL}/login-get.php?username=${encodeURIComponent(credentials.username.trim())}&password=${encodeURIComponent(credentials.password)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (data && data.success) {
        console.log('Login successful:', data);
        // Navigate to dashboard - replace with your navigation logic
        alert('Login successful! Redirecting to dashboard...');
      } else {
        setError(data?.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    // Replace with your navigation logic
    alert('Redirecting to signup page...');
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          <div onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                  <Mail size={20} />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username or email"
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:border-white focus:outline-none transition-colors"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:border-white focus:outline-none transition-colors"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="text-center text-white/90 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleSignUpClick}
                className="font-semibold hover:underline cursor-pointer"
                disabled={loading}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
