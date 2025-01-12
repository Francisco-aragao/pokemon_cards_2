import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from database import DatabaseHandler

### FAST API SETUP

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # No trailing slash
    allow_credentials=True,
    allow_methods=["*"],  # List all methods you intend to use
    allow_headers=["*"],  # Allow all headers or specify required headers
)

### DATABASE SETUP

db = DatabaseHandler("pokemon.db")

### HELPER


def get_pokemon_data(pokemon_name: str) -> dict[str, str]:
    # Build the external API url

    pokemon_name = pokemon_name.lower()

    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_name}"

    try:
        response = requests.get(url, timeout=5)

        # Extract relevant data
        pokemon_data = response.json()
        name = pokemon_data["name"]
        image = pokemon_data["sprites"]["front_default"]
        types = [type["type"]["name"] for type in pokemon_data["types"]]
        abilities = [
            ability["ability"]["name"] for ability in pokemon_data["abilities"]
        ]

        content = {
            "name": name,
            "image": image,
            "type": ", ".join(types),
            "abilities": abilities,
        }

        return content

    except requests.exceptions.RequestException as error:
        raise HTTPException(
            status_code=500, detail=f"Error fetching Pokémon data: {error}"
        )
    except:
        raise HTTPException(status_code=404, detail="Pokémon not found")


### START OF THE API


@app.get("/api/pokemon/{pokemon_name}")
async def get_pokemon(pokemon_name: str) -> dict[str, str]:
    content = get_pokemon_data(pokemon_name)
    return JSONResponse(content=content)


@app.post("/api/login")
async def login(user: dict) -> bool:
    username = user.get("username", "")
    password = user.get("password", "")

    user_id = db.getUserIdWithPassword(username, password)

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return True


@app.post("/api/createUser")
async def create_user(user: dict) -> bool:
    username = user.get("username", "")
    password = user.get("password", "")

    if username == "" or password == "":
        raise HTTPException(status_code=400, detail="Empty fields")

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password too short")

    # Check if user exists
    user_id = db.getUserId(username)

    if user_id is not None:
        raise HTTPException(status_code=400, detail="Username already exists")

    # All OK
    db.addUser(username, password)

    return True


@app.post("/api/addPokemon/{pokemon_name}")
async def add_pokemon(pokemon_name: str, user: dict) -> bool:
    username = user.get("username", "")

    user_id = db.getUserId(username)

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid username")
    
    # Check if pokemon exists on pokeapi
    try:
        get_pokemon_data(pokemon_name)
    except HTTPException as error:
        raise error

    # Check if pokemon already exists for this user
    pokemon_id = db.getSinglePokemon(user_id[0], pokemon_name)

    if pokemon_id is not None:
        raise HTTPException(status_code=400, detail="Pokemon already added")

    # All OK
    db.addPokemon(user_id[0], pokemon_name)

    return True


@app.delete("/api/removePokemon/{pokemon_name}")
async def remove_pokemon(pokemon_name: str, user: dict) -> bool:
    username = user.get("username", "")

    user_id = db.getUserId(username)

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid username")

    # Check if pokemon exists for this user
    pokemon_id = db.getSinglePokemon(user_id[0], pokemon_name)

    if pokemon_id is None:
        raise HTTPException(status_code=400, detail="Pokemon not found")

    # All OK
    db.removePokemon(user_id[0], pokemon_name)

    return True


@app.get("/api/getPokemons/{username}")
async def get_pokemons(username: str) -> list[dict[str, str]]:
    user_id = db.getUserId(username)

    if user_id is None:
        raise HTTPException(status_code=400, detail="Invalid username")

    # Get pokemons
    pokemons = db.getAllPokemons(user_id[0])

    try:
        content = []

        for pokemon in pokemons:
            p = get_pokemon_data(pokemon[0])
            content.append(p)

        return JSONResponse(content=content)

    except HTTPException as error:
        raise error
