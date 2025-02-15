import { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./Account/LoginPage";
import SignupPage from "./Account/SignupPage";
import PrivateRoutes from "./PrivateRoutes";
import SettingsPage from "./SettingsPage";
import ProfilePage from "./ProfilePage";
import { AccountContext } from "../components/AccountContext";
import LoadingScreen from "../components/LoadingScreen";

const Test = () => {
  return <div>hi</div>;
};

const Views = () => {
  const { user } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user.loggedIn !== null) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user.loggedIn]);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          user.loggedIn ? <Navigate to="/home" replace={true} /> : <LoginPage />
        }
      ></Route>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<HomePage />}></Route>
      </Route>
      <Route path="/settings" element={<SettingsPage />} />
      <Route path=":username" element={<ProfilePage />}></Route>
    </Routes>
  );
};

export default Views;
