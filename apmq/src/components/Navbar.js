import React from 'react';
import logo from '../assets/mathwizlogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ width: '100%' }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img src={logo} alt="logo" style={{ height: "50px" }} />
                </a>
                <div className="d-flex">
                    <a href="" className="btn btn-outline-info">Account</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
