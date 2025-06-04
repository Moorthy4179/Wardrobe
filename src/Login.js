import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMail, IoLockClosed } from 'react-icons/io5';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get API URL from environment variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alumnibackend.42web.io/vwobackend';

  // Debug: Log environment variables (remove this in production)
  useEffect(() => {
    console.log('🔧 Environment Debug Info:');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('All NEXT_PUBLIC vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
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
      const loginUrl = `${API_BASE_URL}/login.php`;
      console.log('🚀 Making request to:', loginUrl);

      const response = await axios.get(loginUrl, {
        params: {
          username: credentials.username,
          password: credentials.password,
        },
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Response received:', response.data);

      if (response.data && response.data.success) {
        // Store user data
        if (typeof Storage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('👤 User data stored:', response.data.user);
        }
        
        console.log('🎉 Login successful, redirecting to /dash');
        navigate('/dash');
      } else {
        const errorMsg = response.data?.message || 'Invalid username or password.';
        console.log('❌ Login failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('🔥 Login error:', error);
      
      // Detailed error logging
      if (error.response) {
        console.log('Response error:', error.response.status, error.response.data);
        setError(`Server error: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.log('Request error (no response):', error.request);
        setError('No response from server. Please check if the backend is running.');
      } else {
        console.log('Setup error:', error.message);
        setError(`Request setup error: ${error.message}`);
      }

      // Specific error handling
      if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and backend server.');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (error.message.includes('CORS')) {
        setError('CORS error. Please check backend CORS configuration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      animation: 'animateBg 5s linear infinite',
    },
    loginBox: {
      position: 'relative',
      width: '400px',
      height: '500px', // Slightly increased for debug info
      background: 'transparent',
      borderRadius: '15px',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(15px)',
    },
    title: {
      fontSize: '2em',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '10px',
    },
    debugInfo: {
      fontSize: '0.7em',
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: '15px',
      padding: '5px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '5px',
      wordBreak: 'break-all',
    },
    inputBox: {
      position: 'relative',
      width: '310px',
      margin: '20px 0',
      borderBottom: '1px solid #fff',
    },
    input: {
      width: '100%',
      height: '50px',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontSize: '1em',
      color: '#fff',
      padding: '0 35px 0 5px',
    },
    icon: {
      position: 'absolute',
      right: '8px',
      top: '50%',
      color: '#fff',
      transform: 'translateY(-50%)',
    },
    button: {
      width: '100%',
      height: '40px',
      backgroundColor: loading ? '#ccc' : '#fff',
      border: 'none',
      borderRadius: '40px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: '1em',
      color: '#000',
      fontWeight: '500',
      opacity: loading ? 0.7 : 1,
      transition: 'all 0.3s ease',
    },
    registerLink: {
      fontSize: '0.9em',
      color: '#fff',
      textAlign: 'center',
      margin: '20px 0 10px',
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.85rem',
      marginBottom: '1rem',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 107, 107, 0.3)',
      backdropFilter: 'blur(10px)',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <form onSubmit={handleSubmit}>
          <h2 style={styles.title}>Login</h2>
          
          {/* Debug info - remove this in production */}
          <div style={styles.debugInfo}>
            API: {API_BASE_URL}
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.inputBox}>
            <span style={styles.icon}>
              <IoMail />
            </span>
            <input
              type="text"
              name="username"
              placeholder="Enter username or email"
              style={styles.input}
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div style={styles.inputBox}>
            <span style={styles.icon}>
              <IoLockClosed />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              style={styles.input}
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div style={styles.registerLink}>
            <p>
              Don't have an account?{' '}
              <span
                style={{ 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}
                onClick={handleSignUpClick}
              >
                Register
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
