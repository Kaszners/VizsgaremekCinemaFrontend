import { useState } from "react";
import { register } from "../services/authServiec";


function Register(){

    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");
    const[email,setEmail] = useState("");
    const[fullName,setFullname] = useState("");

    const handleRegister = async() => {
        try {
            await register(username,password,email,fullName);
            window.location.href = "/"
        } catch (error) {
            console.error("REGISTER ERROR",error)
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="space-y-4 w-80">
                <h1 className="text-2xl font-bold text-center">Login</h1>

                <input
                type="text"
                placeholder="username"
                className="w-full p-2 rounded bg-gray-800"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                
                <input type="password"
                placeholder="password" 
                className="w-full p-2 rounded bg-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <input
                type="email"
                placeholder="email"
                className="w-full p-2 rounded bg-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <input
                type="text"
                placeholder="full name"
                className="w-full p-2 rounded bg-gray-800"
                value={fullName}
                onChange={(e) => setFullname(e.target.value)}
                />


                <button 
                onClick={handleRegister}
                className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700">
                Login
                </button>
            </div>

            
        </div>
    )

}

export default Register;
