import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import Preview from "./pages/Preview";
import BlocNotes from "./pages/BlocNotes";

import Login from "./pages/Login";

import ListeAppartements from "./pages/ListeAppartements";
import DetailAppartement from "./pages/DetailAppartement";
import Contacts from "./pages/Contacts";
import Memos from "./pages/Memos";

import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./Private/PrivateRoute";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC */}

        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Home />
            </motion.div>
          }
        />

        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Login />
            </motion.div>
          }
        />

        <Route
          path="/preview"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Preview />
            </motion.div>
          }
        />
        <Route
          path="/blocnotes"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BlocNotes />
            </motion.div>
          }
        />

        {/* PROTECTED */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/appartements"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MainLayout>
                  <ListeAppartements />
                </MainLayout>
              </motion.div>
            }
          />

          <Route
            path="/detail/:id"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MainLayout>
                  <DetailAppartement />
                </MainLayout>
              </motion.div>
            }
          />

          <Route
            path="/contacts"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MainLayout>
                  <Contacts />
                </MainLayout>
              </motion.div>
            }
          />

          <Route
            path="/memos"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MainLayout>
                  <Memos />
                </MainLayout>
              </motion.div>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
