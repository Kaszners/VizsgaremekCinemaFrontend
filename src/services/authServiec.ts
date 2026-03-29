import axios from "axios";

const API_URL = "http://localhost:8080/cinema/authentication"

export const login = async (usernameOrEmail:string, password:string) => {
    const response = await axios.post(`${API_URL}/login`,{
        usernameOrEmail,
        password,
    });

    localStorage.setItem("token",response.data.token)

    return response.data;
}

export const register = async (username:string,password:string,email:string,fullName:string) => {
    const response = await axios.post(`${API_URL}/register`,{
        username,
        password,
        email,
        fullName
    });

    return response.data;
}