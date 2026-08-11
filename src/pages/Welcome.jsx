import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import {
    UserPlus,
     Search,
    
    Handshake,
    Heart
} from "lucide-react";

function Welcome() {

    const navigate = useNavigate();

    return (
        <div className="welcome-page">

        
                    {/* WELCOME  */}
           

            <section className="hero-section">

                <div className="welcome-card">

                    <p className="small-title">
                        BLOOD DONATION CONNECT
                    </p>

                    <h1>
                        Every Drop
                        <br />
                        <span>Can Save a Life</span>
                    </h1>

                    <p className="welcome-text">
                        A simple platform connecting blood donors
                        with people who need blood. Your small act
                        can make a big difference.
                    </p>

                    <div className="welcome-buttons">

                        <button
                            className="action-button"
                            onClick={() => navigate("/auth/DONOR")}
                        >
                            <strong>Donate Blood</strong>
                            <small>I want to donate blood</small>
                        </button>

                        <button
                            className="action-button"
                            onClick={() => navigate("/auth/REQUESTER")}
                        >
                            <strong>Need Blood</strong>
                            <small>I need blood</small>
                        </button>

                    </div>

                </div>

            </section>


          
                  {/* BLOOD DONATION */}
        

            <section className="image-content-section donation-section">

                <div className="section-inner">

                    {/* CONTENT */}

                    <div className="feature-content">

                        <span className="feature-label">
                            BLOOD DONATION
                        </span>

                        <h2>
                            Give blood.
                            <br />
                            <span>Give hope.</span>
                        </h2>

                        <p>
                            A single blood donation can help someone
                            during an emergency. Your simple decision
                            to donate can become someone's hope.
                        </p>

                    </div>


                

                    <div className="image-card image-card-one">

                        <div className="orbit orbit-one"></div>

                        <div className="orbit orbit-two"></div>

                        <div className="image-circle">

                            <img
                                src="/src/assets/donorimg.png"
                                alt="Blood Donation"
                            />

                        </div>

                    </div>

                </div>

            </section>


       
            <div className="wave-transition wave-one"></div>



            <section className="image-content-section donor-section">

                <div className="section-inner">

                    {/* IMAGE */}

                    <div className="image-card image-card-two">

                        <div className="orbit orbit-one"></div>

                        <div className="orbit orbit-two"></div>

                        <div className="image-circle">

                            <img
                                src="/src/assets/bd2.jpg"
                                alt="Find Blood Donor"
                            />

                        </div>

                    </div>


                    {/* CONTENT */}

                    <div className="feature-content">

                        <span className="feature-label">
                            FIND & CONNECT
                        </span>

                        <h2>
                            Find the right
                            <br />
                            <span>blood donor.</span>
                        </h2>

                        <p>
                            Search for available donors based on
                            blood group and city. Connect easily
                            with someone who can help when it
                            matters most.
                        </p>

                    </div>

                </div>

            </section>


            {/* WAVE */}

            <div className="wave-transition wave-two"></div>


          
                   {/*HOW IT WORKS    */}
        

            <section className="how-section">

                <div className="how-header">

                    <span className="feature-label">
                        HOW IT WORKS
                    </span>

                    <h2>
                        Simple steps.
                        <br />
                        <span>Real impact.</span>
                    </h2>

                    <p>
                        A simple journey that connects donors
                        with people who need blood.
                    </p>

                </div>


            

                <div className="process-row">


                    {/* REGISTER */}

                    <div className="process-card">

    <div className="process-icon">
        <UserPlus />
    </div>

    <h3>Register</h3>

    <p>Create your account easily.</p>

</div>


<div className="process-card">

    <div className="process-icon">
        <Search />
    </div>

    <h3>Find</h3>

    <p>Find available donors.</p>

</div>


<div className="process-card">

    <div className="process-icon">
        <Handshake />
    </div>

    <h3>Connect</h3>

    <p>Connect with the right donor.</p>

</div>


<div className="process-card">

    <div className="process-icon">
        <Heart />
    </div>

    <h3>Save a Life</h3>

    <p>Make a real difference.</p>

</div>

                </div>

            </section>

        </div>
    );
}

export default Welcome;