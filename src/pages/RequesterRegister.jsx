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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const {
            name,
            phone,
            email,
            password,
            city,
        } = formData;

        if (!name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!password) {
            setError("Please create a password.");
            return;
        }

        if (!city.trim()) {
            setError("Please enter your city.");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone.trim())) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        /*
         * Temporary frontend registration.
         *
         * Later, this section should call the Spring Boot
         * registration API instead.
         */

        const user = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            city: city.trim(),
            role: "REQUESTER",
        };

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "role",
            "REQUESTER"
        );

        // Registration complete.
        // Directly open requester dashboard.
        navigate("/requester-home");
    };

    return (
        <div className="requester-register-page">

            <button
                type="button"
                className="requester-register-back"
                onClick={() => navigate("/requester-rules")}
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
                        Requester <span>Registration</span>
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
                    >
                        Register as Requester
                    </button>

                    <p className="requester-register-note">
                        Please provide accurate information for
                        genuine blood requirements.
                    </p>

                </form>

            </div>

        </div>
    );
}

export default RequesterRegister;