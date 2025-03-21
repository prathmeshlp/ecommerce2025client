import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/AuthPage";
// import Register from "./pages/Register";
import Error from "./pages/Error";
import Root from "./pages/Root";
import PrivateRoute from "./components/PrivateRoute"; 
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import "./index.css";
import AuthCallback from "./pages/AuthCallback";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";
import DiscountManagement from "./pages/DiscountManagement";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
    errorElement: <Error />,
  },
  {
    path: "/app",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        ),
      },
      {
       path:"admin/dashboard",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
       path:"admin/users",
        element: (
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        ),
      },
      {
       path:"admin/products",
        element: (
          <PrivateRoute>
            <ProductManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/orders",
        element: (
          <PrivateRoute>
            <OrderManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/discounts",
        element: (
          <PrivateRoute>
            <DiscountManagement />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;