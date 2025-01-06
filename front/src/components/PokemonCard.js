import React from 'react';

function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
      <h2>{pokemon.name}</h2>
      <img src={pokemon.image} alt={pokemon.name} />
      <p><strong>Type:</strong> {pokemon.type}</p>
      <p><strong>Abilities:</strong> {pokemon.abilities.join(', ')}</p>
    </div>
  );
}

export default PokemonCard;