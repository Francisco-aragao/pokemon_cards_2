import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavigationButton({ to, label }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button onClick={handleClick} className='center-button'>
      {label}
    </button>
  );
}

export default NavigationButton;