import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import ListeAppartements from './pages/ListeAppartements';
import DetailAppartement from './pages/DetailAppartement';
import Home from './pages/Home';
 
import './App.css';

import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import PrivateRoute from './Private/PrivateRoute';






function App() {
  

  return (
    <Router>
      <Routes>
        {/* Alors là c'est pour avoir le home sans navbar ds le "public" */}
        <Route path ="/" element={<Home />} />
        <Route path ="/login" element={<Login />} />


        {/* et là je vais pouvoir avoir tout ce qui est protégé par le login */}
       
        <Route element={<PrivateRoute />}>        
          <Route element={<MainLayout />}>
            <Route path="/appartements" element={<ListeAppartements />} />
            <Route path ="/detail/:id" element={<DetailAppartement />} />
          </Route>
        </Route >
      </Routes>
    </Router>
  );
}

export default App;