import { useContext, useEffect } from "react";
import socket from "../../socket";
import { AccountContext } from "../../components/AccountContext";

const useSocketSetup = async (
  setFriendList,
  setMessages,
  setGroups,
  setUnread,
) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("friends", (friendList) => {
      setFriendList(friendList);
    });
    socket.on("groups", (groupList) => {
      setGroups(groupList);
    });
    socket.on("messages", (messages) => {
      setMessages(messages);
    });
    socket.on("unread", (unreadList) => {
      setUnread(unreadList);
    });
    socket.on("dm", ({ message, from }) => {
      setMessages((prevMsgs) => [message, ...prevMsgs]);
      setUnread((prev) => ({
        ...prev,
        [from]: (parseInt(prev[from]) || 0) + 1,
      }));
    });
    socket.on("connected", (status, username) => {
      setFriendList((prevFriends) => {
        return [...prevFriends].map((friend) => {
          if (friend.username === username) {
            friend.connected = status;
          }
          return friend;
        });
      });
    });
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });
    return () => {
      socket.off("connect_error");
      socket.off("connected");
      socket.off("friends");
      socket.off("messages");
      socket.off("dm");
    };
  }, [setUser, setFriendList, setMessages]);
};

export default useSocketSetup;
