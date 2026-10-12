<<<<<<< HEAD
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner />
=======
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-400">
        Loading...
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
      </div>
    );
  }

  if (!user) {
<<<<<<< HEAD
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}

=======
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
