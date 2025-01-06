# Tests

# Github actions

# Routes

**OK**
- Search Pokemon: http://localhost:8000/api/pokemon/${pokemonName} (request external pokemon api)
  - Receives: Pokemon Name
  - Returns: Pokemon Data (Name, Image, Type, Abilities)

**OK**
- Login: POST http://localhost:8000/api/login
  - Receives: BODY -> Username, Password 
  - Returns: Bool

**OK**
- Create User: POST http://localhost:8000/api/createUser
  - Receives: BODY -> Username, Password
  - Returns: Bool

**OK**
- Add pokemon to user: POST http://localhost:8000/api/addPokemon/${pokemonName} (request external pokemon api)
  - Receives: BODY -> Username
  - Returns: Bool

**OK**
- Remove pokemon from user: DELETE http://localhost:8000/api/removePokemon/${pokemonName}
  - Receives: BODY -> Username
  - Returns: Bool

**OK**
- Get user pokemons: GET http://localhost:8000/api/getPokemons/${username}
  - Receives: Username
  - Returns: List of Pokemons with Name, Image, Type, Abilities