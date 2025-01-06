import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CreateUserForm from '../components/CreateUserForm';
import { UserContext } from '../context/UserContext';
import { createUser } from '../services/Api';

function Create() {
    const navigate = useNavigate();
    const { setUsername } = useContext(UserContext);

    const handleCreateUser = async (username, password) => {
        try {
            await createUser(username, password); 
            console.log('Create successful: ', username);

            setUsername(username);

            navigate('/dashboard', { state: { username, password } });
        } catch (error) {
            console.error('Create failed:', error.message);
            alert(error.message);
        }
    };

    return (
        <div>
            <Header />
            <h1 className="center-login-header">Create User</h1>
            <CreateUserForm onLogin={handleCreateUser} />
        </div>
    );
}

export default Create;