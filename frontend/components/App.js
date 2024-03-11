import React from 'react'
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from './Home'
import Form from './Form'

function App() {
  const location = useLocation();
  console.log(location)
  return (
    <div id="app">
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>  
        <Link to="/order" className={location.pathname === '/order' ? 'active' : ''}>Order</Link> 
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  )
}
export default App
