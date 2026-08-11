import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        Blood Donation <span>Connect</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Welcome</Link>
        <Link to="/login">Login</Link>
        <Link to="/register" className="register-btn">
          Register
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;