import React from 'react';

function DashboardContent({ username }) {
  return (
    <div className="dashboard-content">
      <h2>Welcome, {username}!</h2>
    </div>
  );
}

export default DashboardContent;