import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MenuBar from '../components/MenuBar';
import DashboardContent from '../components/DashboardContent';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  // get the username from the state (if exists)
  const { username } = location.state || { username: '' };

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div>
      <Header />
      <MenuBar onNavigate={handleNavigation} />
      <DashboardContent username={username} />
    </div>
  );
}

export default Dashboard;
