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
    Scale
} from "lucide-react";

import "./DonorDashBoard.css";

function DonorDashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [donor, setDonor] = useState(null);
    const [available, setAvailable] = useState(false);
    const [loading, setLoading] = useState(true);


//load donor

    useEffect(() => {

        const storedUser = localStorage.getItem("user");
        const storedRole = localStorage.getItem("role");

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

            if (!userData?.id) {
                throw new Error("Invalid user data");
            }

            setUser(userData);

            fetch(
                `http://localhost:8081/api/donor/user/${userData.id}`
            )
                .then(async (response) => {

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.error ||
                            "Donor details not found"
                        );
                    }

                    return data;
                })

                .then((data) => {

                    console.log("DONOR DETAILS:", data);

                    setDonor(data);

                    setAvailable(
                        data.available === true
                    );

                })

                .catch((error) => {

                    console.error(
                        "DONOR LOAD ERROR:",
                        error
                    );

                })

                .finally(() => {

                    setLoading(false);

                });

        } catch (error) {

            console.error(error);

            localStorage.removeItem("user");
            localStorage.removeItem("role");

            navigate("/auth/DONOR");
        }

    }, [navigate]);

//Availability

    const handleAvailability = async () => {

        if (!donor) {
            return;
        }

        const newStatus = !available;

        try {

            const response = await fetch(
                `http://localhost:8081/api/donor/${donor.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...donor,
                        available: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Update failed"
                );
            }

            setDonor(data);

            setAvailable(
                data.available === true
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to update availability."
            );
        }
    };

//logout

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/");
    };


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


    if (!user) {
        return null;
    }



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



                <section className="welcome-section">

                    <div className="welcome-glow"></div>

                    <div className="welcome-content">

                        <p className="dashboard-label">
                            DONOR DASHBOARD
                        </p>
<h1 className="welcome-title">
    Welcome,

    <span>
        {" "}{user.name}
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




                <section className="summary-grid">


                    {/* BLOOD GROUP */}

                    <div className="summary-card blood-summary">

                        <div className="summary-icon">

                            <Droplet
                                size={27}
                                fill="currentColor"
                            />

                        </div>

                        <div className="summary-content">

                            <span>
                                BLOOD GROUP
                            </span>

                            <strong>
                                {donor?.bloodGroup || "N/A"}
                            </strong>

                        </div>

                    </div>



                    {/* LOCATION */}

                    <div className="summary-card">

                        <div className="summary-icon">

                            <MapPin size={27} />

                        </div>

                        <div className="summary-content">

                            <span>
                                LOCATION
                            </span>

                            <strong>
                                {user.city || "N/A"}
                            </strong>

                        </div>

                    </div>



                    {/* AGE */}

                    <div className="summary-card">

                        <div className="summary-icon">

                            <Calendar size={27} />

                        </div>

                        <div className="summary-content">

                            <span>
                                AGE
                            </span>

                            <strong>
                                {donor?.age || "N/A"}
                            </strong>

                        </div>

                    </div>



                    {/* WEIGHT */}

                    <div className="summary-card">

                        <div className="summary-icon">

                            <Scale size={27} />

                        </div>

                        <div className="summary-content">

                            <span>
                                WEIGHT
                            </span>

                            <strong>

                                {donor?.weight
                                    ? `${donor.weight} kg`
                                    : "N/A"}

                            </strong>

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

                            <span className="availability-label">
                                DONATION STATUS
                            </span>

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


                    {/* SECTION HEADING */}

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
                            className="edit-btn"
                            onClick={() =>
                                alert(
                                    "Update page will be added next."
                                )
                            }
                        >

                            <Edit size={18} />

                            Update Details

                        </button>

                    </div>




                    <div className="details-grid">


                        {/* NAME */}

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
                                    {user.city ||
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
                                    {donor?.age ||
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

                                    {donor?.weight
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

        </div>
    );
}

export default DonorDashboard;