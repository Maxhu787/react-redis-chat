import { Button, HStack, useColorModeValue, Box } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import socket from "../../socket";
import { useContext } from "react";
import { MessagesContext } from "../../pages/HomePage";
import { ThemeContext } from "../ThemeContext";
import ImageIcon from "../../assets/svg/ImageIcon";
import EmojiIcon from "../../assets/svg/EmojiIcon";
import GifIcon from "../../assets/svg/GifIcon";
import { Icon } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { getThemeStyles } from "../colorTheme";
import { AccountContext } from "../AccountContext";
import EmojiPicker from "emoji-picker-react";

const CustomInputComponent = (props) => {
  const inputRef = useRef(null);
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  const bg = useColorModeValue(theme.lightInput, theme.darkInput);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const input = inputRef.current;
      if (event.keyCode === 191) {
        if (input === document.activeElement) {
          return;
        } else {
          event.preventDefault();
          input?.focus();
          input?.select();
        }
      }
      if (event.keyCode === 27) {
        if (input === document.activeElement) {
          event.preventDefault();
          input?.blur();
          window.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        event.preventDefault();
        const { selectionStart, selectionEnd } = event.target;
        const value = event.target.value;
        event.target.value =
          value.substring(0, selectionStart) +
          "\n" +
          value.substring(selectionEnd);
        inputRef.current.selectionStart = inputRef.current.selectionEnd =
          selectionStart + 1;
        auto_grow();
      } else {
        event.preventDefault();
        // alert("submit");
        props.handleSubmit();
        inputRef.current.style.height = "48px";
        inputRef.current.style.overflowY = "hidden";
      }
    }
  };

  const auto_grow = () => {
    const element = inputRef.current;
    element.style.height = "5px";
    const newHeight = element.scrollHeight;
    const maxHeight = 144;
    if (newHeight <= maxHeight) {
      element.style.height = `${newHeight}px`;
      element.style.overflowY = "hidden";
    } else {
      element.style.height = `${maxHeight}px`;
      element.style.overflowY = "scroll";
    }
    element.scrollTop = element.scrollHeight;
  };

  return (
    <textarea
      autoFocus
      ref={inputRef}
      name="message"
      placeholder="Type in your message..."
      autoComplete="off"
      style={{
        width: "100%",
        background: bg,
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "48px",
        paddingRight: "175px",
        fontSize: "16px",
        marginBottom: "16px",
        marginTop: "12px",
        color: theme.lightText,
        borderRadius: "24px",
        resize: "none",
      }}
      rows={1}
      onInput={auto_grow}
      type="text"
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

const ChatBox = ({ userid, group_hash }) => {
  const { setMessages } = useContext(MessagesContext);
  const [selectedImages, setSelectedImages] = useState([]);
  const { currentTheme } = useContext(ThemeContext);
  const { user } = useContext(AccountContext);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const theme = getThemeStyles(currentTheme);
  const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Formik
      initialValues={{ message: "" }}
      validationSchema={Yup.object({
        // message: Yup.string().required().min(1).max(255),
        message: Yup.string().max(255),
      })}
      onSubmit={(values, actions) => {
        if (
          typeof selectedImages !== "undefined" &&
          selectedImages.length > 0
        ) {
          const formData = new FormData();
          formData.append("image", selectedImages[0]);
          formData.append("key", "fd525ba7f3ea9ce40bd821260794880e");
          // fetch("http://localhost:4000/image", {
          fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response not ok");
              }
              return response.json();
            })
            .then((data) => {
              let msgTo = "";
              let type = "";
              if (userid !== null) {
                msgTo = userid;
                type = "dm";
              } else {
                msgTo = group_hash;
                type = "gc";
              }
              const content = values.message;
              if (content == null || content.trim() === "") {
                const message = {
                  to: msgTo,
                  from: user.userid,
                  content: data["data"]["url"],
                  type: type,
                };
                socket.emit("dm", message);
                setMessages((messages) => [message, ...messages]);
              } else {
                const message = {
                  to: msgTo,
                  from: user.userid,
                  content: content.concat(" ", data["data"]["url"]),
                  type: type,
                };
                socket.emit("dm", message);
                setMessages((messages) => [message, ...messages]);
              }
              actions.resetForm();
            })
            .catch((error) => {
              console.error("Error uploading image:", error);
            });
          setSelectedImages([]);
        } else {
          let msgTo = "";
          let type = "";
          if (userid !== null) {
            msgTo = userid;
            type = "dm";
          } else {
            msgTo = group_hash;
            type = "gc";
          }
          const message = {
            to: msgTo,
            from: user.userid,
            content: values.message,
            type: type,
          };
          if (message.content == null || message.content.trim() === "") {
          } else {
            socket.emit("dm", message);
            setMessages((messages) => [message, ...messages]);
          }
          actions.resetForm();
        }
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <HStack
          position={"relative"}
          bg={bg}
          className="chat-box"
          as={Form}
          w="100%"
          px="1.4rem"
          display={"inline-block"}
        >
          {typeof selectedImages !== "undefined" &&
            selectedImages.length > 0 && (
              <div
                className="image-preview-container"
                style={{ background: bg }}
              >
                {selectedImages.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img
                      alt="not found"
                      src={URL.createObjectURL(image)}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      onClick={() => handleRemoveImage(index)}
                      backgroundColor={theme.primaryDark}
                      color={theme.lightText}
                      w={"80px"}
                      fontWeight={400}
                      fontSize={"14px"}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          <Box ref={emojiPickerRef}>
            <EmojiPicker
              style={{ position: "absolute", bottom: "75px" }}
              // defaultSkinTone={"neutral"}
              defaultSkinTone={"1f3fb"}
              skinTonesDisabled={true}
              emojiStyle={"google"}
              // emojiStyle={"native"}
              theme={useColorModeValue("light", "dark")}
              onEmojiClick={(data) => {
                setFieldValue("message", values["message"] + data["emoji"]);
                setShowEmojiPicker(false);
              }}
              autoFocusSearch={true}
              open={showEmojiPicker}
              // suggestedEmojisMode={"recent"}
            />
          </Box>
          <label>
            <Button
              p={"0px"}
              bg={"transparent"}
              onClick={() => {
                showEmojiPicker
                  ? setShowEmojiPicker(false)
                  : setShowEmojiPicker(true);
              }}
              _hover={{ bg: "transparent" }}
              _active={{ opacity: 0.5 }}
              id="emoji-icon-container"
            >
              <Icon
                id="emoji-icon"
                color={showEmojiPicker ? theme.primaryDark : theme.lightText}
                as={EmojiIcon}
              />
            </Button>
          </label>
          <label htmlFor="image-upload">
            <input
              id="image-upload"
              name="image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <Icon
              id="image-icon"
              color={theme.lightText}
              className="image-icon"
              as={ImageIcon}
            />
          </label>
          <label>
            <Button
              p={"0px"}
              bg={"transparent"}
              _hover={{ bg: "transparent" }}
              _active={{ opacity: 0.5 }}
              id="gif-icon-container"
            >
              <Icon id="gif-icon" color={theme.lightText} as={GifIcon} />
            </Button>
          </label>
          <Field
            name="message"
            handleSubmit={() => handleSubmit()}
            as={CustomInputComponent}
          />
          <Button
            type="submit"
            bg={theme.primaryDark}
            borderRadius={"180px"}
            position={"absolute"}
            right={"26px"}
            top={"16px"}
            height={"40px"}
            color={theme.lightText}
            _hover={{ bg: theme.primaryLight }}
            _active={{ opacity: 0.5 }}
          >
            Send
          </Button>
        </HStack>
      )}
    </Formik>
  );
};

export default ChatBox;
