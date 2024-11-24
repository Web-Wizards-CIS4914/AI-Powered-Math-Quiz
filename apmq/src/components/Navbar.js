import React from 'react';
import logo from '../assets/mathwizlogo.png';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ width: '100%' }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="logo" style={{ height: "50px" }} />
                </Link>
                <div className="d-flex">
                    <Link to="/register" className="btn btn-outline-info">Account</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
