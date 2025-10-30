import "./App.css";

import DataProvider, { DataContext } from "./context/Dataprovider";
import Home from "./pages/home/home";
import Navbar from "./components/Navbar/Navbar";

import { useContext, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreatePost from "./pages/create/create-post";
import { LoaderProvider, useLoader } from "./context/LoaderProvider";
import { Loader } from "./components/loader";
import Post from "./pages/post";
import EditPost from "./pages/edit/edit-post";
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

const PrivateRoute = ({ isAuthenticated, setAuthentication }, ...props) => {
  const location = useLocation();
  const { showNotifications, setShowNotifications } = useNavbarContext();

  const showNav =
    !location.pathname.includes("/post/create") &&
    !location.pathname.includes("/post/edit");

  return isAuthenticated ? (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {showNav && (
        <div className="sticky top-0 z-50 bg-white">
          <Navbar setAuthentication={setAuthentication} />
        </div>
      )}
      <div className={`${showNav ? "h-[90%]" : "h-full"} w-full relative`}>
        {showNotifications && (
          <Notification onClose={() => setShowNotifications(false)} />
        )}
        <NotificationLoader isAuthenticated={isAuthenticated} />
        <NotificationListener isAuthenticated={isAuthenticated} />
        {/* <div className="w-full relative"> */}
        <Outlet />
        {/* </div> */}
      </div>
    </div>
  ) : (
    <Navigate replace to="/login" />
  );
};

function App() {
  const token = sessionStorage.getItem("accessToken");
  const userId = sessionStorage.getItem("userId");
  const [isAuthenticated, setAuthentication] = useState(token ? true : false);
  const { isConnected } = useRegisterSocket(token, userId);

  useEffect(() => {
    if (token) {
      setAuthentication(true);
    }
  }, [token]);
  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-hidden font-montserrat">
      <LoaderProvider>
        <DataProvider>
          <NavProvider>
            <NotificationProvider>
              <Loader />
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/login"
                    element={<Login setAuthentication={setAuthentication} />}
                  />
                  <Route
                    path="/signup"
                    element={<Register setAuthentication={setAuthentication} />}
                  />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        setAuthentication={setAuthentication}
                      />
                    }
                  >
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route
                      path="/post/create"
                      element={
                        <CreatePost setAuthentication={setAuthentication} />
                      }
                    ></Route>
                    <Route
                      path="/post/edit/:id"
                      element={
                        <EditPost setAuthentication={setAuthentication} />
                      }
                    ></Route>
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
