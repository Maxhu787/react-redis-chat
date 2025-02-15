import "rsuite/styles/index.less";
import UserContext from "../src/components/AccountContext";
import ColorContext from "./components/ThemeContext";
import ToggleColorMode from "./components/ToggleColorMode";
import Views from "./pages/Views";
import { useState, useEffect } from "react";
import { HStack, VStack, Text, Flex, Box } from "@chakra-ui/react";

function App() {
  const localTheme = localStorage.getItem("localTheme") || "default";
  const [currentTheme, setCurrentTheme] = useState(localTheme);
  useEffect(() => {
    document.title = "TCSN";
  }, []);
  return (
    <UserContext>
      <ColorContext
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      >
        {/* <Flex>
          <Box width={"70px"}>
            <VStack>
              <Text>hi</Text>
            </VStack>
          </Box>
          <Box flex="1">
            <Views />
          </Box>
        </Flex> */}
        <Views />
        <ToggleColorMode />
      </ColorContext>
    </UserContext>
  );
}

export default App;
