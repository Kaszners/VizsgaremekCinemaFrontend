import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav className="bg-gray-900 px-6 py-4 flex justify-between text-white">
            <h1 className="text-xl font-bold">cinema</h1>

            <div className="space-x-4">
                <Link to="/">Home</Link>
                <Link to="login">Login</Link>
                <Link to="register">Register</Link>
            </div>
        </nav>
    )
}

export default Navbar;