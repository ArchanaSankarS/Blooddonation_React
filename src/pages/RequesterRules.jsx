import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Heart,
    ArrowLeft,
    CheckCircle
} from "lucide-react";

import "./Rules.css";

function RequesterRules() {
    const navigate = useNavigate();

    return (
        <div className="rules-page">

            <div className="rules-card">

                <div className="rules-icon">
                    <Heart
                        size={60}
                        fill="currentColor"
                    />
                </div>

                <p className="rules-label">
                    BEFORE YOU REGISTER
                </p>

                <h1>
                    Requester <span>Rules</span>
                </h1>

                <p className="rules-intro">
                    Please read these simple guidelines before
                    registering as a blood requester.
                </p>

                <div className="rules-list">

                    <div className="rule-item">
                        <CheckCircle />

                        <div>
                            <h3>
                                Genuine Blood Need
                            </h3>

                            <p>
                                Use this platform only for
                                genuine blood requirements.
                            </p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />

                        <div>
                            <h3>
                                Respect Donors
                            </h3>

                            <p>
                                Contact blood donors respectfully
                                and responsibly.
                            </p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />

                        <div>
                            <h3>
                                Do Not Misuse Details
                            </h3>

                            <p>
                                Do not misuse or share donor
                                contact information.
                            </p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />

                        <div>
                            <h3>
                                Correct Information
                            </h3>

                            <p>
                                Provide accurate blood group and
                                location details.
                            </p>
                        </div>
                    </div>

                    <div className="rule-item">
                        <CheckCircle />

                        <div>
                            <h3>
                                Responsible Use
                            </h3>

                            <p>
                                Use the platform responsibly and
                                only when blood is genuinely needed.
                            </p>
                        </div>
                    </div>

                </div>

                <button
                    type="button"
                    className="agree-button"
                    onClick={() =>
                        navigate("/requester-register")
                    }
                >
                    I Agree, Continue
                </button>

                <button
                    type="button"
                    className="rules-back"
                    onClick={() =>
                        navigate("/auth/REQUESTER")
                    }
                >
                    <ArrowLeft size={17} />
                    Back to Login
                </button>

            </div>

        </div>
    );
}

export default RequesterRules;