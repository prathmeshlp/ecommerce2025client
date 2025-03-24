import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import PrivateRoute from "../components/PrivateRoute";

// Lazy-loaded components
const Login = lazy(() => import("../pages/AuthPage"));
const Error = lazy(() => import("../pages/Error"));
const Root = lazy(() => import("../pages/Root"));
const Home = lazy(() => import("../pages/Home"));
const Cart = lazy(() => import("../pages/Cart"));
const Orders = lazy(() => import("../pages/Orders"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Profile = lazy(() => import("../pages/Profile"));
const AuthCallback = lazy(() => import("../pages/AuthCallback"));
const Checkout = lazy(() => import("../pages/Checkout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const ProductManagement = lazy(() => import("../pages/admin/ProductManagement"));
const OrderManagement = lazy(() => import("../pages/admin/OrderManagement"));
const DiscountManagement = lazy(() => import("../pages/admin/DiscountManagement"));
const ProductDescriptionPage = lazy(() => import("../pages/ProductDescriptionPage"));

export const router = createBrowserRouter([
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
        path: "product/:id",
        element: (
          <PrivateRoute>
            <ProductDescriptionPage />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/products",
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