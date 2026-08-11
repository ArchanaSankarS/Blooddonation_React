import React from "react";
import { useNavigate } from "react-router-dom";

function DonorHome() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div>

            <h1>Donor Home</h1>

            <h2>Welcome Donor!</h2>

            {user && (
                <div>

                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>

                    <p>
                        <strong>Phone:</strong> {user.phone}
                    </p>

                    <p>
                        <strong>City:</strong> {user.city}
                    </p>

                </div>
            )}

            <button onClick={() => navigate("/")}>
                Logout
            </button>

        </div>
    );
}

export default DonorHome;