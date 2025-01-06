import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { addPokemon } from '../services/Api'; 
import { UserContext } from '../context/UserContext';

function AddPokemon() {
    const [pokemon, setPokemon] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); 
    const { username } = useContext(UserContext);

    const handleSearch = async (pokemonName) => {
        try {
            const sucess = await addPokemon(pokemonName, username);

            if (!sucess) {
                throw new Error('Failed to add Pokémon.');
            }

            // set usefull info in the state
            setPokemon({ name: pokemonName });
            setSuccessMessage(`Success! Pokémon "${pokemonName}" has been added.`);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            setPokemon(null);
            setSuccessMessage('Failed to add Pokémon. Please try again.');
        }
    };

    return (
        <div>
            <Header />
            <h1 className="center-login-header">Add Pokémon</h1>
            <SearchBar onSearch={handleSearch} />
            {pokemon && (
                <div>
                    <p style={{ textAlign: 'center' }}>
                        {successMessage}</p> {}
                </div>
            )}
        </div>
    );
}

export default AddPokemon;