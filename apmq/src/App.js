import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./components/main";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Route for Home */}
                    <Route path="/" element={<Home />} />

                    {/* Route for MainPage */}
                    <Route path="/main" element={<MainPage />} />

                    {/* Route for Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Route for Register */}
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
