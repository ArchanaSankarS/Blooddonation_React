import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Heart,
    MapPin,
    Phone,
    Mail,
    User,
    Calendar,
    Droplet,
    LogOut,
    Power,
    Edit,
    Hand,
    Scale,
    X
} from "lucide-react";

import "./DonorDashBoard.css";

function DonorDashboard() {

    const navigate = useNavigate();

//state

    const [user, setUser] = useState(null);
    const [donor, setDonor] = useState(null);

    const [available, setAvailable] = useState(false);
    const [loading, setLoading] = useState(true);

    const [showEditForm, setShowEditForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        bloodGroup: "",
        gender: "",
        age: "",
        weight: "",
        city: "",
        lastDonationDate: ""
    });


//LOAD USER + DONOR

    useEffect(() => {

        const storedUser = localStorage.getItem("user");
        const storedRole = localStorage.getItem("role");

        console.log("STORED USER:", storedUser);
        console.log("STORED ROLE:", storedRole);

        if (!storedUser) {
            navigate("/auth/DONOR");
            return;
        }

        if (storedRole !== "DONOR") {

            localStorage.removeItem("user");
            localStorage.removeItem("role");

            navigate("/auth/DONOR");
            return;
        }

        try {

            const userData = JSON.parse(storedUser);

            console.log("USER DATA:", userData);

            if (!userData || !userData.id) {
                throw new Error("Invalid user data");
            }

            setUser(userData);

            loadDonor(userData.id);

        } catch (error) {

            console.error("USER LOAD ERROR:", error);

            localStorage.removeItem("user");
            localStorage.removeItem("role");

            navigate("/auth/DONOR");
        }

    }, [navigate]);


//LOAD DONOR

    const loadDonor = async (userId) => {

        try {

            setLoading(true);
            setErrorMessage("");

            console.log(
                "Loading donor:",
                `http://localhost:8081/api/donor/user/${userId}`
            );

            const response = await fetch(
                `http://localhost:8081/api/donor/user/${userId}`
            );

            const text = await response.text();

            console.log("DONOR RESPONSE:", text);

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Invalid response from server.");
            }

            if (!response.ok) {

                throw new Error(
                    data?.error ||
                    "Donor details not found."
                );
            }

            console.log("DONOR DETAILS:", data);

            setDonor(data);

            setAvailable(
                data?.available === true
            );

        } catch (error) {

            console.error(
                "DONOR LOAD ERROR:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to load donor details."
            );

        } finally {

            setLoading(false);
        }
    };

