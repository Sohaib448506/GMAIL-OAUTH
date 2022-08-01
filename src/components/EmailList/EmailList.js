import React, { useState, useMemo, useEffect } from "react";
import "./EmailList.css";

import { Checkbox, IconButton } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RedoIcon from "@material-ui/icons/Redo";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardHideIcon from "@material-ui/icons/KeyboardHide";
import SettingsIcon from "@material-ui/icons/Settings";
import InboxIcon from "@material-ui/icons/Inbox";
import PeopleIcon from "@material-ui/icons/People";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";

import { APIUserData, userData, displayEmails } from "../../features/dataSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";

import InboxIDs from "../../components/api/InboxList";
import Section from "../Section/Section";
import EmailRow from "../EmailRow/EmailRow";

import parseMessage from "gmail-api-parse-message";

function EmailList() {
  const userDependency = useSelector(selectUser);

  const [user, setUser] = useState();
  const data = useSelector(APIUserData);

  const emailGathered = data.emailData?.emailGathered;
  const totalMessagesOfInbox = data.profiletotalInboxMessages;

  const dispatch = useDispatch();

  const [nextPageIcon, setNextPageIcon] = useState(false);
  const [prevPageIcon, setPrevPageIcon] = useState(true);
  const [resultLoaded, setResultLoaded] = useState(2);

  const [newEmailListIDs, setNewEmailListIDs] = useState([]);
  const [newEmailGathered, setNewEmailGathered] = useState([]);
  const [preArray, setPreArray] = useState([]);
  const [emailGatheredDestructurying, setEmailGatheredDestructurying] =
    useState([]);

  var nextPageToken = data.data?.nextPageToken;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, [userDependency]);
  useMemo(() => {
    {
      if (emailGathered) {
        emailGathered.map((item) => {
          var parsedMessage = parseMessage(item); //To get the attachments, HTML and Plain TExt of the body

          if (parsedMessage.attachments) {
            const attachments = parsedMessage.attachments;
            var attachmentId;
            if (attachments.length > 1) {
              let array = [];
              const gathered = attachments.map((x) => {
                array = [...array, x.attachmentId];
                return array;
              });
              attachmentId = gathered;
            } else attachmentId = parsedMessage.attachments[0].attachmentId;
          } else {
            attachmentId = "";
          }

          const textHTML = parsedMessage.textHtml;

          const id = item.id;
          const message = item.snippet;

          const to2 = item.payload.headers.find((header) => {
            if (header.name === "From") {
              return header.value;
            }
          });
          const subject2 = item.payload.headers.find((header) => {
            if (header.name === "Subject") {
              if (header.value.length > 0) return header.value;
              else return "Subject is not defined";
            }
          });

          const date2 = item.payload.headers.find((header) => {
            if (header.name === "Date") {
              return header.value;
            }
          });
          const unread2 = item.labelIds.indexOf("UNREAD");
          let label;
          if (unread2 === -1) {
            label = false;
          } else label = true;
          const arr = {
            id,
            data: {
              to: to2.value,
              subject: subject2.value,
              description: message,
              timestamp: date2.value,
            },
            label,
            attachmentId,
            textHTML,
          };
          if (emailGatheredDestructurying.length === 0) {
            setEmailGatheredDestructurying((pre) => [...pre, arr]);
          }
          if (emailGatheredDestructurying.length > 0) {
            const condition = emailGatheredDestructurying.find(
              (x) => x.id === arr.id
            );
            if (condition) {
              setEmailGatheredDestructurying((pre) => [...pre]);
            } else {
              setEmailGatheredDestructurying((pre) => [...pre, arr]);
            }
          }
        });
      }
    }
  }, [emailGathered]);

  const nextPage = () => {
    const difference = totalMessagesOfInbox - 2 - resultLoaded;

    if (difference < 1) {
      setNextPageIcon(true);
    } else {
      setNextPageIcon(false);
      setPrevPageIcon(false);
    }
    if (resultLoaded <= totalMessagesOfInbox) {
      if (totalMessagesOfInbox - resultLoaded - 2 > 0) {
        setPreArray((pre) => [...pre, nextPageToken]);
      }
      setResultLoaded((x) => x + 2);

      InboxIDs(user)
        .get(
          `/${user.user_id}/messages?labelIds=INBOX&maxResults=2&pageToken=${nextPageToken}`
        )
        .then((res) => {
          {
            setEmailGatheredDestructurying([]);
            dispatch(userData(res.data));
            setNewEmailListIDs(res.data.messages);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const prevPage = () => {
    setNextPageIcon(false);
    const preArraylength = preArray.length;

    if (preArraylength > 0) {
      const prevPageToken = preArray.pop(); //Just for next use
      setResultLoaded((x) => x - 2);

      prePageApIData(prevPageToken);
    } else {
      setPrevPageIcon(true);
      preArray.pop();
      setResultLoaded((x) => x - 2);
      InboxIDs(user)
        .get(`/${user.user_id}/messages?labelIds=INBOX&maxResults=2&pageToken`)
        .then((res) => {
          {
            setEmailGatheredDestructurying([]);
            dispatch(userData(res.data));
            setNewEmailListIDs(res.data.messages);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const prePageApIData = (token) => {
    InboxIDs(user)
      .get(
        `/${user.user_id}/messages?labelIds=INBOX&maxResults=2&pageToken=${token}`
      )
      .then((res) => {
        {
          setEmailGatheredDestructurying([]);
          dispatch(userData(res.data));
          setNewEmailListIDs(res.data.messages);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    setNewEmailGathered([]);
    if (newEmailListIDs.length > 0) {
      newEmailListIDs.map((Emailid) =>
        InboxIDs(user)
          .get(`/${user.user_id}/messages/${Emailid.id}`)
          .then((res) => {
            const setting = res.data;

            setNewEmailGathered((newEmailGathered) => [
              ...newEmailGathered,
              setting,
            ]);
          })
          .catch((error) => {
            console.error(error);
          })
      );

      return () => {}; //console.log("my effect is destroying")};
    }
  }, [newEmailListIDs]);
  useEffect(() => {
    {
      const emailGathered = newEmailGathered;
      dispatch(displayEmails({ emailGathered }));
    }
  }, [newEmailGathered]);

  return (
    <>
      {!data.displaySingleMessage && !data.sentEmailFetchedDisplay && (
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
              <IconButton
                onClick={() => {
                  prevPage();
                }}
                disabled={prevPageIcon}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  nextPage();
                }}
                disabled={nextPageIcon}
              >
                <ChevronRightIcon />
              </IconButton>
              <IconButton>
                <KeyboardHideIcon />
              </IconButton>
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </div>
          </div>

          {data.displayList && (
            <div className="emailList-sections">
              <Section Icon={InboxIcon} title="Primary" color="red" selected />
              <Section Icon={PeopleIcon} title="Social" color="#1A73E8" />
              <Section Icon={LocalOfferIcon} title="Promotions" color="green" />
            </div>
          )}

          <div className="emailList-list">
            {emailGatheredDestructurying.map(
              ({
                id,
                data: { to, subject, description, timestamp },
                label,
                attachmentId,
                textHTML,
              }) => (
                <EmailRow
                  id={id}
                  key={id}
                  title={to}
                  subject={subject}
                  description={description}
                  time={timestamp}
                  label={label}
                  attachmentId={attachmentId}
                  textHTML={textHTML}
                />
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EmailList;
