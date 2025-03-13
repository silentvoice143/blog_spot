import "./App.css";

import DataProvider from "./context/Dataprovider";
import Home from "./pages/home/home";
import Navbar from "./components/Navbar/Navbar";

import { useState } from "react";
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

const PrivateRoute = ({ isAuthenticated, setAuthentication }, ...props) => {
  const location = useLocation();
  console.log(isAuthenticated);
  return isAuthenticated ? (
    <div className="flex flex-col w-full min-h-screen">
      {!location.pathname.includes("/post/create") &&
        !location.pathname.includes("/post/edit") && (
          <div>
            <Navbar setAuthentication={setAuthentication} />
          </div>
        )}
      <div className="flex flex-1">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate replace to="/login" />
  );
};

function App() {
  const token = sessionStorage.getItem("accessToken");
  const [isAuthenticated, setAuthentication] = useState(token ? true : false);

  useEffect(() => {
    if (token) {
      setAuthentication(true);
    }
  }, [token]);
  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-auto font-montserrat">
      <LoaderProvider>
        <DataProvider>
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
                <Route
                  path="/post/create"
                  element={<CreatePost setAuthentication={setAuthentication} />}
                ></Route>
                <Route
                  path="/post/edit/:id"
                  element={<EditPost setAuthentication={setAuthentication} />}
                ></Route>
                <Route path="/post/:id" element={<Post />} />
                <Route path="/profile/:userId" element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </LoaderProvider>
    </div>
  );
}

export default App;
