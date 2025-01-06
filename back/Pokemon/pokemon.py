import os
import sqlite3

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

### FAST API SETUP

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000/"],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=[""],
)

### DATABASE SETUP


class DatabaseHandler:
    def __init__(self, filename: str):
        self.filename = filename

        self.conn = sqlite3.connect(filename)
        self.cursor = self.conn.cursor()

        self.initTables()

    def __del__(self):
        self.conn.close()

    def initTables(self):
        # Create tables (but not overwrite)
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )
        """
        )

        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS pokemons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """
        )

        self.conn.commit()

    def initTestDatabase(self):
        if self.conn:
            self.conn.close()

        self.conn = sqlite3.connect(":memory:", check_same_thread=False)
        self.cursor = self.conn.cursor()

        self.initTables()

    def addUser(self, username: str, password: str) -> None:
        self.cursor.execute(
            """
            INSERT INTO users (username, password)
            VALUES (?, ?)
        """,
            (username, password),
        )

        self.conn.commit()

    def removeUser(self, username: str) -> None:
        self.cursor.execute(
            """
            DELETE FROM users
            WHERE username = ?
        """,
            (username,),
        )

        self.conn.commit()

    def getUserId(self, username: str) -> int | None:
        self.cursor.execute(
            """
            SELECT id
            FROM users
            WHERE username = ?
        """,
            (username,),
        )

        user_id = self.cursor.fetchone()

        return user_id

    def getUserIdWithPassword(self, username: str, password: str) -> int | None:
        self.cursor.execute(
            """
            SELECT id
            FROM users
            WHERE username = ? AND password = ?
        """,
            (username, password),
        )

        user_id = self.cursor.fetchone()

        return user_id

    def addPokemon(self, user_id: int, pokemon_name: str) -> None:
        self.cursor.execute(
            """
            INSERT INTO pokemons (user_id, name)
            VALUES (?, ?)
        """,
            (user_id, pokemon_name),
        )

        self.conn.commit()

    def removePokemon(self, user_id: int, pokemon_name: str) -> None:
        self.cursor.execute(
            """
            DELETE FROM pokemons
            WHERE user_id = ? AND name = ?
        """,
            (user_id, pokemon_name),
        )

        self.conn.commit()

    def getSinglePokemon(self, user_id: int, pokemon_name: str) -> int | None:
        self.cursor.execute(
            """
            SELECT id
            FROM pokemons
            WHERE user_id = ? AND name = ?
        """,
            (user_id, pokemon_name),
        )

        pokemon_id = self.cursor.fetchone()

        return pokemon_id

    def getAllPokemons(self, user_id: int) -> list[str]:
        self.cursor.execute(
            """
            SELECT name
            FROM pokemons
            WHERE user_id = ?
        """,
            (user_id,),
        )

        pokemons = self.cursor.fetchall()

        return pokemons


db = DatabaseHandler("pokemon.db")

### HELPER


def get_pokemon_data(pokemon_name: str) -> dict[str, str]:
    # Build the external API url
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
