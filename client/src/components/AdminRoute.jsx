import { Navigate } from 'react-router-dom';
import useAdminStore from '../store/adminStore';

const AdminRoute = ({ children }) => {
    const isAdminAuthenticated = useAdminStore((state) => state.isAdminAuthenticated);
    const _hasHydrated = useAdminStore((state) => state._hasHydrated);

    if (!_hasHydrated) return null;

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default AdminRoute;