//AVAILABILITY

    const handleAvailability = async () => {

        if (!donor) {
            console.log("DONOR NOT AVAILABLE");
            return;
        }

        const newStatus = !available;

        try {

            setErrorMessage("");
            setMessage("");

            console.log(
                "UPDATING AVAILABILITY:",
                newStatus
            );

            const response = await fetch(
                `http://localhost:8081/api/donor/${donor.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        userId: donor.userId,

                        bloodGroup: donor.bloodGroup,

                        gender: donor.gender,

                        age: donor.age,

                        weight: donor.weight,

                        city: donor.city,

                        lastDonationDate:
                            donor.lastDonationDate,

                        available: newStatus
                    })
                }
            );

            const text = await response.text();

            console.log(
                "AVAILABILITY RESPONSE:",
                text
            );

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    "Invalid server response."
                );
            }

            if (!response.ok) {

                throw new Error(
                    data?.error ||
                    "Unable to update availability."
                );
            }

            setDonor(data);

            setAvailable(
                data.available === true
            );

            setMessage(
                data.available
                    ? "You are now available for donation."
                    : "You are now unavailable for donation."
            );

            setTimeout(() => {
                setMessage("");
            }, 3000);

        } catch (error) {

            console.error(
                "AVAILABILITY ERROR:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to update availability."
            );
        }
    };

//OPEN UPDATE MODEL

    const handleEditClick = () => {

        console.log("================================");
        console.log("UPDATE DETAILS CLICKED");
        console.log("DONOR:", donor);
        console.log("USER:", user);
        console.log("================================");

        if (!donor) {

            console.log(
                "DONOR OBJECT IS NULL"
            );

            setErrorMessage(
                "Donor details are not loaded yet."
            );

            return;
        }

        // Clear old messages
        setMessage("");
        setErrorMessage("");

        // Fill form
        setFormData({

            bloodGroup:
                donor.bloodGroup || "",

            gender:
                donor.gender || "",

            age:
                donor.age !== null &&
                donor.age !== undefined
                    ? String(donor.age)
                    : "",

            weight:
                donor.weight !== null &&
                donor.weight !== undefined
                    ? String(donor.weight)
                    : "",

            city:
                donor.city ||
                user?.city ||
                "",

            lastDonationDate:
                donor.lastDonationDate
                    ? String(donor.lastDonationDate)
                    : ""
        });

        console.log(
            "FORM DATA SET"
        );

        // OPEN MODAL
        setShowEditForm(true);

        console.log(
            "MODAL OPEN STATE = TRUE"
        );
    };


  //CLOSED MODEL

    const handleCloseEdit = () => {

        if (saving) {
            return;
        }

        console.log(
            "CLOSING EDIT MODAL"
        );

        setShowEditForm(false);
        setErrorMessage("");
    };


//FORM CHANGE
    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

//UPDATE DONOR

    const handleUpdate = async (event) => {

        event.preventDefault();

        console.log(
            "================================"
        );

        console.log(
            "SAVE CHANGES CLICKED"
        );

        console.log(
            "DONOR:",
            donor
        );

        console.log(
            "FORM DATA:",
            formData
        );

        console.log(
            "================================"
        );

        if (!donor) {

            setErrorMessage(
                "Donor details are not available."
            );

            return;
        }

        try {

            setSaving(true);
            setErrorMessage("");
            setMessage("");

    //PREPARE DATE
            const updateData = {

                userId:
                    donor.userId,

                bloodGroup:
                    formData.bloodGroup,

                gender:
                    formData.gender,

                age:
                    formData.age !== ""
                        ? Number(formData.age)
                        : null,

                weight:
                    formData.weight !== ""
                        ? Number(formData.weight)
                        : null,

                city:
                    formData.city.trim(),

                lastDonationDate:
                    formData.lastDonationDate !== ""
                        ? formData.lastDonationDate
                        : null,

                available:
                    donor.available === true
            };

            console.log(
                "UPDATE DATA:",
                updateData
            );

//API REQUEST

            const response = await fetch(
                `http://localhost:8081/api/donor/${donor.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(
                        updateData
                    )
                }
            );

            const text =
                await response.text();

            console.log(
                "UPDATE RESPONSE:",
                text
            );

            let data;

            try {

                data = JSON.parse(text);

            } catch {

                throw new Error(
                    "Backend returned an invalid response."
                );
            }

   //ERROR

            if (!response.ok) {

                throw new Error(
                    data?.error ||
                    "Unable to update donor details."
                );
            }

       //SUCCESS

            console.log(
                "UPDATED DONOR:",
                data
            );

            setDonor(data);

            setAvailable(
                data.available === true
            );

            // Update local storage user city
            const updatedUser = {
                ...user,
                city: data.city
            };

            setUser(updatedUser);

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            // Close modal
            setShowEditForm(false);

            // Show success
            setMessage(
                "Donor details updated successfully."
            );

            setTimeout(() => {
                setMessage("");
            }, 3500);

        } catch (error) {

            console.error(
                "UPDATE ERROR:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to update donor details."
            );

        } finally {

            setSaving(false);
        }
    };


//LOGOUT

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/");
    };
//LOADING
    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="loading-box">

                    <Heart
                        size={50}
                        fill="currentColor"
                    />

                    <p>
                        Loading donor dashboard...
                    </p>

                </div>

            </div>
        );
    }


//NO USER

    if (!user) {
        return null;
    }

