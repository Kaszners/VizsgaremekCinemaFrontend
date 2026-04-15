import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/register';

function App() {
  return(
  <BrowserRouter>
    <div className='bg-[#f2f0ec] min-h-screen text-[#2a2520]'>
      <Navbar />
      <div className='p-6'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </div>


    </div>

  </BrowserRouter>
)
}

export default App
