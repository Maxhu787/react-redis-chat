import {
  TabPanel,
  TabPanels,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Container,
  Button,
  Box,
  Link,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  FriendContext,
  GroupsContext,
  MessagesContext,
} from "../../pages/HomePage";
import { ThemeContext } from "../ThemeContext";
import ChatBox from "../ChatBox";
import { getThemeStyles } from "../../components/colorTheme";
import { motion } from "framer-motion";
import { AccountContext } from "../AccountContext";
import ImagePreviewModal from "../ImagePreviewModal";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
// import testImageSrc from "../../assets/images/menu-bg.jpg";
import "./styles.scss";

const Chat = ({ userid, group_hash, tabIndex }) => {
  const { friendList } = useContext(FriendContext);
  const { groups } = useContext(GroupsContext);
  const { messages } = useContext(MessagesContext);
  const { currentTheme } = useContext(ThemeContext);
  const { user } = useContext(AccountContext);
  const [data, setData] = useState({});
  const [imagePreviewURL, setImagePreviewURL] = useState("");
  const theme = getThemeStyles(currentTheme);
  const bottomDiv = useRef(null);
  const {
    isOpen: isImagePreviewModalOpen,
    onOpen: onImagePreviewModalOpen,
    onClose: onImagePreviewModalClose,
  } = useDisclosure();
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
  const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);
  const bgSecondary = useColorModeValue(
    theme.secondaryLightBackground,
    theme.secondaryDarkBackground,
  );
  const borderColor = useColorModeValue(theme.lightBorder, theme.darkBorder);
  useEffect(() => {
    const ele = document.querySelector("#test");
    if (ele) ele.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    bottomDiv.current?.scrollIntoView({ behavior: "smooth" });
    // essential or else the other tabs when sending message wont scroll
  }, [messages, friendList]);

  useEffect(() => {
    const ele = document.querySelector("#test");
    if (ele) ele.scrollIntoView();
  }, [tabIndex]);

  const getUserData = (userid) => {
    if (userid in data) {
      // console.log("username" in data[userid]);
      // console.log("1");
      return JSON.stringify(data[userid]["username"]).slice(1, -1);
    } else {
      fetch(`http://localhost:4000/api/userid/${userid}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        .then((res) => {
          if (res["responce"] === false) {
            alert("err");
            return err;
          } else {
            setData((prevState) => ({
              ...prevState,
              [userid]: res["responce"],
            }));
            // return JSON.stringify(data[userid]);
          }
        });
    }
  };

  const renderMessageTextWithImages = (text) => {
    const imageUrlRegex = /(https?:\/\/\S+\.(?:gif|png|jpe?g|webp))/gi;
    const textParts = text.split(imageUrlRegex);
    return textParts.map((part, index) => {
      if (part.match(imageUrlRegex)) {
        return (
          <button
            onClick={() => {
              setImagePreviewURL(part);
              onImagePreviewModalOpen();
            }}
          >
            <img
              style={{
                borderRadius: "12px",
                marginTop: "5px",
                maxHeight: "450px",
                overflow: "scroll",
              }}
              key={index}
              src={part}
              alt="Uploaded"
            />
          </button>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  const renderMessageTextWithMention = (text) => {
    const regex = /@(\w+)/gi;
    const match = text.match(regex);

    if (regex.test(text)) {
      if (match.includes(`@${user.username}`)) {
        return (
          <span
            style={{
              color: theme.textHighlight,
            }}
          >
            {text}
          </span>
        );
      } else {
        return <span style={{ color: "#fff" }}>{text}</span>;
      }
    } else {
      return text;
    }
  };

  return friendList.length > 0 ? (
    <VStack
      className="chat-component"
      bg={bg}
      spacing={0}
      h="100%"
      justify="end"
    >
      <ImagePreviewModal
        isOpen={isImagePreviewModalOpen}
        onClose={onImagePreviewModalClose}
        url={imagePreviewURL}
      />
      <HStack
        fontSize="lg"
        padding={"12px"}
        bg={bgSecondary}
        // borderBottom="1px solid"
        // borderColor={borderColor}
        justify="left"
        w="100%"
      >
        <Text marginLeft={"12px"} size="sm">
          Chat
        </Text>
      </HStack>
      <TabPanels h={"100%"} overflowY="scroll">
        {friendList.map((friend) => (
          <VStack
            bg={bg}
            // style={{
            // backgroundImage: `url(${testImageSrc})`,
            // backgroundSize: "cover",
            // backgroundAttachment: "fixed",
            // }}
            flexDir="column"
            as={TabPanel}
            key={`chat:${friend.username}`}
          >
            {messages.length == 0 ? (
              <>
                <Text color={"#888"}>No messages sent yet</Text>
                <Text color={"#888"}>try sending some!</Text>
              </>
            ) : (
              <Text color={"#888"} marginBottom={"8px"}>
                You've reached the top!
              </Text>
            )}
            {messages
              .filter(
                (msg) =>
                  msg.to === friend.userid ||
                  (msg.from === friend.userid && msg.to === user.userid),
              )
              .toReversed()
              .map((message, index, arr) => {
                const previousMessage = arr[index + 1];
                const nextMessage = arr[index - 1];
                const messageStyle =
                  message.to !== friend.userid
                    ? !previousMessage || previousMessage.to === friend.userid
                      ? "messageReceiveFirst"
                      : !nextMessage || nextMessage.to === friend.userid
                        ? "messageReceiveLast"
                        : "messageReceive"
                    : !previousMessage || previousMessage.to !== friend.userid
                      ? "messageSentFirst"
                      : !nextMessage || nextMessage.to !== friend.userid
                        ? "messageSentLast"
                        : "messageSent";
                return (
                  <Text
                    className="message"
                    key={`msg:${friend.username}.${index}`}
                    maxW="30vw"
                    // maxW={"50%"}
                    fontSize="15px"
                    as={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ overflowWrap: "break-word" }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    bg={
                      message.to === friend.userid
                        ? messageSentBg
                        : messageReceiveBg
                    }
                    color={
                      message.to === friend.userid
                        ? messageSentColor
                        : messageReceiveColor
                    }
                    borderRadius="18px"
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
                      message.to === friend.userid
                        ? "0 0 0px auto !important"
                        : "0 auto 0 0 !important"
                    }
                  >
                    {/* {renderMessageTextWithMention(message.content)} */}
                    {renderMessageTextWithImages(message.content)}
                  </Text>
                );
              })}
            <div id="test" ref={bottomDiv} />
          </VStack>
        ))}
        {groups.map((group) => (
          <VStack
            bg={bg}
            flexDir="column"
            as={TabPanel}
            key={`group:${group.group_hash}`}
          >
            {messages.length == 0 ? (
              <>
                <Text color={"#888"}>No messages sent yet</Text>
                <Text color={"#888"}>try sending some!</Text>
              </>
            ) : (
              <Text color={"#888"} marginBottom={"8px"}>
                You've reached the top!
              </Text>
            )}
            {/* <Text>{group_hash}</Text> */}
            {/* <Text>group_hash {group.group_hash}</Text> */}
            {/* <Text>{group.members.join(" ")}</Text> */}
            {messages
              .filter((msg) => msg.to === group.group_hash)
              .toReversed()
              .map((message, index, arr) => {
                const previousMessage = arr[index + 1];
                const nextMessage = arr[index - 1];
                const messageStyle =
                  message.from !== user.userid
                    ? !previousMessage || previousMessage.from === user.userid
                      ? "messageReceiveFirst"
                      : !nextMessage || nextMessage.from === user.userid
                        ? "messageReceiveLast"
                        : "messageReceive"
                    : !previousMessage || previousMessage.from !== user.userid
                      ? "messageSentFirst"
                      : !nextMessage || nextMessage.from !== user.userid
                        ? "messageSentLast"
                        : "messageSent";
                return (
                  <HStack
                    key={`msg:${group_hash}.${index}`}
                    m={
                      message.from === user.userid
                        ? "0 0 0px auto !important"
                        : "0 auto 0 0 !important"
                    }
                    maxW="30vw"
                  >
                    {message.from !== user.userid ? (
                      <Link
                        as={ReactRouterLink}
                        to={`/${getUserData(message.from)}`}
                      >
                        <Avatar
                          size={"sm"}
                          bg={theme.primaryLight}
                          name={getUserData(message.from)}
                          // name={`${getUserData(message.from).slice(0, 1)} ${getUserData(message.from).slice(-1)}`}
                        ></Avatar>
                      </Link>
                    ) : (
                      ""
                    )}
                    <VStack position={"relative"}>
                      {/* <Text
                        position={"absolute"}
                        right={"-26px"}
                        bottom={"0px"}
                        fontSize={"10px"}
                        color={theme.primaryDark}
                      >
                        {message.from === user.userid
                          ? ""
                          : getUserData(message.from)}
                      </Text> */}
                      <Text
                        maxW="30vw"
                        fontSize="15px"
                        as={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ overflowWrap: "break-word" }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        bg={
                          message.from === user.userid
                            ? messageSentBg
                            : messageReceiveBg
                        }
                        color={
                          message.from === user.userid
                            ? messageSentColor
                            : messageReceiveColor
                        }
                        borderRadius="18px"
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
                      >
                        {/* {JSON.stringify(group.members)} */}
                        {/* {getUserData(message.from)}{" "} */}
                        {/* {JSON.stringify(getUserData(message.from))}{" "} */}
                        {/* {renderMessageTextWithMention(message.content)} */}
                        {renderMessageTextWithImages(message.content)}
                      </Text>
                    </VStack>
                  </HStack>
                );
              })}
            <div id="test" ref={bottomDiv} />
            {/* <Text>{JSON.stringify(data)}</Text> */}
          </VStack>
        ))}
      </TabPanels>
      <ChatBox userid={userid} group_hash={group_hash} />
    </VStack>
  ) : (
    <VStack
      justify="center"
      pt="5rem"
      w="100%"
      textAlign="center"
      fontSize="lg"
    >
      <TabPanels>
        <TabPanel>
          <Text>No Friends. Click add friend to start chatting.</Text>
        </TabPanel>
      </TabPanels>
    </VStack>
  );
};

export default Chat;
