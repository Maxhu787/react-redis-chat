import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import socket from "../../socket";
import { useState, useCallback, useContext } from "react";
import { FriendContext } from "../../pages/HomePage/";
import { getThemeStyles } from "../colorTheme";
import { ThemeContext } from "../ThemeContext";
import { AsyncSelect } from "../AsyncSelect";
import * as Yup from "yup";

const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);
  const { setFriendList } = useContext(FriendContext);
  const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader>Add a friend</ModalHeader>
        <ModalCloseButton />
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{ friendName: "" }}
          validationSchema={Yup.object({
            friendName: Yup.string()
              .required("username required")
              .min(2, "invalid username")
              .max(32, "invalid username"),
          })}
          onSubmit={(values) => {
            socket.emit(
              "add_friend",
              values.friendName,
              ({ errorMsg, done, newFriend }) => {
                if (done) {
                  setFriendList((c) => [newFriend, ...c]);
                  closeModal();
                  return;
                }
                setError(errorMsg);
              },
            );
          }}
        >
          <Form>
            <ModalBody>
              <Heading as="p" color="red.300" textAlign="center" fontSize="sm">
                {error}
              </Heading>
              <Heading size={"sm"} marginBottom={"12px"}>
                Enter username
              </Heading>
              <AsyncSelect
                helper="Ask them to create one :)"
                name="friendName"
                placeholder="Enter friend's username"
                loadOptions={(inputValue, callback) => {
                  fetch(`http://localhost:4000/api/allusers`, {
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
                        const temp = res["responce"];
                        const values = temp.filter((i) =>
                          i.username
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()),
                        );
                        callback(
                          values.map((user) => ({
                            label: user.username,
                            value: user.username,
                          })),
                        );
                      }
                    });
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                bg={theme.primaryDark}
                borderRadius={"180px"}
                color={theme.lightText}
              >
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddFriendModal;
