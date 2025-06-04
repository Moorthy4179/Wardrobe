import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMail, IoLockClosed } from 'react-icons/io5';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use env var or fallback URL
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
      // Configure axios with timeout and proper headers
      const config = {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          username: credentials.username,
          password: credentials.password,
        },
      };

      const response = await axios.get(`${API_BASE_URL}/login.php`, config);

      if (response.data && response.data.success) {
        // Store user data if needed
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dash');
      } else {
        setError(response.data?.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (error.response) {
        setError(error.response.data?.message || 'Server error occurred.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
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
      // Changed to HTTPS URL to fix mixed content warning
      backgroundImage: "url('https://codingstella.com/wp-content/uploads/2024/01/download-5.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      animation: 'animateBg 5s linear infinite',
    },
    '@keyframes animateBg': {
      to: {
        filter: 'hue-rotate(360deg)',
      },
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
    title: {
      fontSize: '2em',
      color: '#fff',
      textAlign: 'center',
    },
    inputBox: {
      position: 'relative',
      width: '310px',
      margin: '30px 0',
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
    label: {
      position: 'absolute',
      top: '50%',
      left: '5px',
      transform: 'translateY(-50%)',
      fontSize: '1em',
      color: '#fff',
      pointerEvents: 'none',
      transition: '0.5s',
    },
    icon: {
      position: 'absolute',
      right: '8px',
      top: '50%',
      color: '#fff',
      transform: 'translateY(-50%)',
    },
    rememberForgot: {
      margin: '-15px 0 15px',
      fontSize: '0.9em',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
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
    },
    registerLink: {
      fontSize: '0.9em',
      color: '#fff',
      textAlign: 'center',
      margin: '25px 0 10px',
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.9rem',
      marginBottom: '1rem',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid rgba(255, 107, 107, 0.3)',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <form onSubmit={handleSubmit}>
          <h2 style={styles.title}>Login</h2>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.inputBox}>
            <span style={styles.icon}>
              <IoMail />
            </span>
            <input
              type="text"
              name="username"
              placeholder="Enter your username or email"
              style={styles.input}
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <label style={styles.label}></label>
          </div>
          <div style={styles.inputBox}>
            <span style={styles.icon}>
              <IoLockClosed />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              style={styles.input}
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <label style={styles.label}></label>
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div style={styles.registerLink}>
            <p>
              Don't have an account?{' '}
              <span
                style={{ cursor: 'pointer', fontWeight: '600' }}
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
