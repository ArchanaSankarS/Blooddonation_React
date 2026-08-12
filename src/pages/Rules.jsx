import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, CheckCircle } from "lucide-react";

import "./Rules.css";

function Rules() {
    const navigate = useNavigate();

    return (
        <div className="rules-page">
            <div className="rules-card">

                {/* Icon */}
                <div className="rules-icon">
                    <Heart size={60} fill="currentColor" />
                </div>

                {/* Heading */}
                <p className="rules-label">
                    BEFORE YOU REGISTER
                </p>

                <h1>
                    Donor <span>Rules</span>
                </h1>

                <p className="rules-intro">
                    Please read these simple guidelines before registering as a blood donor.
                </p>

                {/* Rules */}
                <div className="rules-list">

                    <div className="rule-item">
                        <CheckCircle />
                        <div>
                            <h3>Age Requirement</h3>
                            <p>Donors must meet the required age criteria.</p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />
                        <div>
                            <h3>Good Health</h3>
                            <p>Donate only when you are healthy and fit.</p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />
                        <div>
                            <h3>Donation Gap</h3>
                            <p>Maintain the recommended gap between donations.</p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />
                        <div>
                            <h3>Correct Information</h3>
                            <p>Provide accurate personal and health information.</p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />
                        <div>
                            <h3>Weight Requirement</h3>
                            <p>Meet the recommended minimum weight requirement.</p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />
                        <div>
                            <h3>Recent Donation</h3>
                            <p>Wait until the recommended gap after your last donation.</p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />
                        <div>
                            <h3>Temporary Illness</h3>
                            <p>Donate only after recovering from fever or illness.</p>
                        </div>
                    </div>

                </div>

                {/* Continue */}
                <button
                    className="agree-button"
                    onClick={() => navigate("/donor-register")}
                >
                    I Agree, Continue
                </button>

                {/* Back */}
                <button
                    className="rules-back"
                    onClick={() => navigate("/auth/DONOR")}
                >
                    <ArrowLeft size={17} />
                    Back to Login
                </button>

            </div>
        </div>
    );
}

export default Rules;
