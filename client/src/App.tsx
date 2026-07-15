import "./App.css";

import DataProvider, { DataContext } from "./context/Dataprovider";
import Home from "./pages/home/home";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

import { LoaderProvider } from "./context/LoaderProvider";

import Post from "./pages/post";

import Profile from "./pages/profile";
import Stories from "./pages/stories";
import Settings from "./pages/settings";
import { NotificationProvider } from "./context/NotificationProvider";

import useRegisterSocket from "./hooks/useRegisterSocket";

import { NavProvider } from "./context/Navbar";
import SearchPage from "./pages/search";
import { useStore } from "./store";
import { useApiError } from "./hooks/use-api-error";

import MainLayout from "./layout/main-layout";
import VerifyOtp from "./pages/auth/verify-otp";
import NotFound from "./pages/not-found";
import CreatePost from "./pages/create/create-post";
import PrivateRoute from "./routes/protected-route";
import { ROLES } from "./constant/roles";
import Dashboard from "./pages/dashboard";
import Preview from "./pages/create/components/preview";
import { Spinner } from "./components/shared/loader";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  const userId = sessionStorage.getItem("userId");
  const { isAuthenticated, token, globalLoading } = useStore((state) => state);
  const { handleError } = useApiError();
  const { isConnected } = useRegisterSocket(token, userId);

  return (
    <div className="w-full h-full overflow-x-hidden font-montserrat">
      <LoaderProvider>
        <DataProvider>
          <NavProvider>
            <NotificationProvider>
              {globalLoading && <Spinner />}
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Register />} />
                  <Route
                    path="/signup/verify-otp/:name/:email"
                    element={<VerifyOtp />}
                  />

                  <Route
                    element={
                      <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        allowedRoles={[ROLES.SUPER_ADMIN, ROLES.USER]}
                      />
                    }
                  >
                    <Route path="/" element={<Home />} />
                    <Route element={<MainLayout children={<Outlet />} />}>
                      <Route path="/search" element={<SearchPage />} />
                      <Route
                        path="/post/create"
                        element={<CreatePost />}
                      ></Route>
                      <Route path="/post/preview" element={<Preview />}></Route>

                      {/* <Route path="/post/edit/:id" element={<EditPost />}></Route> */}
                      <Route path="/post/:id" element={<Post />} />
                      <Route path="/profile/:userId" element={<Profile />} />
                      <Route path="/stories" element={<Stories />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        allowedRoles={[ROLES.SUPER_ADMIN]}
                      />
                    }
                  >
                    <Route element={<MainLayout children={<Outlet />} />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
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
