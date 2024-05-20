import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './LoginPage';
import Register from './RegisterPage';
import Profile from './ProfilePage';
import MyProfile from './MyProfile';
import HomePage from './HomePage'
import Sidebar from './Sidebar'
import MyCompanies from './MyCompanies';
import CompanyFilesPage from './CompanyFilesPage';
import { NewDocument } from './NewDocument';
import DangersDocument from './DangersDocument';

const ProtectedRoute = ({ children }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/token/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          setIsValidToken(true);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error validating token:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // or any other loading state representation
  }

  return isValidToken ? children : <Navigate to="/login" replace />;
};



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route
            exact path="/my-organizations"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            exact path='/MyProfile'
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/organization/:orgId' // Updated path to use dynamic parameter
            element={
              <ProtectedRoute>
                <CompanyFilesPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact path='/NewDocument'
            element={
              <ProtectedRoute>
                <NewDocument />
              </ProtectedRoute>
            }
          />
          <Route path='/organization/:orgId/document/:docId' element={<ProtectedRoute><DangersDocument /></ProtectedRoute>} />
      
        </Routes>
      </Router>
    </div>
  );
}


export default App;
