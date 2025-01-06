import React from 'react';

function MenuBar({ onNavigate }) {
  return (
    <nav className="menu-bar">
      <button onClick={() => onNavigate('/add-pokemon')}>Add Pokémon</button>
      <button onClick={() => onNavigate('/remove-pokemon')}>Remove Pokémon</button>
      <button onClick={() => onNavigate('/get-pokemons')}>See Pokémons</button>
      <button onClick={() => onNavigate('/')}>Logout</button>
    </nav>
  );
}

export default MenuBar;