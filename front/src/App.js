import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Create from './pages/Create';
import Dashboard from './pages/Dashboard';
import AddPokemon from './pages/AddPokemon';
import RemovePokemon from './pages/RemovePokemon';
import GetPokemons from './pages/GetPokemons';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/PrivateRoute'; // component to handle protected routes

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />

          {}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/add-pokemon" 
            element={
              <PrivateRoute>
                <AddPokemon />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/remove-pokemon" 
            element={
              <PrivateRoute>
                <RemovePokemon />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/get-pokemons" 
            element={
              <PrivateRoute>
                <GetPokemons />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
