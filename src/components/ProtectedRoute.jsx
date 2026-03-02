import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, isSupabaseConfigured } = useAuth();

    if (!isSupabaseConfigured) {
        // For demo purposes, if supabase isn't configured, we allow access to see the UI.
        // In a real app we'd show an error or a setup screen.
        return <>{children}</>;
    }

    if (!user) {
        // user is not authenticated
        return <Navigate to="/auth" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
