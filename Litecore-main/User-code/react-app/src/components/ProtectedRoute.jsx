import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../api';

const ProtectedRoute = ({ element }) => {
  const [isAuthed, setIsAuthed] = React.useState(null);

  useEffect(() => {
    const token = getToken();
    setIsAuthed(!!token);
  }, []);

  if (isAuthed === null) {
    return <div>Loading...</div>;
  }

  return isAuthed ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
