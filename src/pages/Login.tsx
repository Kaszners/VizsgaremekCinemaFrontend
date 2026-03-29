import { useState } from "react";
import { login } from "../services/authServiec";

function Login(){
    
    const[usernameOrEmail,setUsername] = useState("");
    const[password,setPassword] = useState("");

    const handleLogin = async () =>{
        try{
            await login(usernameOrEmail, password);
            window.location.href = "/"
        }catch(error){
            console.error("LOGIN ERROR:",error)
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
                value={usernameOrEmail}
                onChange={(e) => setUsername(e.target.value)}
            />
                
                <input type="password"
                placeholder="password" 
                className="w-full p-2 rounded bg-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button 
                onClick={handleLogin}
                className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700">
                Login
                </button>
            </div>

            
        </div>
    )
}

export default Login;