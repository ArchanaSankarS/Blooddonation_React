import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DonorLogin() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(
                "http://localhost:8081/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        login: login,
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("role", data.role);

            if (data.role === "DONOR") {
                navigate("/donor-home");
            } else {
                setError("This account is not a donor account.");
            }

        } catch (error) {
            setError("Backend connection failed");
        }
    };

    return (
        <div>
            <h1>Donor Login</h1>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Email or Phone</label>
                    <br />

                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Enter email or phone"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <br />

            <button onClick={() => navigate("/")}>
                Back
            </button>
        </div>
    );
}

export default DonorLogin;