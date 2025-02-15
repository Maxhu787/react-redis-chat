import {
  Tabs,
  TabList,
  Tab,
  Text,
  useColorModeValue,
  HStack,
  VStack,
  Heading,
  Divider,
  IconButton,
  TabIndicator,
  Flex,
  Box,
  TabPanels,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import { themeStylesList, getThemeStyles } from "../../components/colorTheme";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AccountContext } from "../../components/AccountContext";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const SettingsPage = () => {
  const { user, setUser } = useContext(AccountContext);
  const { currentTheme, setCurrentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  const messageSentBg = useColorModeValue(theme.primaryDark, theme.primaryDark);
  const messageSentColor = useColorModeValue(theme.lightText, theme.lightText);
  const messageReceiveBg = useColorModeValue(
    theme.secondaryLight,
    theme.secondaryDark,
  );
  const messageReceiveColor = useColorModeValue(
    theme.darkText,
    theme.lightText,
  );
  const navigate = useNavigate();
  const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);
  const bgSecondary = useColorModeValue(
    theme.secondaryLightBackground,
    theme.secondaryDarkBackground,
  );
  const borderColor = useColorModeValue(theme.lightBorder, theme.darkBorder);
  useEffect(() => {
    document.title = "Settings • TCSN";

    if (user.loggedIn !== true) {
      navigate("/");
    }
  }, []);
  const messages = [
    {
      to: "friend",
      from: "user",
      content: "hi 👋",
    },
    {
      to: "user",
      from: "friend",
      content: "hello there",
    },
    {
      to: "friend",
      from: "user",
      content: "nice chat app!",
    },
    {
      to: "friend",
      from: "user",
      content: "This theme looks cool 😎",
    },
    {
      to: "user",
      from: "friend",
      content: "yessirrr 😉",
    },
  ];

  const handleLogout = () => {
    fetch("http://localhost:4000/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch((err) => {
        alert(err);
        return;
      })
      .then((res) => {
        if (!res || !res.ok || res.status >= 400) {
          return;
        }
        navigate(0);
      });
  };

  return (
    <>
      <Flex
        orientation={"vertical"}
        isLazy={true}
        align="start"
        variant="unstyled"
        as={Tabs}
        h="100vh"
      >
        <VStack
          bg={bgSecondary}
          height={"100vh"}
          overflowY={"scroll"}
          w={"230px"}
          minW={"230px"}
          maxW={"230px"}
          as={TabList}
        >
          <HStack
            px={"10px"}
            height={"80px"}
            paddingBottom={"20px"}
            justify="space-evenly"
            w="100%"
            borderBottom={"solid 1px"}
            borderColor={borderColor}
            display={"relative"}
          >
            <IconButton
              display={"absolute"}
              onClick={() => {
                navigate("/home");
              }}
              aria-label="Search database"
              borderRadius={"30px"}
              icon={<ArrowBackIcon />}
              paddingBottom={"2px"}
              position={"absolute"}
              top={"18px"}
              left={"18px"}
            />
            <Heading marginLeft={"70px"} marginTop={"29px"} fontSize={"18px"}>
              Settings
            </Heading>
          </HStack>
          <motion.div
            style={{ width: "100%" }}
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={item}>
              <HStack
                padding={"12px"}
                w="100%"
                as={Tab}
                justifyContent={"flex-end"}
                textAlign="right"
                px={"30px"}
                _selected={{
                  borderBottom: "solid 2px",
                  borderColor: theme.primaryDark,
                  color: theme.primaryDark,
                }}
              >
                <Text>Theme</Text>
              </HStack>
            </motion.div>
            <motion.div variants={item}>
              <HStack
                padding={"12px"}
                w="100%"
                as={Tab}
                justifyContent={"flex-end"}
                textAlign="right"
                px={"30px"}
                _selected={{
                  borderBottom: "solid 2px",
                  borderColor: theme.primaryDark,
                  color: theme.primaryDark,
                }}
              >
                <Text>Account</Text>
              </HStack>
            </motion.div>
          </motion.div>
        </VStack>
        <TabPanels bg={bg} height={"100vh"} flex="1" p={"50px 50px 20px 50px"}>
          <TabPanel>
            <HStack>
              <Heading marginLeft={"12px"}>Themes</Heading>
            </HStack>
            <Divider />
            <Tabs
              onChange={(index) => {
                setCurrentTheme(themeStylesList[index]);
                localStorage.setItem("localTheme", themeStylesList[index]);
              }}
              variant={"unstyled"}
              isFitted
              index={themeStylesList.indexOf(currentTheme)}
            >
              <VStack borderRadius={"16px"} bg={bg} p={"20px"} flexDir="column">
                {messages
                  .filter((msg) => msg.to === "friend" || msg.from === "friend")
                  .map((message, index, arr) => {
                    const previousMessage = arr[index + 1];
                    const nextMessage = arr[index - 1];
                    const messageStyle =
                      message.to !== "friend"
                        ? !previousMessage || previousMessage.to === "friend"
                          ? "messageReceiveFirst"
                          : !nextMessage || nextMessage.to === "friend"
                            ? "messageReceiveLast"
                            : "messageReceive"
                        : !previousMessage || previousMessage.to !== "friend"
                          ? "messageSentFirst"
                          : !nextMessage || nextMessage.to !== "friend"
                            ? "messageSentLast"
                            : "messageSent";
                    return (
                      <Text
                        key={`msg:${index}`}
                        maxW="30vw"
                        // maxW={"50%"}
                        fontSize="15px"
                        // as={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ overflowWrap: "break-word" }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        bg={
                          message.to === "friend"
                            ? messageSentBg
                            : messageReceiveBg
                        }
                        color={
                          message.to === "friend"
                            ? messageSentColor
                            : messageReceiveColor
                        }
                        borderRadius="16px"
                        p="7px 12px"
                        margin="0 !important"
                        borderTopLeftRadius={
                          messageStyle === "messageReceiveFirst" ||
                          messageStyle === "messageReceive"
                            ? "4px"
                            : ""
                        }
                        borderBottomLeftRadius={
                          messageStyle === "messageReceiveLast" ||
                          messageStyle === "messageReceive"
                            ? "4px"
                            : ""
                        }
                        borderTopRightRadius={
                          messageStyle === "messageSentFirst" ||
                          messageStyle === "messageSent"
                            ? "4px"
                            : ""
                        }
                        borderBottomRightRadius={
                          messageStyle === "messageSentLast" ||
                          messageStyle === "messageSent"
                            ? "4px"
                            : ""
                        }
                        m={
                          message.to === "friend"
                            ? "0 0 0px auto !important"
                            : "0 auto 0 0 !important"
                        }
                      >
                        {message.content}
                      </Text>
                    );
                  })}
              </VStack>
              <HStack as={TabList}>
                {themeStylesList.map((theme) => (
                  <HStack
                    padding={"12px"}
                    w="100%"
                    as={Tab}
                    key={`theme:${theme}`}
                  >
                    <Text>{theme}</Text>
                  </HStack>
                ))}
              </HStack>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg={theme.primaryDark}
                borderRadius="1px"
              />
            </Tabs>
          </TabPanel>
          <TabPanel>
            <HStack>
              <Heading marginLeft={"12px"}>Account</Heading>
            </HStack>
            <Divider />
            <Button
              backgroundColor={theme.primaryDark}
              color={theme.lightText}
              onClick={handleLogout}
              _hover={{ bg: theme.primaryLight, cursor: "pointer" }}
              _active={{ bg: "#777", cursor: "pointer" }}
            >
              Logout
            </Button>
          </TabPanel>
        </TabPanels>
      </Flex>
    </>
  );
};

export default SettingsPage;
