import React, { useState } from 'react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://alumnibackend.42web.io/vwobackend';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError('Please fill in both fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const directUrl = `${API_BASE_URL}/login.php?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`;
      
      console.log('🚀 Trying request to:', directUrl);

      let responseData;

      try {
        // Try direct request first using fetch
        const response = await fetch(directUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        if (response.ok) {
          responseData = await response.json();
          console.log('✅ Direct request successful:', responseData);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (corsError) {
        console.log('❌ Direct request failed (CORS), trying proxy...');
        
        // Since direct browser test works, let's try a different approach
        // Try multiple CORS proxies in sequence
        const proxies = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(directUrl)}`,
          `https://corsproxy.io/?${encodeURIComponent(directUrl)}`,
          `https://cors-anywhere.herokuapp.com/${directUrl}`,
          // Alternative format for allorigins
          `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`
        ];

        let lastError = null;
        
        for (let i = 0; i < proxies.length; i++) {
          const proxyUrl = proxies[i];
          console.log(`🔄 Trying proxy ${i + 1}/${proxies.length}:`, proxyUrl);
          
          try {
            const proxyResponse = await fetch(proxyUrl);
            
            if (!proxyResponse.ok) {
              throw new Error(`Proxy HTTP ${proxyResponse.status}`);
            }
            
            let content;
            const contentType = proxyResponse.headers.get('content-type') || '';
            
            if (contentType.includes('application/json')) {
              const proxyData = await proxyResponse.json();
              content = proxyData.contents || proxyData;
            } else {
              content = await proxyResponse.text();
            }
            
            console.log('📦 Proxy raw response:', content);

            // Check if the response looks like HTML
            if (typeof content === 'string' && 
                (content.includes('<html>') || content.includes('<script>') || content.includes('<!DOCTYPE'))) {
              console.log('❌ Proxy returned HTML, trying next proxy...');
              lastError = new Error('Proxy returned HTML instead of JSON');
              continue;
            }

            // Try to parse as JSON
            let parsedContent;
            if (typeof content === 'string') {
              if (isValidJSON(content)) {
                parsedContent = JSON.parse(content);
              } else {
                console.log('❌ Invalid JSON from proxy, trying next...');
                lastError = new Error('Invalid JSON from proxy');
                continue;
              }
            } else {
              parsedContent = content;
            }
            
            responseData = parsedContent;
            console.log('✅ Successfully got data via proxy:', responseData);
            break;
            
          } catch (proxyError) {
            console.log(`❌ Proxy ${i + 1} failed:`, proxyError.message);
            lastError = proxyError;
            continue;
          }
        }
        
        if (!responseData) {
          throw lastError || new Error('All proxy attempts failed');
        }
      }

      // Check if we have valid response data
      if (!responseData) {
        throw new Error('No valid response received from server');
      }

      if (responseData.success) {
        console.log('🎉 Login successful!');
        setError(''); // Clear any previous errors
        
        if (responseData.user) {
          console.log('👤 User data received:', responseData.user);
        }
        
        // Simulate navigation (in real app, would use navigate('/dash'))
        alert('Login successful! Redirecting to dashboard...');
      } else {
        const errorMsg = responseData.message || 'Invalid username or password.';
        console.log('❌ Login failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('🔥 Complete login error:', error);
      
      if (error.message.includes('HTML')) {
        setError('Backend Error: Server is returning HTML instead of JSON. Please check your PHP backend configuration.');
      } else if (error.message.includes('HTTP')) {
        setError('Server Error: Backend returned an HTTP error. Please check if the server is running.');
      } else if (error.message.includes('JSON')) {
        setError('Format Error: Backend response is not valid JSON. Please check your PHP script.');
      } else if (error.message.includes('fetch')) {
        setError('Network Error: Cannot connect to backend. Please check your internet connection.');
      } else {
        setError(`Login Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    alert('Signup clicked! In real app, would navigate to /signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
        
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 mb-4 text-sm text-blue-200">
          <strong>Debug Info:</strong><br />
          Backend: {API_BASE_URL}<br />
          Status: {loading ? 'Connecting...' : 'Ready'}<br />
          <em>Check console for detailed logs</em><br />
          <br />
          <strong>Backend Test:</strong> Since your backend returns<br />
          <code>{"success":false,"message":"Invalid credentials"}</code><br />
          the issue is with CORS proxy getting HTML instead of JSON.
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-200 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Enter username or email"
              className="w-full bg-transparent border-b border-white/50 pb-2 text-white placeholder-white/70 focus:outline-none focus:border-white"
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <div className="absolute right-2 top-0 text-white/70">
              📧
            </div>
          </div>
          
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="w-full bg-transparent border-b border-white/50 pb-2 text-white placeholder-white/70 focus:outline-none focus:border-white"
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <div className="absolute right-2 top-0 text-white/70">
              🔒
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-gray-100 active:scale-95'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
        <div className="text-center mt-6 text-white/80">
          <p>
            Don't have an account?{' '}
            <span
              className="cursor-pointer font-semibold underline hover:text-white"
              onClick={handleSignUpClick}
            >
              Register
            </span>
          </p>
        </div>
        
        <div className="mt-6 text-xs text-white/60 bg-yellow-500/20 border border-yellow-500/50 rounded p-2">
          <strong>Troubleshooting Tips:</strong><br />
          1. Make sure your PHP backend returns JSON with proper headers<br />
          2. Check browser console for detailed error logs<br />
          3. Verify your backend URL is correct<br />
          4. Ensure your server is running and accessible
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
