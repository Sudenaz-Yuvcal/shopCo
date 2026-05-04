import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const AdminRoute = () => {
  const { user } = useUser();

  if (!user || user.email !== "admin@shop.co") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;