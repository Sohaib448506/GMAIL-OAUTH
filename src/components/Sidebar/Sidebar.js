import { Button, IconButton } from "@material-ui/core";
import "./Sidebar.css";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox";
import StarIcon from "@material-ui/icons/Star";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import NearMeIcon from "@material-ui/icons/NearMe";
import NoteIcon from "@material-ui/icons/Note";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PersonIcon from "@material-ui/icons/Person";
import DuoIcon from "@material-ui/icons/Duo";
import PhoneIcon from "@material-ui/icons/Phone";
import SidebarOption from "./SidebarOption";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { openSendMessage } from "../../features/mailSlice";
import {
  profileData,
  profileSentMessages,
  profiletotalMessages,
  APIUserData,
} from "../../features/dataSlice";
import { useEffect } from "react";
import InboxIDs from "../api/InboxList";

function Sidebar() {
  const dispatch = useDispatch();
  const profileDataUpdate = useSelector(APIUserData);

  const user = useSelector(selectUser);
  const profileDataTotalUnreadMessages = profileDataUpdate.profileData;
  const TotalSentMessages = profileDataUpdate.profileSentMessages;
  const totalMessages = profileDataUpdate.profiletotalMessages;

  useEffect(() => {
    //for getting total Messages
    InboxIDs(user)
      .get(`/${user.user_id}/profile`)
      .then((res) => {
        dispatch(profiletotalMessages(res.data.messagesTotal));
      })
      .catch((error) => {
        console.error(error);
      });
    // for getting the unread messages
    InboxIDs(user)
      .get(`/${user.user_id}/labels/INBOX`)
      .then((res) => {
        dispatch(profiletotalMessages(res.data.messagesTotal));
        dispatch(profileData(res.data.messagesUnread));
      })
      .catch((error) => {
        console.error(error);
      });

    //for getting sent messages
    InboxIDs(user)
      .get(`/${user.user_id}/labels/SENT`)
      .then((res) => {
        dispatch(profileSentMessages(res.data.messagesTotal));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  return (
    <div className="sidebar">
      <Button
        className="sidebar-compose"
        onClick={() => dispatch(openSendMessage())}
        startIcon={<AddIcon fontSize="large" />}
      >
        Compose
      </Button>
      <p>Total Messages: {totalMessages} </p>
      <Link to="/" className="sidebar-link">
        <SidebarOption
          Icon={InboxIcon}
          title="Inbox"
          number={profileDataTotalUnreadMessages}
          selected={true}
        />
      </Link>
      <SidebarOption Icon={StarIcon} title="Starred" />
      <SidebarOption Icon={AccessTimeIcon} title="Snoozed" />
      <SidebarOption Icon={LabelImportantIcon} title="Important" />
      <SidebarOption
        Icon={NearMeIcon}
        title="Sent"
        number={TotalSentMessages}
      />
      <SidebarOption Icon={NoteIcon} title="Drafts" number={5} />
      <SidebarOption Icon={ExpandMoreIcon} title="More" />
      <div className="sidebar-footer">
        <div className="sidebar-footerIcons">
          <IconButton>
            <PersonIcon />
          </IconButton>
          <IconButton>
            <DuoIcon />
          </IconButton>
          <IconButton>
            <PhoneIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
