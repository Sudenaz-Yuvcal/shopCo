import { useRoutes, type RouteObject, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "cart", element: <Cart /> },
        { path: "product/:id", element: <ProductDetail /> },
        { path: "newproduct", element: <NewProduct /> },
        { path: "brands", element: <Brands /> },
        { path: "discount", element: <Discount /> },
        { path: "shop", element: <Category /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "password", element: <Password /> },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: "success",
          element: (
            <ProtectedRoute>
              <Success />
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
  ];
  return useRoutes(routes);
};

export default AppRouter;
