import os
import sqlite3

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