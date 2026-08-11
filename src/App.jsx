import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import DonorHome from "./pages/DonorHome";
import Requester from "./pages/Requester";

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

                <Route
                    path="/donor-home"
                    element={<DonorHome />}
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