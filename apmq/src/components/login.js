import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext for login functionality

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Access login function from AuthContext

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage("Login successful! Redirecting...");
                login(data.user_id, username); // Update AuthContext with user ID and username
                setTimeout(() => {
                    navigate("/main"); // Redirect to main page
                }, 1500);
            } else {
                const data = await response.json();
                setError(data.detail || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            setError("Unable to connect to the server. Please try again later.");
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.mainContent}>
                <div style={styles.loginContainer}>
                    <h2 style={styles.header}>Welcome Back!</h2>
                    <form onSubmit={handleLogin} style={styles.form}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.submitButton}>Log In</button>
                    </form>
                    {successMessage && <p style={styles.success}>{successMessage}</p>}
                    {error && <p style={styles.error}>{error}</p>}
                </div>
            </div>
        </div>
    );
}

// Inline styles for the component
const styles = {
    mainContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fee5cb', // Light orange background
    },
    loginContainer: {
        boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        borderRadius: '8px',
        width: '400px',
        backgroundColor: 'white',
        padding: '2em',
        textAlign: 'center',
    },
    header: {
        color: '#333',
        fontSize: '1.5em',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1em',
    },
    label: {
        textAlign: 'left',
        fontSize: '1em',
        color: '#555',
        marginBottom: '0.3em',
    },
    input: {
        marginBottom: '1em',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1em',
    },
    submitButton: {
        backgroundColor: '#0056b3',
        color: 'white',
        border: 'none',
        padding: '10px',
        fontSize: '1em',
        cursor: 'pointer',
        borderRadius: '4px',
        marginTop: '1em',
    },
    success: {
        color: 'green',
        fontSize: '1em',
        textAlign: 'center',
        marginTop: '1em',
    },
    error: {
        color: 'red',
        fontSize: '1em',
        textAlign: 'center',
        marginTop: '1em',
    },
};

export default Login;
