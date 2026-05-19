// src/app/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Home from '../home/pages/home';
 
import { fetchCurrentUser, finishInitializing } from '../features/auth/services/auth.slice';

import SignupPage from '../features/auth/pages/SignupPage';
import LoginPage from '../features/auth/pages/LoginPage';
import OtpPage from '../features/auth/pages/OtpPage';
// import ProfilePage from '../features/auth/pages/ProfilePage';

const Spinner = () => (
  <div className="min-h-screen bg-[#0b1918] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#29c8d6] border-t-transparent rounded-full animate-spin" />
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, initializing } = useSelector((state) => state.auth);
  if (initializing) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      // No token — skip API call, just stop the spinner
      dispatch(finishInitializing());
      return;
    }

    // Token exists — fetch the user profile to restore session
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
   
      <BrowserRouter>
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                {/* <ProfilePage /> */}
              </PrivateRoute>
            }
          />
          
        </Routes>
      </BrowserRouter>
     
    

  );
};

export default App;