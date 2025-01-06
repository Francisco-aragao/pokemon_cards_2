import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import { getPokemons } from '../services/Api'; 
import { UserContext } from '../context/UserContext'; 
import PokemonCard from '../components/PokemonCard';

function GetPokemons() {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);
  const { username } = useContext(UserContext);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const data = await getPokemons(username); 
        setPokemons(data);
      } catch (error) {
        console.log('Error fetching Pokémon data:', error);
      } 
    };

    loadPokemons();
  }, [username]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // run over all the pokemons in a list and print them using the Pokemon card structure
  return (
    <div>
      <Header />
      <h1 className="center-login-header">All Pokémon</h1>
      <div>
        {pokemons.map((pokemon, index) => (
          <PokemonCard key={pokemon.name || index} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}

export default GetPokemons;
