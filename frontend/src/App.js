import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 


import ListeAppartements from './pages/ListeAppartements';
import DetailAppartement from './pages/DetailAppartement';
import Navbar from './components/Navbar';
 
import './App.css';




function App() {
  

  return (
    <Router>
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<ListeAppartements />} />
        <Route path ="/detail/:id" element={<DetailAppartement />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;