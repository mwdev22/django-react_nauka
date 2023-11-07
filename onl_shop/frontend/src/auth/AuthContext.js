import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
const swal = require('sweetalert2')

const AuthContext = createContext();

export default AuthContext

// manager logowania, posiadający dane o tokenie
export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    
// setting user
    const [user, setUser] = useState(() => 
        localStorage.getItem("authTokens")
            ? jwt_decode(localStorage.getItem("authTokens"))
            : null
    );


    const [loading, setLoading] = useState(true);

    // przekierowania
    const navigate = useNavigate();

    // authentication dzięki formularzom logowania(em,pass)
    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/token", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
        // dane logowanie w jsonie
            body: JSON.stringify({
                email, password
            })
        })
        const data = await response.json()
        console.log(data);

    // sprawdzanie poprawności danych, alert
        if(response.status === 200){
            console.log("Logged In");
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            navigate("/")
            swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } else {    
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "Username or passowrd does not exists",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }
// rejestracja (wszystkie potrzebne dane do utworzenia przez request, satysfakcjonujące model)
    const registerUser = async (email, username, password, password2) => {
        console.log(email, username, password, password2)
        const response = await fetch("http://127.0.0.1:8000/api/accounts/register", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })

// tworzenie użytkownika oraz profilu dzięki post_save w django, w przypadku poprawnych danych
        if(response.status === 201){
            navigate("/login")
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }
// wylogowywanie użytkownika poprzez usuwanie tokenu z local storage, a jednocześnie danych 

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate("/login")
        swal.fire({
            title: "logged out",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    // parametry do obsługi auth w komponentach
    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    }

    // aktywowanie tokenu dla użytkownika
    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

// provider pozwala na korzystanie z parametrów kontekstu
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}