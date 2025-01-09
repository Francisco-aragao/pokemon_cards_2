export const fetchPokemon = async (pokemonName) => {
  try {
    const response = await fetch(`http://localhost:8000/api/pokemon/${pokemonName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon.');
    }

    console.log('OI')
    const data = await response.json();
    console.log('Data ', data)
    return data;
  } catch (error) {
    console.error('Error fetching Pokémon data:' + error.message);
    alert('Error fetching Pokémon data' + error.message);
    throw error;
  }
};

// Function to handle login
export const loginUser = async (username, password) => {
  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response || !response.ok) {
      const errorResponse = await response.json(); 
      const errorMessage = errorResponse.detail; 
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data == false) {
      const errorResponse = await response.json(); 
      const errorMessage = errorResponse.detail; 
      throw new Error(errorMessage);
    }

    return;
  } catch (error) {
    console.error('Error Login:' + error.message);
    alert('Error Login:' + error.message);
    throw error;
  }
};

// Function to handle create user
export const createUser = async (username, password) => {
  try {
    const response = await fetch('http://localhost:8000/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log(response)

    // get the response from the server

    
    if (!response || !response.ok) {
      const errorResponse = await response.json(); 
      const errorMessage = errorResponse.detail; 
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data == false) {
      const errorResponse = await response.json(); 
      const errorMessage = errorResponse.detail; 
      throw new Error(errorMessage);
    }

    return;
  } catch (error) {
    console.error('Error Create User:' + error.message);
    alert('Error Create User:' + error.message);
    throw error;
  }
};

export const addPokemon = async (pokemonName, username) => {
  console.log(username)
  try {
    const response = await fetch(`http://localhost:8000/api/addPokemon/${pokemonName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response || !response.ok) {
      const errorResponse = await response.json(); 
      const errorMessage = errorResponse.detail; 
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error Add Pokémon:' + error.message);
    alert('Error Remove Pokémon:' + error.message);
    throw error;
  }
};

export const removePokemon = async (pokemonName, username) => {
  try {
    const response = await fetch(`http://localhost:8000/api/removePokemon/${pokemonName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    
    if (!response || !response.ok) {
      const errorResponse = await response.json(); 
      const errorMessage = errorResponse.detail; 
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error Remove Pokémon:' + error.message);
    alert('Error Remove Pokémon:' + error.message);
    throw error;
  }
};

export const getPokemons = async (username) => {
  try {
    const response = await fetch(`http://localhost:8000/api/getPokemons/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response || !response.ok) {
      const errorResponse = await response.json(); 
      const errorMessage = errorResponse.detail; 
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error Get Pokémons:' + error.message);
    alert('Error Get Pokémons:' + error.message);
    throw error;
  }
};