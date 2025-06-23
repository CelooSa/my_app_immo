import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Preview from './pages/Preview';
import ListeAppartements from './pages/ListeAppartements';
import DetailAppartement from './pages/DetailAppartement';

import MinimalNavbar from './components/MinimalNavbar';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './Private/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/preview" element={
          <>
            <MinimalNavbar />
            <Preview />
          </>
        } />

        {/* PROTECTED */}
        <Route element={<PrivateRoute />}>
          <Route path="/appartements" element={
            <MainLayout>
              <ListeAppartements />
            </MainLayout>
          } />
          <Route path="/detail/:id" element={
            <MainLayout>
              <DetailAppartement />
            </MainLayout>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
