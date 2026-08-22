import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

import "./Auth.css";

function Auth() {

    const navigate = useNavigate();
    const { role } = useParams();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [step, setStep] = useState("login");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const currentRole = role?.toUpperCase();

    const isDonor = currentRole === "DONOR";

    const pageTitle = isDonor
        ? "Donor Login"
        : "Requester Login";

    const pageDescription = isDonor
        ? "Login to help patients in need by donating blood."
        : "Login to request blood and connect with available donors.";

    const leftTitle = isDonor
        ? "Save a Life"
        : "Find the Blood You Need";

    const leftDescription = isDonor
        ? "Your blood can give someone a second chance."
        : "Find the helping hand you’re waiting for..";

    const benefits = isDonor
        ? [
            "Help patients in need",
            "Be a Hero, Save a Life",
            "Give hope, give life",
            "One Drop, One Life",
        ]
        : [
            "Find blood donors easily",
            "Your Life, Our Priority",
            "Find Your Lifeline",
            "A Helping Hand Awaits",
        ];


    // =========================================================
    // CHECK EMAIL / PHONE
    // =========================================================

    const handleCheckUser = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!login.trim()) {

            setError(
                "Please enter your phone number or email."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:8081/api/auth/check",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        login: login.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.error ||
                    "Unable to check account."
                );

                return;
            }


            // =================================================
            // EXISTING USER
            // =================================================

            if (data.exists) {

                setStep("password");

                setSuccess(
                    "Account found. Please enter your password."
                );

            }


            // =================================================
            // NEW USER
            // =================================================

            else {

                if (currentRole === "DONOR") {

                    navigate("/donor-rules", {
                        state: {
                            login: login.trim()
                        }
                    });

                }

                else if (currentRole === "REQUESTER") {

                    navigate("/requester-rules", {
                        state: {
                            login: login.trim()
                        }
                    });

                }

            }

        } catch (err) {

            console.error(err);

            setError(
                "Cannot connect to backend. Make sure Spring Boot is running."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // LOGIN
    // =========================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!password.trim()) {

            setError(
                "Please enter your password."
            );

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
                        login: login.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            console.log(
                "LOGIN RESPONSE:",
                data
            );

            if (!response.ok) {

                setError(
                    data.error ||
                    data.message ||
                    "Invalid password."
                );

                return;
            }


            // =================================================
            // GET USER
            // =================================================

            const user = data.user;

            if (!user) {

                setError(
                    "User information not received from backend."
                );

                return;
            }


            // =================================================
            // IMPORTANT
            //
            // Do NOT check backend role here.
            //
            // The user can use the same account as both
            // DONOR and REQUESTER.
            // =================================================

            const loggedInRole =
                currentRole;


            if (!loggedInRole) {

                setError(
                    "Unable to identify login type."
                );

                return;
            }


            // =================================================
            // SAVE USER
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "role",
                loggedInRole
            );


            setSuccess(
                "Login successful!"
            );


            // =================================================
            // REDIRECT BASED ON CURRENT LOGIN PAGE
            // =================================================

            setTimeout(() => {

                if (loggedInRole === "DONOR") {

                    navigate(
                        "/donor-dashboard"
                    );

                }

                else if (loggedInRole === "REQUESTER") {

                    navigate(
                        "/requester-home"
                    );

                }

            }, 500);


        } catch (err) {

            console.error(err);

            setError(
                "Cannot connect to backend. Make sure Spring Boot is running."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // BACK BUTTON
    // =========================================================

    const handleBack = () => {

        if (step === "password") {

            setStep("login");

            setPassword("");

            setError("");

            setSuccess("");

            return;
        }

        navigate("/");
    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="auth-left">

                    <div className="auth-blood-icon">
                        🩸
                    </div>

                    <h2>
                        {leftTitle}
                    </h2>

                    <p className="left-description">
                        {leftDescription}
                    </p>


                    {benefits.map(
                        (benefit, index) => (

                            <div
                                className="benefit"
                                key={index}
                            >

                                <span>
                                    <FaCheck />
                                </span>

                                <p>
                                    {benefit}
                                </p>

                            </div>

                        )
                    )}

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="auth-right">

                    <div className="auth-icon">
                        🩸
                    </div>

                    <h1>
                        {pageTitle}
                    </h1>

                    <p className="auth-description">
                        {pageDescription}
                    </p>


                    {/* =================================================
                        STEP 1 - EMAIL / PHONE
                    ================================================= */}

                    {step === "login" && (

                        <form
                            onSubmit={handleCheckUser}
                        >

                            <label htmlFor="login">
                                Phone Number / Email
                            </label>

                            <input
                                id="login"
                                type="text"
                                placeholder="Enter phone number or email"
                                value={login}
                                onChange={(e) =>
                                    setLogin(
                                        e.target.value
                                    )
                                }
                                autoComplete="username"
                            />


                            {error && (

                                <p className="auth-error">
                                    {error}
                                </p>

                            )}


                            {success && (

                                <p className="auth-success">
                                    {success}
                                </p>

                            )}


                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Checking..."
                                    : "Continue"
                                }

                            </button>

                        </form>

                    )}


                    {/* =================================================
                        STEP 2 - PASSWORD
                    ================================================= */}

                    {step === "password" && (

                        <form
                            onSubmit={handleLogin}
                        >

                            <label>
                                Phone Number / Email
                            </label>

                            <input
                                type="text"
                                value={login}
                                disabled
                            />


                            <label htmlFor="password">
                                Password
                            </label>


                            <div className="password-box">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="current-password"
                                />


                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {showPassword
                                        ? "Hide"
                                        : "Show"
                                    }

                                </button>

                            </div>


                            {error && (

                                <p className="auth-error">
                                    {error}
                                </p>

                            )}


                            {success && (

                                <p className="auth-success">
                                    {success}
                                </p>

                            )}


                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Logging in..."
                                    : "Login"
                                }

                            </button>

                        </form>

                    )}


                    {/* =================================================
                        BACK BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        className="back-button"
                        onClick={handleBack}
                    >

                        ← Back

                    </button>

                </div>

            </div>

        </div>
    );
}

export default Auth;