import React from 'react';
import Navbar from './Navbar'; // Ensure this path is correct

function Account() {
    const username = localStorage.getItem("username");

    return (
        <div style={styles.container}>
            <h1>Welcome, {username}!</h1>
            <p>Here you can manage your account details.</p>
        </div>
    );
}

const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px",
    },
};

export default Account;
