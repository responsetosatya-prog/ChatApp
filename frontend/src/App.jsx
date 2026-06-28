import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    const token = localStorage.getItem("token");

    return (
        <BrowserRouter>
            <Routes>

                {/* Home */}
                <Route
                    path="/"
                    element={
                        token
                            ? <Navigate to="/chat" replace />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Register */}
                <Route path="/register" element={<Register />} />

                {/* Protected Chat */}
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
