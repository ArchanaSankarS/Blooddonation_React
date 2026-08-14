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

    const [bloodGroup, setBloodGroup] =
        useState("");

    const [city, setCity] =
        useState("");

    const [donors, setDonors] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================
    // CONTACT VIEW
    // =====================================

    const [selectedDonor, setSelectedDonor] =
        useState(null);


    // =====================================
    // CHECK REQUESTER LOGIN
    // =====================================

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


    // =====================================
    // LOAD AVAILABLE DONORS
    // =====================================

    const loadDonors = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                "http://localhost:8081/api/donor/available"
            );

            const data =
                await response.json();

            if (!response.ok) {

                setError(
                    data.error ||
                    "Unable to load donors."
                );

                setDonors([]);

                return;
            }

            setDonors(
                Array.isArray(data)
                    ? data
                    : []
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


    // =====================================
    // SEARCH
    // =====================================

    const handleSearch = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            let url =
                "http://localhost:8081/api/donor/available";

            const params =
                new URLSearchParams();

            if (bloodGroup) {

                params.append(
                    "bloodGroup",
                    bloodGroup
                );

            }

            if (city.trim()) {

                params.append(
                    "city",
                    city.trim()
                );

            }

            if (params.toString()) {

                url +=
                    "?" +
                    params.toString();

            }

            const response =
                await fetch(url);

            const data =
                await response.json();

            if (!response.ok) {

                setError(
                    data.error ||
                    "Search failed."
                );

                setDonors([]);

                return;
            }

            setDonors(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(err);

            setError(
                "Backend connection failed."
            );

            setDonors([]);

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // CLEAR SEARCH
    // =====================================

    const handleClear = () => {

        setBloodGroup("");
        setCity("");

        loadDonors();

    };


    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/");

    };


    // =====================================
    // VIEW CONTACT
    // =====================================

    const handleViewContact = (donor) => {

        setSelectedDonor(donor);

    };


    // =====================================
    // CLOSE CONTACT
    // =====================================

    const handleCloseContact = () => {

        setSelectedDonor(null);

    };


    return (

        <div className="requester-page">

            {/* ================= HEADER ================= */}

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
                            Welcome,{" "}
                            {user?.name ||
                                "Requester"}
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


            {/* ================= SEARCH ================= */}

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
                            setBloodGroup(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Blood Groups
                        </option>

                        <option value="A+">
                            A+
                        </option>

                        <option value="A-">
                            A-
                        </option>

                        <option value="B+">
                            B+
                        </option>

                        <option value="B-">
                            B-
                        </option>

                        <option value="AB+">
                            AB+
                        </option>

                        <option value="AB-">
                            AB-
                        </option>

                        <option value="O+">
                            O+
                        </option>

                        <option value="O-">
                            O-
                        </option>

                    </select>


                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) =>
                            setCity(
                                e.target.value
                            )
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


            {/* ================= ERROR ================= */}

            {error && (

                <div className="requester-error">
                    {error}
                </div>

            )}


            {/* ================= LOADING ================= */}

            {loading && (

                <div className="loading">
                    Loading donors...
                </div>

            )}


            {/* ================= DONORS ================= */}

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
                                Try another blood group
                                or city.
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

                            return (

                                <div
                                    className="donor-card"
                                    key={donor.id}
                                >

                                    {/* BLOOD GROUP */}

                                    <div className="blood-circle">

                                        {donor.bloodGroup ||
                                            "?"}

                                    </div>


                                    {/* NAME */}

                                    <h2>
                                        {donorName}
                                    </h2>


                                    {/* CITY */}

                                    <div className="donor-info">

                                        <MapPin
                                            size={17}
                                        />

                                        <span>
                                            {donorCity}
                                        </span>

                                    </div>


                                    {/* AVAILABLE */}

                                    <div className="available-badge">

                                        Available for Donation

                                    </div>


                                    {/* VIEW CONTACT */}

                                    <button
                                        type="button"
                                        className="view-contact-button"
                                        onClick={() =>
                                            handleViewContact(
                                                donor
                                            )
                                        }
                                    >

                                        View Contact

                                    </button>

                                </div>

                            );

                        })

                    )}

                </section>

            )}


            {/* ================= CONTACT ================= */}

            {selectedDonor && (

                <div className="contact-overlay">

                    <div className="contact-card">

                        <h2>
                            Donor Contact Details
                        </h2>


                        <p className="contact-donor-name">

                            {selectedDonor.name ||
                                selectedDonor.user?.name ||
                                "Donor"}

                        </p>


                        {/* PHONE */}

                        {(selectedDonor.phone ||
                            selectedDonor.user?.phone) && (

                            <div className="donor-info">

                                <Phone size={18} />

                                <span>

                                    {selectedDonor.phone ||
                                        selectedDonor.user?.phone}

                                </span>

                            </div>

                        )}


                        {/* EMAIL */}

                        {(selectedDonor.email ||
                            selectedDonor.user?.email) && (

                            <div className="donor-info">

                                <Mail size={18} />

                                <span>

                                    {selectedDonor.email ||
                                        selectedDonor.user?.email}

                                </span>

                            </div>

                        )}


                        <button
                            type="button"
                            className="close-contact-button"
                            onClick={
                                handleCloseContact
                            }
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Requester;