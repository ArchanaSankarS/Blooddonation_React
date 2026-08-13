import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";

import "./RequesterRegister.css";

function RequesterRegister() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        city: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // =====================================
    // INPUT
    // =====================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
    };

    // =====================================
    // SUBMIT
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        const {
            name,
            phone,
            email,
            password,
            city
        } = formData;

        // =====================================
        // VALIDATION
        // =====================================

        if (!name.trim()) {

            setError(
                "Please enter your full name."
            );

            return;
        }

        if (!phone.trim()) {

            setError(
                "Please enter your phone number."
            );

            return;
        }

        if (!/^[0-9]{10}$/.test(
            phone.trim()
        )) {

            setError(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }

        if (!email.trim()) {

            setError(
                "Please enter your email."
            );

            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email.trim()
        )) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }

        if (!password) {

            setError(
                "Please create a password."
            );

            return;
        }

        if (password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }

        if (!city.trim()) {

            setError(
                "Please enter your city."
            );

            return;
        }

        try {

            setLoading(true);

            // =====================================
            // CREATE REQUESTER IN BACKEND
            // =====================================

            const response = await fetch(
                "http://localhost:8081/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name:
                            name.trim(),

                        phone:
                            phone.trim(),

                        email:
                            email.trim(),

                        password:
                            password,

                        role:
                            "REQUESTER",

                        city:
                            city.trim()

                    })
                }
            );

            const data =
                await response.json();

            console.log(
                "REQUESTER REGISTER RESPONSE:",
                data
            );

            if (!response.ok) {

                setError(
                    data.error ||
                    data.message ||
                    "Requester registration failed."
                );

                return;
            }

            // =====================================
            // GET CREATED USER
            // =====================================

            const createdUser =
                data.user || data;

            if (!createdUser.id) {

                setError(
                    "Registration successful but user ID was not received."
                );

                return;
            }

            // =====================================
            // AUTO LOGIN
            // =====================================

            localStorage.setItem(
                "user",
                JSON.stringify(createdUser)
            );

            localStorage.setItem(
                "role",
                "REQUESTER"
            );

            // =====================================
            // GO REQUESTER HOME
            // =====================================

            navigate("/requester-home");

        } catch (err) {

            console.error(
                "REQUESTER REGISTER ERROR:",
                err
            );

            setError(
                "Cannot connect to backend. Make sure Spring Boot is running on port 8081."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="requester-register-page">

            <button
                type="button"
                className="requester-register-back"
                onClick={() =>
                    navigate("/requester-rules")
                }
            >

                <ArrowLeft size={17} />

                Back to Rules

            </button>

            <div className="requester-register-card">

                <div className="requester-register-header">

                    <div className="requester-register-icon">

                        <Heart
                            size={35}
                            fill="currentColor"
                        />

                    </div>

                    <p className="requester-register-label">
                        BLOOD REQUESTER
                    </p>

                    <h1>

                        Requester{" "}

                        <span>
                            Registration
                        </span>

                    </h1>

                    <p>
                        Register to find blood donors
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <h2 className="requester-section-title">
                        Personal Information
                    </h2>

                    <div className="requester-form-grid">

                        {/* NAME */}

                        <div className="requester-form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                        </div>

                        {/* PHONE */}

                        <div className="requester-form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter 10-digit phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength="10"
                            />

                        </div>

                        {/* EMAIL */}

                        <div className="requester-form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />

                        </div>

                        {/* PASSWORD */}

                        <div className="requester-form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                        </div>

                        {/* CITY */}

                        <div className="requester-form-group">

                            <label>
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                placeholder="Enter your city"
                                value={formData.city}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    {error && (

                        <div className="requester-register-error">
                            {error}
                        </div>

                    )}

                    <button
                        type="submit"
                        className="requester-register-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register as Requester"}

                    </button>

                    <p className="requester-register-note">

                        Please provide accurate information
                        for genuine blood requirements.

                    </p>

                </form>

            </div>

        </div>
    );
}

export default RequesterRegister;