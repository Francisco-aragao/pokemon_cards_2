import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function PrivateRoute({ children }) {
    const { username } = useContext(UserContext); // Assuming username indicates login status

    // If the user is not logged in (no username), redirect to login page
    if (!username) {
        return <Navigate to="/login" />;
    }

    // If the user is logged in, render the protected component (children)
    return children;
}

export default PrivateRoute;