//UI

    return (

        <div className="donor-dashboard">

        
            <header className="dashboard-header">

                <div className="brand">

                    <div className="brand-icon">

                        <Heart
                            size={28}
                            fill="currentColor"
                        />

                    </div>

                    <div className="brand-text">

                        <h2>
                            Blood Donation
                        </h2>

                        <span>
                            CONNECT
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                >

                    <LogOut size={18} />

                    <span>
                        Logout
                    </span>

                </button>

            </header>



            <main className="dashboard-main">


             

                {message && (

                    <div className="dashboard-success">

                        <span>
                            ✓
                        </span>

                        {message}

                    </div>

                )}


             
                {errorMessage && !showEditForm && (

                    <div className="dashboard-error">

                        <span>
                            !
                        </span>

                        {errorMessage}

                    </div>

                )}



                <section className="welcome-section">

                    <div className="welcome-content">

                        <p className="dashboard-label">
                            DONOR DASHBOARD
                        </p>


                        <h1 className="welcome-title">

                            <span>
                                Welcome,
                            </span>

                            <span className="welcome-name">
                                {user.name}
                            </span>

                            <span className="welcome-hand-box">

                                <Hand
                                    size={24}
                                    strokeWidth={2.5}
                                />

                            </span>

                        </h1>


                        <p className="welcome-text">

                            Thank you for being a blood donor.
                            Your contribution can help save lives.

                        </p>


                        <div className="welcome-heart">

                            <Heart
                                size={28}
                                fill="currentColor"
                            />

                        </div>

                    </div>

                </section>


        

                <section className="availability-card">

                    <div className="availability-left">

                        <div
                            className={
                                available
                                    ? "status-icon active"
                                    : "status-icon inactive"
                            }
                        >

                            <Power size={26} />

                        </div>


                        <div className="availability-content">

                            <h3>
                                Available for Donation
                            </h3>

                            <p>

                                {available

                                    ? "You are currently visible to blood seekers."

                                    : "You are currently hidden from blood seekers."
                                }

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className={
                            available
                                ? "availability-toggle active"
                                : "availability-toggle"
                        }
                        onClick={handleAvailability}
                    >

                        <span></span>

                        {available
                            ? "Available"
                            : "Unavailable"}

                    </button>

                </section>


         

                <section className="details-section">


                    <div className="section-heading">


                        <div className="section-heading-text">

                            <p className="small-title">
                                YOUR PROFILE
                            </p>

                            <h2>
                                Donor Details
                            </h2>

                            <p className="section-description">
                                Your registered information
                            </p>

                        </div>


                   
                        <button
                            type="button"
                            className="edit-btn"
                            onClick={handleEditClick}
                        >

                            <Edit size={18} />

                            <span>
                                Update Details
                            </span>

                        </button>

                    </div>


            
                    <div className="details-grid">


                        {/* FULL NAME */}

                        <div className="detail-card">

                            <div className="detail-icon">

                                <User size={24} />

                            </div>

                            <div className="detail-content">

                                <span>
                                    FULL NAME
                                </span>

                                <strong>
                                    {user.name || "Not provided"}
                                </strong>

                            </div>

                        </div>


                        {/* BLOOD GROUP */}

                        <div className="detail-card highlight-card">

                            <div className="detail-icon blood">

                                <Droplet
                                    size={24}
                                    fill="currentColor"
                                />

                            </div>

                            <div className="detail-content">

                                <span>
                                    BLOOD GROUP
                                </span>

                                <strong>
                                    {donor?.bloodGroup ||
                                        "Not available"}
                                </strong>

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="detail-card">

                            <div className="detail-icon">

                                <Mail size={24} />

                            </div>

                            <div className="detail-content">

                                <span>
                                    EMAIL ADDRESS
                                </span>

                                <strong>
                                    {user.email ||
                                        "Not provided"}
                                </strong>

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="detail-card">

                            <div className="detail-icon">

                                <Phone size={24} />

                            </div>

                            <div className="detail-content">

                                <span>
                                    PHONE NUMBER
                                </span>

                                <strong>
                                    {user.phone ||
                                        "Not provided"}
                                </strong>

                            </div>

                        </div>


                        {/* CITY */}

                        <div className="detail-card">

                            <div className="detail-icon">

                                <MapPin size={24} />

                            </div>

                            <div className="detail-content">

                                <span>
                                    CITY
                                </span>

                                <strong>
                                    {donor?.city ||
                                        user.city ||
                                        "Not provided"}
                                </strong>

                            </div>

                        </div>


                        {/* GENDER */}

                        <div className="detail-card">

                            <div className="detail-icon">

                                <User size={24} />

                            </div>

                            <div className="detail-content">

                                <span>
                                    GENDER
                                </span>

                                <strong>
                                    {donor?.gender ||
                                        "Not provided"}
                                </strong>

                            </div>

                        </div>


                        {/* AGE */}

                        <div className="detail-card">

                            <div className="detail-icon">

                                <Calendar size={24} />

                            </div>

                            <div className="detail-content">

                                <span>
                                    AGE
                                </span>

                                <strong>
                                    {donor?.age ??
                                        "Not provided"}
                                </strong>

                            </div>

                        </div>


                        {/* WEIGHT */}

                        <div className="detail-card">

                            <div className="detail-icon">

                                <Scale size={24} />

                            </div>

                            <div className="detail-content">

                                <span>
                                    WEIGHT
                                </span>

                                <strong>

                                    {donor?.weight != null
                                        ? `${donor.weight} kg`
                                        : "Not provided"}

                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


          

                <section className="last-donation-card">

                    <div className="last-donation-icon">

                        <Calendar size={27} />

                    </div>


                    <div>

                        <span>
                            LAST BLOOD DONATION
                        </span>

                        <h3>

                            {donor?.lastDonationDate
                                ? donor.lastDonationDate
                                : "No donation recorded"}

                        </h3>

                    </div>

                </section>


             

                <div className="dashboard-message">

                    <Heart
                        size={23}
                        fill="currentColor"
                    />

                    <p>

                        Every donation matters.

                        <strong>
                            {" "}You can help save a life.
                        </strong>

                    </p>

                </div>

            </main>



            {showEditForm && (

                <div
                    className="edit-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseEdit();
                        }

                    }}
                >

                    <div
                        className="edit-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="edit-modal-header">

                            <div>

                                <p>
                                    YOUR PROFILE
                                </p>

                                <h2>
                                    Update Donor Details
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="close-edit-btn"
                                onClick={handleCloseEdit}
                                disabled={saving}
                            >

                                <X size={22} />

                            </button>

                        </div>


                        {/* MODAL ERROR */}

                        {errorMessage && (

                            <div className="modal-error">

                                <span>
                                    !
                                </span>

                                {errorMessage}

                            </div>

                        )}


                 
                        <form
                            className="edit-form"
                            onSubmit={handleUpdate}
                        >


                            {/* BLOOD GROUP */}

                            <div className="form-group">

                                <label>
                                    Blood Group
                                </label>

                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Blood Group
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

                            </div>


                            {/* GENDER */}

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
                                        Select Gender
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* AGE */}

                            <div className="form-group">

                                <label>
                                    Age
                                </label>

                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="18"
                                    max="60"
                                    required
                                />

                            </div>


                            {/* WEIGHT */}

                            <div className="form-group">

                                <label>
                                    Weight (kg)
                                </label>

                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    min="1"
                                    max="300"
                                    step="0.1"
                                />

                            </div>


                            {/* CITY */}

                            <div className="form-group full-width">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter your city"
                                    required
                                />

                            </div>


                            {/* LAST DONATION */}

                            <div className="form-group full-width">

                                <label>
                                    Last Donation Date
                                </label>

                                <input
                                    type="date"
                                    name="lastDonationDate"
                                    value={
                                        formData.lastDonationDate
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="edit-form-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCloseEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default DonorDashboard;