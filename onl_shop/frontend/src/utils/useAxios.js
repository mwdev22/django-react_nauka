import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../auth/AuthContext"

const baseURL = "http://127.0.0.1:8000/api";

const useAxios = () => {
    const [authTokens, setUser, setaAuthTokens] = useContext(AuthContext)

    // access poprzez wysyłanie request do api
    const axiosInstance = axios.create({
        baseURL,
    //                                      jeżeli token, bearer access
        headers : {Authorization : `Bearer ${authTokens?.access}`}
    }).access

    axiosInstance.interceptors.request.use(async req => {
    // dekodowanie tokenu
        const user = jwt_decode(authTokens.access)
    //  tokeny utrzymują się jeden dzień 
        const isExpired = dayjs.unix(user.exp).diff(dayjs())<1
        if(isExpired) return req

        const response = await axios.post(`${baseURL}/token/refresh/`, {
            refresh: authTokens.refresh
        })
        
        localStorage.setItem("authToken", JSON.stringify(response.data))

        
        setaAuthTokens(response.data)
        setUser(jwt_decode(response.data.access))
        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    })

    return axiosInstance
}

export default useAxios;