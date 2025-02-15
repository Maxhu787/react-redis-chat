import React, { useEffect, useContext, useState } from "react";
import "./styles.scss";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../../../components/AccountContext";
import { ThemeContext } from "../../../components/ThemeContext";
import { getThemeStyles } from "../../../components/colorTheme";

const LoginPage = () => {
  const { user, setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login • TCSN";

    if (user.loggedIn === true) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="login-page">
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required("username required"),
          password: Yup.string().required("password required"),
        })}
        onSubmit={(values, actions) => {
          const vals = { ...values };
          actions.resetForm();
          fetch("http://localhost:4000/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(vals),
          })
            .catch((err) => {
              setError(err);
              return;
            })
            .then((res) => {
              if (!res || !res.ok || res.status >= 400) {
                return;
              }
              return res.json();
            })
            .then((data) => {
              if (!data) return;
              setUser({ ...data });
              if (data.status) {
                setError(data.status);
              } else if (data.loggedIn) {
                navigate("/home");
              }
            });
        }}
      >
        {(formik) => (
          <div className="login">
            <div className="header">
              <div>
                G4o2
                <span>Chat</span>
              </div>
            </div>
            <br />
            <form onSubmit={formik.handleSubmit}>
              <p style={{ color: "red" }}>{error}</p>
              <div className="input-field">
                <input
                  name="username"
                  type="text"
                  placeholder="username"
                  minLength={2}
                  maxLength={32}
                  autoComplete="off"
                  autoCapitalize="off"
                  {...formik.getFieldProps("username")}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div style={{ color: "red" }}>{formik.errors.username}</div>
                ) : null}
              </div>
              <div className="input-field">
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  minLength={6}
                  maxLength={128}
                  autoComplete="off"
                  autoCapitalize="off"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div style={{ color: "red" }}>{formik.errors.password}</div>
                ) : null}
              </div>
              <button type="submit">Login</button>
              <button id="signup" onClick={() => navigate("/signup")}>
                {/* Sign up */}
                Create Account
              </button>
            </form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
