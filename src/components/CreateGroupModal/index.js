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
import TextField from "../TextField";
import { Form, Formik } from "formik";
import socket from "../../socket";
import { useState } from "react";
import { useCallback } from "react";
import { GroupsContext } from "../../pages/HomePage/";
import { useContext } from "react";
import { getThemeStyles } from "../colorTheme";
import { ThemeContext } from "../ThemeContext";
import { AsyncSelect, chakraComponents } from "chakra-react-select";
const Yup = require("yup");
const asyncComponents = {
  LoadingIndicator: (props) => (
    <chakraComponents.LoadingIndicator
      // The color of the main line which makes up the spinner
      // This could be accomplished using `chakraStyles` but it is also available as a custom prop
      color="currentColor" // <-- This default's to your theme's text color (Light mode: gray.700 | Dark mode: whiteAlpha.900)
      // The color of the remaining space that makes up the spinner
      emptyColor="transparent"
      // The `size` prop on the Chakra spinner
      // Defaults to one size smaller than the Select's size
      spinnerSize="md"
      // A CSS <time> variable (s or ms) which determines the time it takes for the spinner to make one full rotation
      speed="0.45s"
      // A CSS size string representing the thickness of the spinner's line
      thickness="2px"
      // Don't forget to forward the props!
      {...props}
    />
  ),
};
const CreateGroupModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);
  const { setGroups } = useContext(GroupsContext);
  const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader>Create a group chat</ModalHeader>
        <ModalCloseButton />
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{ groupMembers: [] }}
          validationSchema={Yup.object({
            // groupMembers: Yup.string().required("required"),
          })}
          onSubmit={(values) => {
            socket.emit(
              "create_group",
              values.groupMembers,
              ({ errorMsg, done, newGroupChat }) => {
                if (done) {
                  setGroups((g) => [newGroupChat, ...g]);
                  closeModal();
                  return;
                }
                setError(errorMsg);
              },
            );
          }}
        >
          {(formik) => (
            <Form>
              <ModalBody>
                <Heading
                  as="p"
                  color="red.300"
                  textAlign="center"
                  fontSize="sm"
                >
                  {error}
                </Heading>
                <Heading size={"sm"} marginBottom={"12px"}>
                  Enter usernames
                </Heading>
                <AsyncSelect
                  isMulti
                  onChange={(d) => {
                    let a = d.map((item) => item.username);
                    formik.values.groupMembers = a;
                  }}
                  name="groupMembers"
                  placeholder="Enter friend's username"
                  components={asyncComponents}
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
                          callback(values);
                        }
                      });
                  }}
                />
                <TextField display="none" name="groupMembers" />
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
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CreateGroupModal;
