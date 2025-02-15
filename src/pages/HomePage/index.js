import React, { useEffect, createContext, useState, useContext } from "react";
import "./styles.scss";
import { Flex, Box, Tabs, useColorModeValue } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import Chat from "../../components/Chat";
import useSocketSetup from "./useSocketSetup";
import { getThemeStyles } from "../../components/colorTheme";
import { ThemeContext } from "../../components/ThemeContext";
import { motion } from "framer-motion";

export const FriendContext = createContext();
export const MessagesContext = createContext();
export const GroupsContext = createContext();
export const UnreadContext = createContext();

const HomePage = () => {
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [unread, setUnread] = useState({});
  const [friendIndex, setFriendIndex] = useState(0);
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  // const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);
  const bgSecondary = useColorModeValue(
    theme.secondaryLightBackground,
    theme.secondaryDarkBackground,
  );
  // const borderColor = useColorModeValue(theme.lightBorder, theme.darkBorder);
  useSocketSetup(setFriendList, setMessages, setGroups, setUnread, unread);
  useEffect(() => {
    const totalUnread = Object.values(unread).reduce(
      (acc, value) => acc + (value !== null ? parseInt(value) : 0),
      0,
    );
    document.title = `${!totalUnread ? "" : `(${totalUnread})`} TCSN`;
    // const favicon = document.getElementById("favicon");
    // if (favicon) {
    // let src =
    // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAA7ElEQVR4AWJwLwC0WwcaCENhFMefoV6hABgEBhDAxN7jAggRPcSeoAcYQFgIInuSIcAlwLqHM45klvtt0PCXO7Pfvu3Gskn7c3AG/WldhNIpwRaNDQJadb9EH9agYiWQ13G55doRPYwFLkKNIpiQ68QcZIqUXHuszUBMo1PJLm2JJ/qoo0FcSKZCBdGc62asd5h8wkRTKxCIkwsvZPMU+h7tQP4VNB5zehNR4LWq6tD+y+N0xHyH8/wzigFbXEA2TColiMed3ODTBMQUPXlzEJP0ZQnWl9t9MyQr8KdiwTy0C2WD4rnzN80MmvcG9xb1UQNO3ZEAAAAASUVORK5CYII=";
    // favicon.href = src;
    // }
  }, [unread]);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <GroupsContext.Provider value={{ groups, setGroups }}>
        <UnreadContext.Provider value={{ unread, setUnread }}>
          <Flex
            h="100vh"
            as={Tabs}
            // variant="unstyled"
            isLazy={true}
            bg={theme.primaryLight}
            onChange={(index) => setFriendIndex(index)}
          >
            <Box
              w="380px"
              colSpan={3}
              bg={bgSecondary}
              as={motion.div}
              // animate={{ width: "0px", opacity: 0 }}
            >
              <MessagesContext.Provider value={{ messages, setMessages }}>
                <Sidebar />
              </MessagesContext.Provider>
            </Box>
            <Box flex="1">
              <MessagesContext.Provider value={{ messages, setMessages }}>
                <Chat
                  tabIndex={friendIndex}
                  userid={
                    friendIndex <= friendList.length - 1
                      ? friendList[friendIndex]?.userid
                      : null
                  }
                  group_hash={
                    friendIndex <= friendList.length - 1
                      ? null
                      : groups[friendIndex - friendList.length]?.group_hash
                  }
                />
              </MessagesContext.Provider>{" "}
            </Box>
          </Flex>
        </UnreadContext.Provider>
      </GroupsContext.Provider>
    </FriendContext.Provider>
  );
};

export default HomePage;
