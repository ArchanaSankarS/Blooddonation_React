import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";

import "./DonorRegister.css";

function DonorRegister() {
    const navigate = useNavigate();
    const location = useLocation();

    const previousLogin = location.state?.login || "";

    const [formData, setFormData] = useState({
        name: "",
        phone: /^\d{10}$/.test(previousLogin) ? previousLogin : "",
        email: previousLogin.includes("@") ? previousLogin : "",
        password: "",
        city: "",
        bloodGroup: "",
        gender: "",
        age: "",
        lastDonationDate: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

      //validation

        if (!formData.name.trim()) {
            setError("Full Name is required.");
            return;
        }

        if (!formData.phone.trim()) {
            setError("Phone Number is required.");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
            setError("Enter a valid 10-digit phone number.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            setError("Enter a valid email.");
            return;
        }

        if (!formData.password.trim()) {
            setError("Password is required.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (!formData.city.trim()) {
            setError("City is required.");
            return;
        }

        if (!formData.bloodGroup) {
            setError("Blood Group is required.");
            return;
        }

        if (!formData.age) {
            setError("Age is required.");
            return;
        }

        const age = Number(formData.age);
        if (age < 18 || age > 60) {
            setError("Donor age must be between 18 and 60.");
            return;
        }

        try {
            setLoading(true);

  //create user

            const userResponse = await fetch(
                "http://localhost:8081/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        phone: formData.phone.trim(),
                        email: formData.email.trim(),
                        password: formData.password,
                        role: "DONOR",
                        city: formData.city.trim()
                    })
                }
            );

            const userData = await userResponse.json();

            if (!userResponse.ok) {
                setError(userData.error || userData.message || "Registration failed.");
                return;
            }

            const createdUser = userData.user || userData;

            if (!createdUser.id) {
                setError("User created but user ID was not received.");
                return;
            }

     //create donor

            const donorResponse = await fetch(
                "http://localhost:8081/api/donor/save",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: createdUser.id,
                        bloodGroup: formData.bloodGroup,
                        gender: formData.gender || null,
                        age: Number(formData.age),
                        city: formData.city.trim(),
                        lastDonationDate: formData.lastDonationDate || null,
                        available: true
                    })
                }
            );

            const donorData = await donorResponse.json();

            if (!donorResponse.ok) {
                setError(donorData.error || donorData.message || "Donor details could not be saved.");
                return;
            }

     //save login

            localStorage.setItem("user", JSON.stringify(createdUser));
            localStorage.setItem("role", "DONOR");
//donor dashboard

            navigate("/donor-dashboard");

        } catch (err) {
            console.error("DONOR REGISTRATION ERROR:", err);
            setError("Cannot connect to backend. Make sure Spring Boot is running on port 8081.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donor-register-page">

            <div className="donor-register-card">

                {/* HEADER */}
                <div className="register-header">
                    <div className="register-icon">
                        <Heart size={30} fill="currentColor" />
                    </div>
                    <p className="register-label">DONOR REGISTRATION</p>
                    <h1>
                        Become a
                        <br />
                        <span>blood donor.</span>
                    </h1>
                    <p>Enter your details to create your donor account.</p>
                </div>

                <form onSubmit={handleSubmit}>

              
                    <h3 className="form-section-title">Personal Details</h3>

                    <div className="form-grid">

                        {/* NAME */}
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* PHONE */}
                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter 10-digit phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={10}
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="form-group">
                            <label>Password *</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* CITY */}
                        <div className="form-group">
                            <label>City *</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Enter your city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        {/* GENDER */}
                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                    </div>

                
                    <h3 className="form-section-title donor-details-title">Donor Details</h3>

                    <div className="form-grid">

                        {/* BLOOD GROUP */}
                        <div className="form-group">
                            <label>Blood Group *</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                            >
                                <option value="">Select blood group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        {/* AGE */}
                        <div className="form-group">
                            <label>Age *</label>
                            <input
                                type="number"
                                name="age"
                                min="18"
                                max="60"
                                placeholder="Enter age"
                                value={formData.age}
                                onChange={handleChange}
                            />
                        </div>

                        {/* LAST DONATION */}
                        <div className="form-group">
                            <label>Last Donation Date</label>
                            <input
                                type="date"
                                name="lastDonationDate"
                                value={formData.lastDonationDate}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    {/* ERROR */}
                    {error && (
                        <p className="register-error">{error}</p>
                    )}

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Donor Account"}
                    </button>

                    {/* BACK BUTTON - INSIDE CARD, BELOW SUBMIT */}
                    <button
                        className="register-back"
                        onClick={() => navigate("/donor-rules")}
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </button>

                    {/* NOTE */}
                    <p className="register-note">
                        By registering, you confirm that the information provided is accurate.
                    </p>

                </form>

            </div>

        </div>
    );
}

export default DonorRegister;