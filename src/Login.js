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
      // Build the direct API URL
      const directUrl = `${API_BASE_URL}/login.php?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`;
      
      console.log('🚀 Trying direct request to:', directUrl);

      // Try direct request first
      let response;
      try {
        response = await axios.get(directUrl, {
          timeout: 8000,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('✅ Direct request successful:', response.data);
      } catch (corsError) {
        console.log('❌ Direct request failed (CORS), trying proxy...');
        
        // Use CORS proxy as fallback
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(directUrl)}`;
        console.log('🔄 Using proxy:', proxyUrl);
        
        const proxyResponse = await axios.get(proxyUrl, {
          timeout: 15000,
        });
        
        console.log('📦 Proxy raw response:', proxyResponse.data);
        
        // Parse the response from the proxy
        const responseData = JSON.parse(proxyResponse.data.contents);
        response = { data: responseData };
        console.log('✅ Parsed proxy response:', responseData);
      }

      if (response.data && response.data.success) {
        console.log('🎉 Login successful!');
        
        // Store user data
        if (typeof Storage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('👤 User data stored:', response.data.user);
        }
        
        navigate('/dash');
      } else {
        const errorMsg = response.data?.message || 'Invalid username or password.';
        console.log('❌ Login failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('🔥 Complete login error:', error);
      
      if (error.response) {
        console.log('Response error:', error.response.status, error.response.data);
        setError(`Server error: ${error.response.status}`);
      } else if (error.request) {
        console.log('Network error:', error.request);
        setError('Network error. Please check your connection.');
      } else {
        console.log('Setup error:', error.message);
        setError('Login system error. Please try again.');
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
    },
    loginBox: {
      position: 'relative',
      width: '400px',
      height: '450px',
      background: 'transparent',
      borderRadius: '15px',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(15px)',
    },
    form: {
      width: '100%',
      padding: '20px',
    },
    title: {
      fontSize: '2em',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '20px',
    },
    inputBox: {
      position: 'relative',
      width: '100%',
      margin: '25px 0',
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
      height: '45px',
      backgroundColor: loading ? '#ccc' : '#fff',
      border: 'none',
      borderRadius: '40px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: '1em',
      color: '#000',
      fontWeight: '600',
      opacity: loading ? 0.7 : 1,
      transition: 'all 0.3s ease',
      marginTop: '20px',
    },
    registerLink: {
      fontSize: '0.9em',
      color: '#fff',
      textAlign: 'center',
      marginTop: '25px',
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.85rem',
      marginBottom: '15px',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 107, 107, 0.15)',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 107, 107, 0.4)',
      backdropFilter: 'blur(10px)',
    },
    corsNotice: {
      fontSize: '0.8em',
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: '15px',
      padding: '8px',
      backgroundColor: 'rgba(255, 255, 0, 0.1)',
      borderRadius: '5px',
      border: '1px solid rgba(255, 255, 0, 0.3)',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <div style={styles.form}>
          <h2 style={styles.title}>Login</h2>
          
          <div style={styles.corsNotice}>
            Using CORS proxy for backend compatibility
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
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
          </form>
          
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
