import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// OTP is no longer used; signup returns a token and logs the user in directly.
// Redirect anyone who lands here to login.
const OTPVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to sign in...</p>
        <Link to="/login" className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium">
          Go to Sign in
        </Link>
      </div>
    </div>
  );
};

export default OTPVerification; 