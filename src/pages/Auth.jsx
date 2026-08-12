import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./Auth.css";

function Auth() {

    const navigate = useNavigate();

    const { role } = useParams();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // LOGIN
    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Login empty check
        if (!login.trim()) {
            setError("Please enter your phone number or email.");
            return;
        }


        // Password empty check
        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                "http://localhost:8081/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        login: login,
                        password: password,
                    }),
                }
            );


            const data = await response.json();


            console.log("Login response:", data);


            // Backend error
            if (!response.ok) {

                setError(
                    data.error || "Invalid email/phone or password."
                );

                return;
            }


            // Get user and role
            const user = data.user;
            const userRole = data.role;


            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // Save role
            localStorage.setItem(
                "role",
                userRole
            );


            setSuccess("Login successful!");


            // Small delay so user can see success
            setTimeout(() => {

                if (userRole === "DONOR") {

                    navigate("/donor-home");

                } else if (userRole === "REQUESTER") {

                    navigate("/requester-home");

                } else {

                    setError("Invalid user role.");

                }

            }, 500);






            

        } catch (err) {

            console.error(err);

            setError(
                "Cannot connect to backend. Make sure Spring Boot is running on port 8081."
            );

        } finally {

            setLoading(false);

        }
    };


    // BACK
    const handleBack = () => {

        navigate("/");

    };


    // REGISTER
    const handleRegister = () => {

        if (role === "DONOR") {

            navigate("/donor-rules");

        } else {

            navigate("/requester-rules");

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* Icon */}
                <div className="auth-icon">
                    
                </div>


                {/* Title */}
                <h1>

                    {role === "DONOR"
                        ? "Donor Login"
                        : "Requester Login"}

                </h1>


                <p className="auth-description">

                    Login using your phone number or email

                </p>


                {/* Login Form */}
                <form onSubmit={handleLogin}>


                    {/* Email / Phone */}
                    <label>
                        Phone Number / Email
                    </label>

                    <input
                        type="text"
                        placeholder="Enter phone number or email"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />


                    {/* Password */}
                    <label>
                        Password
                    </label>


                    <div className="password-box">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />


                        <button
                            type="button"
                            className="show-password"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword
                                ? "Hide"
                                : "Show"}
                        </button>

                    </div>


                    {/* Error */}
                    {error && (

                        <p className="auth-error">
                            {error}
                        </p>

                    )}


                    {/* Success */}
                    {success && (

                        <p
                            style={{
                                color: "green",
                                marginTop: "10px"
                            }}
                        >
                            {success}
                        </p>

                    )}


                    {/* Login button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>


                {/* Register section */}
                <div className="register-section">

                    <p>
                        New user?
                    </p>

                    <button
                        type="button"
                        className="register-link"
                        onClick={handleRegister}
                    >
                        Register
                    </button>

                </div>


                {/* Back */}
                <button
                    type="button"
                    className="back-button"
                    onClick={handleBack}
                >
                    ← Back
                </button>


            </div>

        </div>

    );
}

export default Auth;