import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar'; // Ensure this path is correct based on your folder structure

function Register() {
    const [emailAddress, setemailAddres] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset error message on new attempt
        setSuccessMessage(""); // Clear any previous success messages
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setSuccessMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1500); // Redirect after a short delay
            } else {
                const data = await response.json();
                setError(data.error || "Invalid username or password.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <Navbar /> {/* Render the Navbar component */}

            {/* Main Content */}
            <div style={styles.mainContent}>
                <div style={styles.loginContainer}>
                    <h2 style={styles.header}>Create Account</h2>
                    <form onSubmit={handleLogin} style={styles.form}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="text"
                            placeholder="Enter your email"
                            value={emailAddress}
                            onChange={(e) => setemailAddres(e.target.value)}
                            required
                            style={styles.input}
                        />
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
                        <button
                            type="button"
                            className="register-btn"
                            style={styles.registerButton}
                            onClick={() => window.location.href = '/register'}
                        >Create Account</button>
                        <br />
                        <p style={{ textAlign: 'left' }}>Already have an account? </p>
                        <button 
                            type="button"
                            style={styles.submitButton}
                            onClick={() => window.location.href = '/login'}
                            >Sign In</button>
                        <br />
                    </form>
                    {/* Success and Error Messages */}
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
        height: 'calc(100vh - 56px)',
        backgroundColor: '#fee5cb', // light orange color
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
    registerButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px',
        fontSize: '1em',
        cursor: 'pointer',
        borderRadius: '4px',
        marginTop: '10px',
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

export default Register;