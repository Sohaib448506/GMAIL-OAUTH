import React, { useMemo, useState } from "react";

import KeyboardHideIcon from "@material-ui/icons/KeyboardHide";
import SettingsIcon from "@material-ui/icons/Settings";
import InboxIcon from "@material-ui/icons/Inbox";
import PeopleIcon from "@material-ui/icons/People";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RedoIcon from "@material-ui/icons/Redo";

import { APIUserData } from "../../features/dataSlice";
import { useSelector } from "react-redux";

import Section from "../Section/Section";
import SingleEmailDisplaySent from "./SingleEmailDisplaySent";

import parseMessage from "gmail-api-parse-message";

import { Checkbox, IconButton } from "@material-ui/core";
const SentEmails = () => {
  const [sentEmail, SetSentEmail] = useState([]);
  const sentEmailsToDisplay = useSelector(APIUserData);
  const sentEmailDependencyArray = sentEmailsToDisplay.sentEmailFetchedDone;

  useMemo(() => {
    if (sentEmailDependencyArray.length > 0) {
      sentEmailDependencyArray.map((item) => {
        var parsedMessage = parseMessage(item);
        const condition = sentEmail.find((array) => array.id === item.id);
        if (condition) {
          return sentEmail;
        } else {
          ///Re structuring the API Fetched Data to pass to component to display it.
          const arr = {
            id: parsedMessage.id,
            to: parsedMessage.headers.to,
            subject: parsedMessage.headers.subject,
            description: parsedMessage.snippet,
            timestamp: parsedMessage.headers.date,
          };
          return SetSentEmail((sentEmail) => [...sentEmail, arr]);
        }
      });
    }
  }, [sentEmailDependencyArray]);

  return (
    <>
      {sentEmailsToDisplay.sentEmailFetchedDisplay && (
        <div className="emailList">
          <div className="emailList-settings">
            <div className="emailList-settingsLeft">
              <Checkbox />
              <IconButton>
                <ArrowDropDownIcon />
              </IconButton>
              <IconButton>
                <RedoIcon />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
            <div className="emailList-settingsRight">
              <IconButton>
                <KeyboardHideIcon />
              </IconButton>
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </div>
          </div>

          {sentEmailsToDisplay.sentEmailFetchedDisplay && (
            <div className="emailList-sections">
              <Section Icon={InboxIcon} title="Primary" color="red" selected />
              <Section Icon={PeopleIcon} title="Social" color="#1A73E8" />
              <Section Icon={LocalOfferIcon} title="Promotions" color="green" />
            </div>
          )}

          <div className="emailList-list">
            {sentEmailsToDisplay.sentEmailFetchedDisplay &&
              sentEmail.map(({ id, to, subject, description, timestamp }) => (
                <SingleEmailDisplaySent
                  key={id}
                  id={id}
                  to={to}
                  subject={subject}
                  description={description}
                  timestamp={timestamp}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SentEmails;
