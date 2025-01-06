import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import { loginUser } from '../services/Api'; 
import { UserContext } from '../context/UserContext'; 

function Login() {
  const navigate = useNavigate();
  const { setUsername } = useContext(UserContext);

  const handleLogin = async (username, password) => {
    try {
      await loginUser(username, password); 
      console.log('Login successful: ', username);

      setUsername(username); // Store username in context

      // Navigate to the dashboard with user details
      navigate('/dashboard', { state: { username, password } });
    } catch (error) {
      console.error('Login failed:', error.message);
      alert(error.message); 
    }
  };

  return (
    <div>
      <Header />
      <h1 className="center-login-header">Login</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default Login;