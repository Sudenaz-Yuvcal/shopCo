import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import AppRouter from "./Router";
import ScrollToTop from "./components/ScrollToTop";
import { UserProvider } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <UserProvider>
      <HelmetProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />

            <AppRouter />

            <ToastContainer
              position="top-right"
              autoClose={2500}
              limit={3}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </Router>
        </CartProvider>
      </HelmetProvider>
    </UserProvider>
  );
}

export default App;
