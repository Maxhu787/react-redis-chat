import {
  HStack,
  VStack,
  Heading,
  Button,
  Tab,
  TabList,
  Text,
  Divider,
  useDisclosure,
  useColorModeValue,
  Icon,
  AvatarBadge,
  Avatar,
  AvatarGroup,
  Box,
} from "@chakra-ui/react";
import { React, useContext, useEffect } from "react";
import {
  FriendContext,
  GroupsContext,
  MessagesContext,
  UnreadContext,
} from "../../pages/HomePage";
import { AccountContext } from "../../components/AccountContext";
import { ThemeContext } from "../ThemeContext";
import AddFriendModal from "../AddFriendModal";
import CreateGroupModal from "../CreateGroupModal";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import { getThemeStyles } from "../colorTheme";
import { SettingsIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import CreateGroupIcon from "../../assets/svg/CreateGroupIcon";
import AddUserIcon from "../../assets/svg/AddUserIcon";

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
const Sidebar = () => {
  const { friendList } = useContext(FriendContext);
  const { groups } = useContext(GroupsContext);
  const { messages } = useContext(MessagesContext);
  const { unread, setUnread } = useContext(UnreadContext);
  const { user } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCreateGroupModalOpen,
    onOpen: onCreateGroupModalOpen,
    onClose: onCreateGroupModalClose,
  } = useDisclosure();
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  const borderColor = useColorModeValue(theme.lightBorder, theme.darkBorder);
  const textColor = useColorModeValue(theme.darkText, theme.lightText);
  const navigate = useNavigate();
  const bg = (connected) => {
    let color = "";
    if (connected) {
      color = "green.500";
    } else {
      color = "red.500";
    }
    if (connected === "false") {
      color = "red.500";
    }
    return color;
  };
  useEffect(() => {
    socket.emit("fetch_data");
  }, []);

  // useEffect(() => {
  //   // console.log(messages);
  //   // console.log(friendList);
  //   if (messages.length !== 0) {
  //     friendList.map((friend) => {
  //       let temp = messages.filter(
  //         (msg) =>
  //           msg.to === friend.userid ||
  //           (msg.from === friend.userid && msg.to === user.userid),
  //       );
  //       console.log(friend.username, temp[0]["content"], "temp");
  //     });
  //   }
  // }, [messages, friendList]);

  return (
    <>
      <VStack
        py="1.4rem"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
        height={"100%"}
      >
        <HStack
          px={"0px"}
          style={{ flex: "1" }}
          paddingBottom={"20px"}
          justify="space-evenly"
          w="100%"
          borderBottom={"solid 1px"}
          borderColor={borderColor}
        >
          <Heading marginLeft={"8px"} size="sm">
            TCSN • test
          </Heading>
          <HStack>
            <Button onClick={onOpen}>
              <Icon
                height={"16px"}
                width={"16px"}
                color={textColor}
                as={AddUserIcon}
              />
            </Button>
            <Button onClick={onCreateGroupModalOpen}>
              <Icon
                height={"21px"}
                width={"21px"}
                color={textColor}
                as={CreateGroupIcon}
              />
            </Button>
          </HStack>
        </HStack>
        <VStack
          maxH={"100vh"}
          overflowY={"scroll"}
          w="100%"
          style={{ flex: "19" }}
          as={TabList}
        >
          {friendList.length === 0 ? (
            <>
              <Text marginTop={"30px"}>Having problems loading data?</Text>
              <button
                style={{
                  padding: "10px 20px",
                  border: "solid 2px",
                  borderColor: borderColor,
                  borderRadius: "12px",
                  marginTop: "12px",
                }}
                onClick={() => {
                  socket.emit("fetch_data");
                }}
              >
                refetch data!
              </button>
            </>
          ) : (
            <motion.div
              style={{ width: "100%" }}
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {friendList.map((friend) => (
                <HStack
                  padding={"12px"}
                  w="100%"
                  as={Tab}
                  justifyContent="stretch"
                  textAlign="left"
                  _selected={{
                    borderBottom: "solid 2px",
                    borderColor: theme.primaryDark,
                    color: theme.primaryDark,
                  }}
                  px={"30px"}
                  key={`friend:${friend}`}
                  onClick={() => {
                    socket.emit("clear_unread", friend.userid);
                    setUnread((prev) => ({
                      ...prev,
                      [friend.userid]: 0,
                    }));
                  }}
                >
                  <motion.div variants={item}>
                    <HStack>
                      <Avatar
                        name={friend.username}
                        bg={theme.primaryDark}
                        size={"md"}
                      >
                        <AvatarBadge boxSize="1em" bg={bg(friend.connected)} />
                      </Avatar>
                      <VStack gap={"0px"} alignItems="start">
                        <Text fontSize={"20px"}>{friend.username}</Text>
                        {!messages || messages.length === 0 ? (
                          ""
                        ) : (
                          <HStack>
                            <Text
                              style={{
                                textOverflow: "ellipsis",
                              }}
                              marginTop={"-4px"}
                              color={"#888"}
                              fontSize={"14px"}
                            >
                              {messages.filter(
                                (msg) =>
                                  msg.to === friend.userid ||
                                  (msg.from === friend.userid &&
                                    msg.to === user.userid),
                              )[0]["from"] === friend.userid
                                ? friend.username
                                : "You"}
                              {": "}
                              {messages
                                .filter(
                                  (msg) =>
                                    msg.to === friend.userid ||
                                    (msg.from === friend.userid &&
                                      msg.to === user.userid),
                                )[0]
                                ["content"].slice(0, 25)}
                            </Text>
                            {!unread[friend.userid] ? (
                              ""
                            ) : (
                              <Box
                                bg={"red.500"}
                                height={"16px"}
                                width={"26px"}
                                marginTop={"-2px"}
                                borderRadius={"20px"}
                              >
                                <Text
                                  textAlign={"center"}
                                  lineHeight={"16px"}
                                  color={"#fff"}
                                  fontSize={"10px"}
                                >
                                  {unread[friend.userid] >= 100
                                    ? "99+"
                                    : unread[friend.userid]}
                                </Text>
                              </Box>
                            )}
                          </HStack>
                        )}
                      </VStack>
                    </HStack>
                  </motion.div>
                </HStack>
              ))}
            </motion.div>
          )}
          <Divider />
          {groups.length === 0 ? (
            <Text>No groups found :(</Text>
          ) : (
            <motion.div
              style={{ width: "100%" }}
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {groups.map((group) => (
                <HStack
                  padding={"12px"}
                  w="100%"
                  as={Tab}
                  justifyContent="stretch"
                  textAlign="left"
                  px={"30px"}
                  _selected={{
                    borderBottom: "solid 2px",
                    borderColor: theme.primaryDark,
                    color: theme.primaryDark,
                  }}
                  key={`group:${group}`}
                  onClick={() => {
                    socket.emit("clear_unread", group.group_hash);
                    setUnread((prev) => ({
                      ...prev,
                      [group.group_hash]: 0,
                    }));
                  }}
                >
                  <motion.div variants={item}>
                    <HStack>
                      <AvatarGroup spacing={"-12px"} size={"sm"} max={2}>
                        {group.members.map((member) => (
                          <Avatar
                            name={member}
                            // src=""
                            // border={"none"}
                            bg={theme.primaryDark}
                          />
                        ))}
                      </AvatarGroup>
                      <VStack gap={"0px"} alignItems="start">
                        <Text>{group.members.join(" ")}</Text>
                        {/* <Text>{JSON.stringify(group)}</Text> */}
                        {!messages || messages.length === 0 ? (
                          ""
                        ) : (
                          <HStack>
                            <Text
                              style={{
                                textOverflow: "ellipsis",
                              }}
                              marginTop={"-4px"}
                              color={"#888"}
                              fontSize={"15px"}
                            >
                              {messages.filter(
                                (msg) => msg.to === group.group_hash,
                              )[0]["from"] === user.userid
                                ? "You: "
                                : ""}
                              {
                                messages.filter(
                                  (msg) => msg.to === group.group_hash,
                                )[0]["content"]
                                // .slice(0, 30)
                              }
                              {/* {messages
                              .filter(
                                (msg) =>
                                  (msg.to === friend.userid ||
                                    msg.from === friend.userid) &&
                                  msg.to === user.userid,
                              )
                              .map((msg) => msg.content)
                              .find((content) => content.length >= 24)
                              ? "..."
                              : ""} */}
                            </Text>
                            {!unread[group.group_hash] ? (
                              ""
                            ) : (
                              <Box
                                bg={"red.500"}
                                height={"16px"}
                                width={"26px"}
                                borderRadius={"20px"}
                              >
                                <Text
                                  textAlign={"center"}
                                  lineHeight={"16px"}
                                  color={"#fff"}
                                  fontSize={"10px"}
                                >
                                  {unread[group.group_hash] >= 100
                                    ? "99+"
                                    : unread[group.group_hash]}
                                </Text>
                              </Box>
                            )}
                          </HStack>
                        )}
                      </VStack>
                    </HStack>
                  </motion.div>
                </HStack>
              ))}
            </motion.div>
          )}
        </VStack>
        <HStack
          style={{ flex: "1", paddingTop: "20px", marginBottom: "-22px" }}
          justify="space-evenly"
          w="100%"
          p={"20px"}
        >
          <Button
            height={"45px"}
            p={"4px 8px 4px 8px"}
            borderRadius={"10px"}
            onClick={() => {
              navigate(`/${user.username}`);
            }}
          >
            <Avatar name={user.username} bg={theme.primaryDark} size={"sm"}>
              <AvatarBadge boxSize="1em" bg="green.500" />
            </Avatar>
            <Text marginLeft={"8px"} fontSize={"16px"}>
              {user.username}
            </Text>
          </Button>
          <Button
            onClick={() => {
              navigate("/settings");
            }}
            height={"42px"}
            p={"10px"}
          >
            <Icon height={"22px"} width={"22px"} as={SettingsIcon} />
          </Button>
        </HStack>
      </VStack>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={onCreateGroupModalClose}
      />
    </>
  );
};

export default Sidebar;
