import React, { useContext } from "react";
import { Center, Icon, Square } from "@chakra-ui/react";
import "./styles.scss";
import CircleFlagsTw from "../../assets/svg/CircleFlagsTw";
import { getThemeStyles } from "../colorTheme";
import { ThemeContext } from "../ThemeContext";

const LoadingScreen = () => {
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  return (
    <Center bg={theme.primaryLight} h="100vh" className="loading-screen">
      <Square>
        <Icon className="logo" as={CircleFlagsTw} />
      </Square>
    </Center>
  );
};

export default LoadingScreen;
