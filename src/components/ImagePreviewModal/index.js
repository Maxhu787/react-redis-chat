import {
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import { getThemeStyles } from "../colorTheme";
import { ThemeContext } from "../ThemeContext";

const ImagePreviewModal = ({ isOpen, onClose, url }) => {
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);

  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={"transparent"} boxShadow={"none"}>
        {/* <ModalCloseButton /> */}
        <ModalBody position={"relative"}>
          <Image
            borderRadius={"12px"}
            width={"100%"}
            src={url}
            alt={`uploaded image: url ${url}`}
          />
          <a
            style={{
              position: "absolute",
              right: "25px",
              color: "#fff",
              textDecoration: "underline",
            }}
            href={url}
            target="_blank"
            rel="noreferrer noopener"
          >
            view image source
          </a>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImagePreviewModal;
