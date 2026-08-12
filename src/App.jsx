import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";

import DonorHome from "./pages/DonorHome";
import DonorRules from "./pages/Rules";
import DonorRegister from "./pages/DonorRegister";

import Requester from "./pages/Requester";
import RequesterRules from "./pages/RequesterRules";
import RequesterRegister from "./pages/RequesterRegister";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Welcome />}
                />

                <Route
                    path="/auth/:role"
                    element={<Auth />}
                />

                {/* Donor */}

                <Route
                    path="/donor-rules"
                    element={<DonorRules />}
                />

                <Route
                    path="/donor-register"
                    element={<DonorRegister />}
                />

                <Route
                    path="/donor-home"
                    element={<DonorHome />}
                />

                {/* Requester */}

                <Route
                    path="/requester-rules"
                    element={<RequesterRules />}
                />

                <Route
                    path="/requester-register"
                    element={<RequesterRegister />}
                />

                <Route
                    path="/requester-home"
                    element={<Requester />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
