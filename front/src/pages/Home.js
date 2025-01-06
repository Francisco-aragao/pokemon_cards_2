import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';
import NavigationButton from '../components/NavigationButton';
import { fetchPokemon } from '../services/Api';

function Home() {
  const [pokemon, setPokemon] = useState(null);

  const handleSearch = async (pokemonName) => {
    try {
      const data = await fetchPokemon(pokemonName);
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      setPokemon(null);
    }
  };

  return (
    <div>
      <Header />
      <SearchBar onSearch={handleSearch} />
      {pokemon && <PokemonCard pokemon={pokemon} />}
      <NavigationButton to="/login" label="Login" />
      <NavigationButton to="/create" label="Create User" />
    </div>
  );
}

export default Home;
