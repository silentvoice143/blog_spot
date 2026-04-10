import "./App.css";

import DataProvider, { DataContext } from "./context/Dataprovider";
import Home from "./pages/home/home";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import { LoaderProvider, useLoader } from "./context/LoaderProvider";
import { Loader } from "./components/loader";
import Post from "./pages/post";

import Profile from "./pages/profile";
import Stories from "./pages/stories";
import Settings from "./pages/settings";
import { NotificationProvider } from "./context/NotificationProvider";
import socket from "./socket";
import NotificationLoader from "./components/notification-loader";
import NotificationListener from "./components/notification-listener";
import useRegisterSocket from "./hooks/useRegisterSocket";
import Notification from "./pages/notification";
import { NavProvider, useNavbarContext } from "./context/Navbar";
import SearchPage from "./pages/search";
import { useStore } from "./store";
import { useApiError } from "./hooks/use-api-error";
import { checkAuth } from "./services/auth-service";
import MainLayout from "./layout/main-layout";
import VerifyOtp from "./pages/auth/verify-otp";

const PrivateRoute = ({ isAuthenticated }, ...props) => {
  const location = useLocation();
  console.log(location, "---location");
  return isAuthenticated || location.pathname === "/" ? (
    <Outlet />
  ) : (
    <Navigate replace to="/login" />
  );
};

function App() {
  const userId = sessionStorage.getItem("userId");
  const { isAuthenticated, token } = useStore((state) => state);
  const { handleError } = useApiError();
  const { isConnected } = useRegisterSocket(token, userId);

  return (
    <div className="w-full h-full overflow-x-hidden font-montserrat">
      <LoaderProvider>
        <DataProvider>
          <NavProvider>
            <NotificationProvider>
              <Loader />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Register />} />
                  <Route
                    path="/signup/verify-otp/:name/:email"
                    element={<VerifyOtp />}
                  />

                  <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} />}
                  >
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    {/* <Route path="/post/create" element={<CreatePost />}></Route>
                    <Route path="/post/edit/:id" element={<EditPost />}></Route> */}
                    <Route path="/post/:id" element={<Post />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/stories" element={<Stories />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </NavProvider>
        </DataProvider>
      </LoaderProvider>
    </div>
  );
}

export default App;
