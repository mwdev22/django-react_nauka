import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/token",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
        swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        console.log(response.status);
        console.log("there was a server issue");
        swal.fire({
          title: "Username or password does not exist",
          icon: "error",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error as needed
    }
  };


  const registerUser = async (email, username, password, password2) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/register",
        { email, username, password, password2 },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        navigate("/login");
        swal.fire({
          title: "Registration Successful, Login Now",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        console.log(response.status);
        console.log("there was a server issue");
        swal.fire({
          title: "An Error Occurred " + response.status,
          icon: "error",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle error as needed
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    swal.fire({
      title: "Logged out",
      icon: "success",
      toast: true,
      timer: 6000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/refresh-token",
        { refresh: authTokens.refresh },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        console.log("Failed to refresh token");
        logoutUser();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      logoutUser();
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (authTokens) {
        const { exp } = jwt_decode(authTokens.access);
        const currentTime = Math.floor(Date.now() / 1000);
        console.log(exp)
        if (exp < currentTime + 300) {
          refreshToken();
        }
      }
    };
    checkTokenExpiration();

    const intervalId = setInterval(() => {
      checkTokenExpiration();
    }, 300000);

    return () => clearInterval(intervalId);
  }, [authTokens]);

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
