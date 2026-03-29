import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/register';

function App() {
  return(
  <BrowserRouter>
    <div className='bg-black min-h-screen text-white'>
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
