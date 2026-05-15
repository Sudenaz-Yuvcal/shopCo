import { useRoutes, type RouteObject, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import { useUser } from "./context/UserContext";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import NewProduct from "./pages/NewProduct";
import Brands from "./pages/Brands";
import Discount from "./pages/Discount";
import Category from "./pages/Category";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Password from "./pages/Password";
import Account from "./pages/Account";
import Favorite from "./pages/Favorite";
import AddProductPage from "./pages/Admin/AddProductPage";
import VerifyPage from "./pages/VerifyPage";

import Dashboard from "./pages/Admin/Dashboard";
import ProductsListPage from "./pages/Admin/ProductsListPage";
import UsersManagementPage from "./pages/Admin/UsersManagementPage";
import OrdersPage from "./pages/Admin/OrdersPage";
import CouponsPage from "./pages/Admin/CouponsPage";
import RevenueAnalysis from "./pages/Admin/RevenueAnalysis";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();

  if (loading)
    return (
      <div className="h-screen bg-white flex items-center justify-center font-black italic text-4xl">
        CHECKING AUTH...
      </div>
    );

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  return !user ? <>{children}</> : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();

  if (loading)
    return (
      <div className="h-screen bg-white flex items-center justify-center font-black italic text-4xl">
        ADMIN CHECK...
      </div>
    );

  const isAdmin = user?.role === "admin";
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};
const AppRouter: React.FC = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "cart", element: <Cart /> },
        { path: "favorite", element: <Favorite /> },
        { path: "product/:slug", element: <ProductDetail /> },
        { path: "newproduct", element: <NewProduct /> },
        { path: "brands", element: <Brands /> },
        { path: "discount", element: <Discount /> },
        { path: "shop", element: <Category /> },
        { path: "password", element: <Password /> },
        { path: "success", element: <Success /> },

        {
          path: "login",
          element: (
            <PublicRoute>
              <Login />
            </PublicRoute>
          ),
        },
        {
          path: "register",
          element: (
            <PublicRoute>
              <Register />
            </PublicRoute>
          ),
        },
        {
          path: "verify",
          element: (
            <PublicRoute>
              <VerifyPage />
            </PublicRoute>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: "account",
          element: (
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },

    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "add-product", element: <AddProductPage /> },
        { path: "edit-product/:id", element: <AddProductPage /> },
        { path: "products", element: <ProductsListPage /> },
        { path: "users", element: <UsersManagementPage /> },
        { path: "orders", element: <OrdersPage /> },
        { path: "coupons", element: <CouponsPage /> },
        { path: "revenue", element: <RevenueAnalysis /> },
      ],
    },
  ];

  const element = useRoutes(routes);
  return element;
};

export default AppRouter;
