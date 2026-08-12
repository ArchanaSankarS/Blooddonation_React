import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import "./DonorRegister.css";

function DonorRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        city: "",
        bloodGroup: "",
        gender: "",
        age: "",
        weight: "",
        lastDonationDate: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.name ||
            !formData.phone ||
            !formData.email ||
            !formData.password ||
            !formData.city ||
            !formData.bloodGroup ||
            !formData.age ||
            !formData.weight
        ) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);

            // =========================
            // 1. CREATE USER
            // =========================

            const userResponse = await fetch(
                "http://localhost:8081/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email,
                        password: formData.password,
                        role: "DONOR",
                        city: formData.city
                    })
                }
            );

            const userData = await userResponse.json();

            if (!userResponse.ok) {
                setError(
                    userData.error || "Registration failed."
                );
                return;
            }

            console.log("User created:", userData);

            // =========================
            // 2. CREATE DONOR DETAILS
            // =========================

            const donorResponse = await fetch(
                "http://localhost:8081/api/donor/save",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: userData.id,
                        bloodGroup: formData.bloodGroup,
                        gender: formData.gender,
                        age: Number(formData.age),
                        weight: Number(formData.weight),
                        city: formData.city,
                        lastDonationDate:
                            formData.lastDonationDate || null,
                        available: true
                    })
                }
            );

            const donorData = await donorResponse.json();

            if (!donorResponse.ok) {
                setError(
                    "Account created, but donor details could not be saved."
                );
                return;
            }

            console.log("Donor created:", donorData);

            // =========================
            // 3. AUTO LOGIN
            // =========================

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            localStorage.setItem(
                "role",
                "DONOR"
            );

            navigate("/donor-home");

        } catch (err) {
            console.error(err);

            setError(
                "Cannot connect to backend. Make sure Spring Boot is running on port 8081."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donor-register-page">

            {/* Back */}
            <button
                className="register-back"
                onClick={() => navigate("/donor-rules")}
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="donor-register-card">

                {/* Header */}
                <div className="register-header">

                    <div className="register-icon">
                        <Heart
                            size={30}
                            fill="currentColor"
                        />
                    </div>

                    <p className="register-label">
                        DONOR REGISTRATION
                    </p>

                    <h1>
                        Become a
                        <br />
                        <span>blood donor.</span>
                    </h1>

                    <p>
                        Enter your details to create your
                        donor account.
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    {/* ================= PERSONAL DETAILS ================= */}

                    <h3 className="form-section-title">
                        Personal Details
                    </h3>

                    <div className="form-grid">

                        {/* Full Name */}
                        <div className="form-group">

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

                        {/* Phone */}
                        <div className="form-group">

                            <label>
                                Phone Number 
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Email */}
                        <div className="form-group">

                            <label>
                                Email 
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Password */}
                        <div className="form-group">

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

                        {/* City */}
                        <div className="form-group">

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

                        {/* Gender */}
                        <div className="form-group">

                            <label>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select gender
                                </option>

                                <option value="MALE">
                                    Male
                                </option>

                                <option value="FEMALE">
                                    Female
                                </option>

                                <option value="OTHER">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* ================= DONOR DETAILS ================= */}

                    <h3 className="form-section-title donor-details-title">
                        Donor Details
                    </h3>

                    <div className="form-grid">

                        {/* Blood Group */}
                        <div className="form-group">

                            <label>
                                Blood Group 
                            </label>

                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select blood group
                                </option>

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

                        {/* Age */}
                        <div className="form-group">

                            <label>
                                Age 
                            </label>

                            <input
                                type="number"
                                name="age"
                                placeholder="Enter age"
                                min="18"
                                max="60"
                                value={formData.age}
                                onChange={handleChange}
                            />

                        </div>

                    

                        {/* Last Donation */}
                        <div className="form-group">

                            <label>
                                Last Donation Date
                            </label>

                            <input
                                type="date"
                                name="lastDonationDate"
                                value={formData.lastDonationDate}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* Error */}
                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}


                    {/* Submit */}
                    <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Donor Account"}
                    </button>


                    {/* Note */}
                    <p className="register-note">
                        By registering, you confirm that the
                        information provided is accurate.
                    </p>

                </form>

            </div>

        </div>
    );
}

export default DonorRegister;
