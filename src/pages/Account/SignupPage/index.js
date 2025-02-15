import React, { useEffect, useContext, useState } from "react";
import "./styles.scss";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  VStack,
  Heading,
  ButtonGroup,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import TextField from "../../../components/TextField";
import ToggleColorMode from "../../../components/ToggleColorMode";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../../../components/AccountContext";
import { getThemeStyles } from "../../../components/colorTheme";

const SignupPage = () => {
  const navigate = useNavigate();
  const theme = getThemeStyles("test");
  const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);
  const color = useColorModeValue(theme.darkText, theme.lightText);
  const { user, setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  useEffect(() => {
    document.title = "Sign up • TCSN";
    if (user.loggedIn === true) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="signup-page">
      <ToggleColorMode />
      <VStack bg={bg} color={color} className="form">
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={Yup.object({
            username: Yup.string()
              .required("username required")
              .min(2, "username too short")
              .max(32, "username too long"),
            password: Yup.string()
              .required("password required")
              .min(6, "password too short")
              .max(128, "password too long"),
          })}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            // localStorage.setItem("username", values["username"])
            actions.resetForm();
            fetch("http://localhost:4000/auth/signup", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(vals),
            })
              .catch((err) => {
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
          <VStack
            as={Form}
            w={{ base: "60%", md: "500px" }}
            m="auto"
            justify="center"
            h="100vh"
            spacing="1rem"
          >
            <Heading>Sign up</Heading>
            <Text as="p" color="red.500">
              {error}
            </Text>
            <TextField
              name="username"
              type="text"
              label="Username"
              placeholder="username"
              minLength={2}
              maxLength={32}
              autoComplete="off"
              autoCapitalize="off"
            />
            <TextField
              name="password"
              type="password"
              label="Password"
              placeholder="password"
              minLength={6}
              maxLength={128}
              autoComplete="off"
              autoCapitalize="off"
              // helper="We dont store your password"
            />
            <ButtonGroup pt="1rem">
              <Button
                bg={theme.primaryDark}
                color={theme.lightText}
                _hover={{ bg: theme.primaryLight, cursor: "pointer" }}
                _active={{ bg: "#777", cursor: "pointer" }}
                type="submit"
              >
                Sign up
              </Button>
              <Button onClick={() => navigate("/")}>Login</Button>
            </ButtonGroup>
          </VStack>
        </Formik>
      </VStack>
    </div>
  );
};

export default SignupPage;
