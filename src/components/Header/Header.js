import React from "react";
import "./Header.css";

import MenuIcon from "@material-ui/icons/Menu";
import { Avatar, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import AppsIcon from "@material-ui/icons/Apps";
import NotificationsIcon from "@material-ui/icons/Notifications";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../features/userSlice";

function Header() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(logout());
  };

  return (
    <div className="header">
      <div className="header-left">
        <IconButton>
          <MenuIcon />
        </IconButton>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzRceIIBz4GgeNszaN5SupI6p1SJE_Bzgk3Q&usqp=CAU"
          alt="gmail logo"
        />
      </div>
      <div className="header-middle">
        <SearchIcon />
        <input type="text" placeholder="Search mail" />
        <ArrowDropDownIcon className="header-inputCaret" />
      </div>
      <div className="header-right">
        <IconButton>
          <HelpOutlineIcon />
        </IconButton>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton>
          <AppsIcon />
        </IconButton>
        <Avatar src={user?.photoUrl}></Avatar>
        <a
          href="#"
          onClick={signOut}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          <h4>Sign Out</h4>
        </a>
      </div>
    </div>
  );
}

export default Header;
