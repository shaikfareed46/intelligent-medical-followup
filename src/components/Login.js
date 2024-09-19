import React, { useState } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase'; // Your Firebase config file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // Handle email/password login
    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Logged in successfully:', userCredential);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    // Handle Google login
    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log('Logged in successfully with Google:', result.user);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div style={{ padding: 16 }}>
            <Typography variant="h5">Login</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />
                {/* <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 16 }}
                    fullWidth
                >
                    Login
                </Button> */}
            </form>

            <Button
                onClick={handleGoogleLogin}
                variant="outlined"
                color="secondary"
                style={{ marginTop: 16 }}
                fullWidth
            >
                Login with Google
            </Button>
        </div>
    );
};

export default Login;
