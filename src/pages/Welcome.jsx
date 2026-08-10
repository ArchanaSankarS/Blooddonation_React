import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';


function Welcome() {
  const navigate = useNavigate();

  const handleDonate = () => {
    navigate('/auth', {
      state: {
        role: 'DONOR'
      }
    });
  };

  const handleNeedBlood = () => {
    navigate('/auth', {
      state: {
        role: 'REQUESTER'
      }
    });
  };

  return (
    <div className="welcome-page">


      <div className="background-overlay"></div>

      <div className="welcome-content">

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
            Connect blood donors with people who need blood.
            Your one small act can help save a life.
          </p>

          <div className="line"></div>


          <h2>
            How can we help you?
          </h2>


          <div className="welcome-buttons">

            <button
              className="donate-button"
              onClick={handleDonate}
            >
              <div className="button-content">
                <strong>Donate Blood</strong>

                <span>
                  Register as a blood donor
                </span>
              </div>
            </button>


            <button
              className="need-button"
              onClick={handleNeedBlood}
            >
              <div className="button-content">
                <strong>Need Blood</strong>

                <span>
                  Find an available blood donor
                </span>
              </div>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Welcome;