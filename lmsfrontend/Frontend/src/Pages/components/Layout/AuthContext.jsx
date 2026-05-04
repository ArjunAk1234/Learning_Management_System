import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { email, role }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
    const [updateTimestamp, setUpdateTimestamp] = useState(Date.now());


    useEffect(() => {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        if (email && token) {
            try {
                const decoded = jwtDecode(token);

                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                    return;
                }

                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                checkUserRole(email);
                fetchProfilePhoto(email);

                const timeLeft = decoded.exp * 1000 - Date.now();
                setTimeout(() => {
                    logout();
                }, timeLeft);

            } catch (err) {
                console.error("Invalid token:", err);
                logout();
            }
        }
    }, []);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const checkUserRole = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const roleRes = await axios.post(
                "http://localhost:8006/auth/check-role",
                { email }
            );

            const isAdmin = roleRes.data?.isAdmin === true;

            setUser({
                email: email,
                role: isAdmin ? "admin" : "student",
            });

        } catch (error) {
            console.error("Role check failed:", error);
            setError("Failed to fetch user role.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfilePhoto = async (email) => {
        try {
            const encodedEmail = encodeURIComponent(email);

            const detailsResponse = await axios.get(
                `http://localhost:8006/users/details/${encodedEmail}`
            );

            if (detailsResponse.data.details?.photo_path) {
                const timestamp = Date.now();

                const photoUrl = `http://localhost:8006/uploads/${encodeURIComponent(
                    email.replace("@", "_at_").replace(".", "_dot_")
                )}/photo.jpg?t=${timestamp}`;

                setProfilePhotoUrl(photoUrl);
                setUpdateTimestamp(timestamp);
            }
        } catch (error) {
            console.error("Failed to fetch profile photo:", error);
        }
    };
    const updateProfilePhoto = (photoUrl) => {
        const timestamp = Date.now();

        if (photoUrl && photoUrl.includes("?t=")) {
            photoUrl = photoUrl.split("?t=")[0] + `?t=${timestamp}`;
        } else if (photoUrl) {
            photoUrl = `${photoUrl}?t=${timestamp}`;
        }

        setProfilePhotoUrl(photoUrl);
        setUpdateTimestamp(timestamp);
    };


    const logout = () => {
        setUser(null);
        setError(null);
        setProfilePhotoUrl(null);

        localStorage.removeItem("token");
        localStorage.removeItem("email");

        // Remove auth header
        delete axios.defaults.headers.common["Authorization"];

        // OPTIONAL: redirect
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                checkUserRole,
                logout,
                loading,
                error,
                profilePhotoUrl,
                updateTimestamp,
                updateProfilePhoto,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);