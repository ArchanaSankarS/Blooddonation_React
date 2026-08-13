import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Heart,
    Search,
    MapPin,
    Phone,
    Mail,
    LogOut
} from "lucide-react";

import "./Requester.css";

function Requester() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [bloodGroup, setBloodGroup] = useState("");
    const [city, setCity] = useState("");
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

    const savedUser =
        localStorage.getItem("user");

    const savedRole =
        localStorage.getItem("role");

    if (!savedUser) {

        navigate("/auth/REQUESTER");

        return;
    }

    if (savedRole !== "REQUESTER") {

        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/auth/REQUESTER");

        return;
    }

    try {

        setUser(
            JSON.parse(savedUser)
        );

    } catch (err) {

        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/auth/REQUESTER");

        return;
    }

    loadDonors();

}, [navigate]);
    const loadDonors = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                "http://localhost:8081/api/donor/available"
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Unable to load donors.");
                setDonors([]);
                return;
            }

            setDonors(
                Array.isArray(data) ? data : []
            );

        } catch (err) {

            console.error(err);

            setError(
                "Backend connection failed. Please make sure Spring Boot is running."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            let url =
                "http://localhost:8081/api/donor/available";

            const params = new URLSearchParams();

            if (bloodGroup) {
                params.append("bloodGroup", bloodGroup);
            }

            if (city.trim()) {
                params.append("city", city.trim());
            }

            if (params.toString()) {
                url += "?" + params.toString();
            }

            const response = await fetch(url);

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Search failed.");
                setDonors([]);
                return;
            }

            setDonors(
                Array.isArray(data) ? data : []
            );

        } catch (err) {

            console.error(err);

            setError("Backend connection failed.");
            setDonors([]);

        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {

        setBloodGroup("");
        setCity("");

        loadDonors();
    };

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/");
    };

    return (

        <div className="requester-page">

            <header className="requester-header">

                <div className="requester-title">

                    <div className="title-icon">
                        <Heart
                            size={28}
                            fill="currentColor"
                        />
                    </div>

                    <div>

                        <h1>
                            Find Blood Donors
                        </h1>

                        <p>
                            Welcome, {user?.name || "Requester"}
                        </p>

                    </div>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={17} />
                    Logout
                </button>

            </header>


            <section className="search-card">

                <h2>
                    Search Available Donors
                </h2>

                <form
                    className="search-form"
                    onSubmit={handleSearch}
                >

                    <select
                        value={bloodGroup}
                        onChange={(e) =>
                            setBloodGroup(e.target.value)
                        }
                    >

                        <option value="">
                            All Blood Groups
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


                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                    />


                    <button
                        type="submit"
                        className="search-button"
                    >
                        <Search size={18} />
                        Search
                    </button>


                    <button
                        type="button"
                        className="clear-button"
                        onClick={handleClear}
                    >
                        Clear
                    </button>

                </form>

            </section>


            {error && (
                <div className="requester-error">
                    {error}
                </div>
            )}


            {loading && (
                <div className="loading">
                    Loading donors...
                </div>
            )}


            {!loading && (

                <section className="donor-section">

                    {donors.length === 0 ? (

                        <div className="no-donors">

                            <Heart
                                size={45}
                                color="#c7192e"
                            />

                            <h3>
                                No Available Donors Found
                            </h3>

                            <p>
                                Try another blood group or city.
                            </p>

                        </div>

                    ) : (

                        donors.map((donor) => {

                            const donorName =
                                donor.name ||
                                donor.user?.name ||
                                "Donor";

                            const donorCity =
                                donor.city ||
                                donor.user?.city ||
                                "City not available";

                            const donorPhone =
                                donor.phone ||
                                donor.user?.phone;

                            const donorEmail =
                                donor.email ||
                                donor.user?.email;

                            return (

                                <div
                                    className="donor-card"
                                    key={donor.id}
                                >

                                    <div className="blood-circle">
                                        {donor.bloodGroup || "?"}
                                    </div>

                                    <h2>
                                        {donorName}
                                    </h2>

                                    <div className="donor-info">
                                        <MapPin size={17} />
                                        <span>
                                            {donorCity}
                                        </span>
                                    </div>

                                    {donorPhone && (
                                        <div className="donor-info">
                                            <Phone size={17} />
                                            <span>
                                                {donorPhone}
                                            </span>
                                        </div>
                                    )}

                                    {donorEmail && (
                                        <div className="donor-info">
                                            <Mail size={17} />
                                            <span>
                                                {donorEmail}
                                            </span>
                                        </div>
                                    )}

                                    <div className="available-badge">
                                        Available for Donation
                                    </div>

                                </div>
                            );
                        })
                    )}

                </section>
            )}

        </div>
    );
}

export default Requester;
