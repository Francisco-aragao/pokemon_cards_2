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
    console.error('Error fetching Pokémon data:', error);
    alert('Error fetching Pokémon data');
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
      throw new Error('Invalid username or password');
    }

    const data = await response.json();

    if (data == false) {
      throw new Error('Invalid username or password');
    }

    return;
  } catch (error) {
    console.error('Error during login:', error);
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

    if (!response || !response.ok) {
      throw new Error('Invalid username or password');
    }

    const data = await response.json();

    if (data == false) {
      throw new Error('Username or password already exists');
    }

    return;
  } catch (error) {
    console.error('Error: create user', error);
    alert('Error fetching Pokémon data:', error);
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

    if (!response.ok) {
      throw new Error('Failed to add Pokémon.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    alert('Error fetching Pokémon data:', error);
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
    
    if (!response.ok) {
      throw new Error('Failed to add Pokémon.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    alert('Error fetching Pokémon data:', error);
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
    
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon.');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    alert('Error fetching Pokémon data:', error);
    throw error;
  }
};