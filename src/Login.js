import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMail, IoLockClosed } from 'react-icons/io5'; 

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alumnibackend.42web.io/vwobackend';
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Please fill in both fields.');
    } else {
      setError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/login.php`, {
  params: {
    username: credentials.username, 
    password: credentials.password,
  },
});
        if (response.data.success) {
          navigate('/dash');
        } else {
          setError('Invalid username or password.');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('An error occurred during login. Please try again later.');
      }
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
      backgroundImage: "url('http://codingstella.com/wp-content/uploads/2024/01/download-5.jpeg')",
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
      backgroundColor: '#fff',
      border: 'none',
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '1em',
      color: '#000',
      fontWeight: '500',
    },
    registerLink: {
      fontSize: '0.9em',
      color: '#fff',
      textAlign: 'center',
      margin: '25px 0 10px',
    },
    error: {
      color: 'red',
      fontSize: '0.9rem',
      marginBottom: '1rem',
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
              <IoMail /> {/* Email Icon */}
            </span>
            <input
              type="text"
              name="username"
              placeholder="Enter your username or email"
              style={styles.input}
              value={credentials.username}
              onChange={handleChange}
              required
            />
            <label style={styles.label}></label>
          </div>
          <div style={styles.inputBox}>
            <span style={styles.icon}>
              <IoLockClosed /> {/* Lock Icon */}
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              style={styles.input}
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <label style={styles.label}></label>
          </div>
          <button type="submit" style={styles.button}>Login</button>
          <div style={styles.registerLink}>
            <p>
              Don't have an account?{' '}
              <span style={{ cursor: 'pointer', fontWeight: '600' }} onClick={handleSignUpClick}>
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
