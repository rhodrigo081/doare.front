import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import SystemLayout from "./components/System/Layout/SystemLayout";
import Dashboard from "./pages/Dashboard";
import Donors from "./pages/Donors";
import DonationHistory from "./pages/DonationHistory";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./components/AuthProvider";
import PixPayment from "./pages/pixPayment";
import PixPage from "./pages/PixPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthProvider />,
      children: [
        {
          path: "/",
          element: <SystemLayout />,
          children: [
            {
              path: "",
              element: <Navigate to="/dashboard" replace />,
            },
            {
              path: "/dashboard",
              element: <Dashboard />,
            },
            {
              path: "/donors",
              element: <Donors />,
            },
            {
              path: "/donation-history",
              element: <DonationHistory />,
            },
          ],
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
    { path: "/pixPayment", element: <PixPayment /> },
    { path: "/pix", element: <PixPage /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" pauseOnHover />
    </>
  );
}

export default App;
