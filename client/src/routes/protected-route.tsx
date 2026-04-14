import { Navigate, Outlet, useLocation } from "react-router-dom";

type Props = {
  isAuthenticated: boolean;
  allowedRoles?: string[];
  userRole?: string;
};

const PrivateRoute = ({
  isAuthenticated,
  allowedRoles,
  userRole,
}: Props) => {
  const location = useLocation();

  if (location.pathname === "/") {
    return <Outlet />;
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Role check (if provided)
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;