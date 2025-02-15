import {
  Text,
  useColorModeValue,
  HStack,
  VStack,
  Divider,
  IconButton,
  Avatar,
  Button,
  Link,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import { getThemeStyles } from "../../components/colorTheme";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Link as ReactRouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";
// import { motion } from "framer-motion";

const ProfilePage = () => {
  const { currentTheme } = useContext(ThemeContext);
  const theme = getThemeStyles(currentTheme);
  const navigate = useNavigate();
  const bg = useColorModeValue(theme.lightBackground, theme.darkBackground);
  const bgSecondary = useColorModeValue(
    theme.secondaryLightBackground,
    theme.secondaryDarkBackground,
  );
  const borderColor = useColorModeValue(theme.lightBorder, theme.darkBorder);
  const { username } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:4000/api/user/${username}`, {
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
      .then((data) => {
        setData(data);
        if (data["responce"] === false) {
          setError(true);
        }
      });
  }, [username]);
  return !error ? (
    <VStack
      bg={bgSecondary}
      h={"100vh"}
      borderRadius={"12px"}
      className="profile-page"
      position={"relative"}
    >
      <IconButton
        onClick={() => {
          navigate("/home");
        }}
        position={"absolute"}
        top={"12px"}
        left={"16px"}
        bg={theme.primaryDark}
        aria-label="Search database"
        borderRadius={"30px"}
        icon={<ArrowBackIcon />}
      />
      <HStack w={"100%"} p={"40px 40px 0px 80px"}>
        <Avatar
          height={"180px"}
          width={"180px"}
          name={username}
          size={"2xl"}
          bg={theme.primaryDark}
          marginLeft={"20px"}
        />
        <VStack marginLeft={"20px"} alignItems="start" p={"30px"}>
          <Text fontSize={"30px"}>{username}</Text>
          {/* <Text fontSize={"18px"}>A 15-year-old from Taiwan 🇹🇼</Text> */}
          <Text fontSize={"18px"}>
            {data
              ? data["responce"][0]["bio"]
                ? data["responce"][0]["bio"]
                : "no bio added"
              : ""}
          </Text>
          <Button
            borderRadius={"12px"}
            backgroundColor={theme.primaryDark}
            color={theme.lightText}
            mt={"20px"}
            p={"12px"}
            fontSize={"14px"}
            _hover={{ bg: theme.primaryLight, cursor: "pointer" }}
            _active={{ bg: "#777", cursor: "pointer" }}
          >
            Add Friend
          </Button>
        </VStack>
      </HStack>
      <Divider />
      <VStack>
        <Text>{JSON.stringify(data)}</Text>
        <Text>hi</Text>
      </VStack>
    </VStack>
  ) : (
    <VStack
      bg={bg}
      h={"100vh"}
      borderRadius={"12px"}
      // p={"20px"}
      className="profile-page"
    >
      <HStack w={"100%"} p={"40px 40px 0px 40px"}>
        <IconButton
          onClick={() => {
            navigate("/home");
          }}
          bg={theme.primaryDark}
          aria-label="Search database"
          borderRadius={"30px"}
          icon={<ArrowBackIcon />}
        />
      </HStack>
      <VStack>
        {/* <Text>{JSON.stringify(data)}</Text> */}
        <Text fontSize={"28px"}>
          The page you were looking for doesn't seem to exist
        </Text>
        <Divider />
        <Link
          color={theme.primaryDark}
          fontSize={"24px"}
          as={ReactRouterLink}
          to={`/`}
        >
          Back to home
        </Link>
      </VStack>
    </VStack>
  );
};

export default ProfilePage;
