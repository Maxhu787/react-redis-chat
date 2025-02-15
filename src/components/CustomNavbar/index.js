import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar, Nav } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import CogIcon from "@rsuite/icons/legacy/Cog";
import SignOut from "@rsuite/icons/legacy/SignOut";
import profileImage from "../../assets/images/user3.png";
import "./styles.scss";
import UserCircleO from "@rsuite/icons/legacy/UserCircleO";

const CustomNavbar = ({ logout, ...props }) => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    switch (activeKey) {
      case "1":
        navigate("/home");
        break;
      case "2":
        navigate("/chat");
        break;
      default:
        break;
    }
  }, [activeKey, navigate, logout]);

  return (
    <Navbar {...props} className="nav-bar">
      <Navbar.Brand href="https://maxhu787.github.io" target="_blank">
        TCSN
      </Navbar.Brand>
      <Nav onSelect={setActiveKey} activeKey={activeKey}>
        <Nav.Item eventKey="1" icon={<HomeIcon />}>
          Home
        </Nav.Item>
        <Nav.Item eventKey="2">Chat</Nav.Item>
        <Nav.Item eventKey="3">Users</Nav.Item>
        <Nav.Menu title="About">
          <Nav.Item eventKey="4">Company</Nav.Item>
          <Nav.Item eventKey="5">Team</Nav.Item>
          <Nav.Item eventKey="6">Contact</Nav.Item>
          <Nav.Item eventKey="7">Credits</Nav.Item>
        </Nav.Menu>
      </Nav>
      <Nav pullRight>
        <Nav.Menu
          icon={<img src={profileImage} alt="User" />}
          title={props.username}
        >
          <Nav.Item
            style={{ width: "150px" }}
            eventKey="8"
            icon={<UserCircleO />}
          >
            Profile
          </Nav.Item>
          <Nav.Item style={{ width: "150px" }} eventKey="9" icon={<CogIcon />}>
            Settings
          </Nav.Item>
          <Nav.Item
            style={{ width: "150px" }}
            eventKey="10"
            onClick={() => logout()}
            icon={<SignOut />}
          >
            Logout
          </Nav.Item>
        </Nav.Menu>
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
