import asyncio
import unittest

from fastapi.testclient import TestClient

from pokemon import *

"""
@app.get("/api/pokemon/{pokemonName}")
"""


class TestGetPokemonFromPokeAPI(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.client = TestClient(app)

    def test_pokemon_exists_in_pokeapi(self):
        response = self.client.get("/api/pokemon/pikachu")

        json = response.json()
        self.assertEqual(json["name"], "pikachu")
        self.assertEqual(response.status_code, 200)

    def test_pokemon_doesnt_exist_in_pokeapi(self):
        response = self.client.get("/api/pokemon/blabla")

        self.assertEqual(response.status_code, 500)


"""
@app.get("/api/login")
"""


class TestLogin(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        db.addUser("joao", "1234")

    @classmethod
    def tearDownClass(self):
        db.removeUser("joao")

    def test_valid_login(self):
        result = asyncio.run(login({"username": "joao", "password": "1234"}))

        self.assertEqual(result, True)

    def test_invalid_login(self):
        with self.assertRaises(HTTPException):
            asyncio.run(login({"username": "joao", "password": "wrong_password"}))

    def test_blank_field(self):
        with self.assertRaises(HTTPException):
            asyncio.run(login({"username": "", "password": "1234"}))


"""
@app.get("/api/createUser")
"""


class TestCreateUser(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        db.addUser("joao", "1234")

    @classmethod
    def tearDownClass(self):
        db.removeUser("joao")

    def test_create_valid_user(self):
        result = asyncio.run(create_user({"username": "ana", "password": "1234"}))

        self.assertEqual(result, True)

    def test_user_already_exists(self):
        with self.assertRaises(HTTPException):
            asyncio.run(create_user({"username": "joao", "password": "1234"}))

    def test_blank_field(self):
        with self.assertRaises(HTTPException):
            asyncio.run(create_user({"username": "", "password": "1234"}))


"""
@app.get("/api/addPokemon/{pokemonName}")
"""


class TestAddPokemon(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        db.addUser("joao", "1234")

    @classmethod
    def tearDownClass(self):
        db.removeUser("joao")

    def test_add_pokemon(self):
        result = asyncio.run(add_pokemon("pikachu", {"username": "joao"}))

        self.assertEqual(result, True)

    def test_add_pokemon_already_exists(self):
        asyncio.run(add_pokemon("charmander", {"username": "joao"}))

        with self.assertRaises(HTTPException):
            asyncio.run(add_pokemon("charmander", {"username": "joao"}))

    def test_invalid_user(self):
        with self.assertRaises(HTTPException):
            asyncio.run(add_pokemon("pikachu", {"username": "noone"}))

    def test_invalid_pokemon(self):
        with self.assertRaises(HTTPException):
            asyncio.run(add_pokemon("blabla", {"username": "joao"}))


"""
@app.get("/api/removePokemon/{pokemon_name}")
"""


class TestRemovePokemon(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        db.addUser("joao", "1234")
        id_user = db.getUserId("joao")
        id_user = id_user[0]
        db.addPokemon(id_user, "onix")

    @classmethod
    def tearDownClass(self):
        db.removeUser("joao")

    def test_remove_pokemon(self):
        result = asyncio.run(remove_pokemon("onix", {"username": "joao"}))

        self.assertEqual(result, True)

    def test_remove_pokemon_doesnt_exist(self):
        with self.assertRaises(HTTPException):
            asyncio.run(remove_pokemon("charizard", {"username": "joao"}))

    def test_remove_pokemon_invalid_user(self):
        with self.assertRaises(HTTPException):
            asyncio.run(remove_pokemon("pikachu", {"username": "noone"}))


"""
@app.get("/api/getPokemons/{username}")
"""


class TestGetPokemons(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        db.addUser("joao", "1234")
        id_user = db.getUserId("joao")
        id_user = id_user[0]
        db.addPokemon(id_user, "pikachu")
        db.addPokemon(id_user, "onix")
        self.client = TestClient(app)

    @classmethod
    def tearDownClass(self):
        db.removeUser("joao")

    def test_get_pokemons(self):

        response = self.client.get("/api/getPokemons/joao")

        json = response.json()
        
        self.assertEqual(json[0]["name"], "pikachu")
        self.assertEqual(json[0].keys(), {"name", "image", "type", "abilities"})
        self.assertEqual(json[1]["name"], "onix")
        self.assertEqual(json[1].keys(), {"name", "image", "type", "abilities"})
        self.assertEqual(response.status_code, 200)

    def test_get_pokemons_invalid_user(self):
        with self.assertRaises(HTTPException):
            asyncio.run(get_pokemons("noone"))



if __name__ == "__main__":
    # Isolate db for testing
    db.initTestDatabase()

    unittest.main()
