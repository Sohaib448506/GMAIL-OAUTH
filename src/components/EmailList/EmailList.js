import { Checkbox, IconButton } from "@material-ui/core";
import React, { useState, useMemo, useEffect } from "react";
import "./EmailList.css";
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
import Section from "../Section/Section";
import EmailRow from "../EmailRow/EmailRow";
import { selectUser } from "../../features/userSlice";
import parseMessage from "gmail-api-parse-message";

import { APIUserData, userData, displayEmails } from "../../features/dataSlice";
import { useSelector, useDispatch } from "react-redux";
import InboxIDs from "../../components/api/InboxList";

function EmailList({ emailGathered }) {
  const [emailGatheredDestructurying, setEmailGatheredDestructurying] =
    useState([]);

  const user = useSelector(selectUser);
  const data = useSelector(APIUserData);

  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [nextPageIcon, setNextPageIcon] = useState(false);
  const [prevPageIcon, setPrevPageIcon] = useState(true);

  var nextPageToken = data.data?.nextPageToken;

  const [newEmailListIDs, setNewEmailListIDs] = useState([]);
  const [newEmailGathered, setNewEmailGathered] = useState([]);
  const [preArray, setPreArray] = useState([]);

  useMemo(() => {
    {
      if (emailGathered) {
        emailGathered.map((item) => {
          // const getHTMLPart = (arr) => {
          //   for (var x = 0; x <= arr.length; x++) {
          //     if (typeof arr[x].parts === "undefined") {
          //       if (arr[x].mimeType === "text/html") {
          //         return arr[x].body.data;
          //       }
          //     } else {
          //       return getHTMLPart(arr[x].parts);
          //     }
          //   }
          //   return "";
          // };
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
            var attachmentId = "";
          }

          const textHTML = parsedMessage.textHtml;

          // console.log(
          //   "Parsed message",
          //   typeof parsedMessage.textHtml.replace(/(?:\\[rn])+/g, "")
          // );

          //  document.getElementById("sohaib").innerHTML = parsedMessage.textHtml;
          // // console.log(
          //   "Parsed message",
          //   parsedMessage.textPlain.replace(/(?:\\[rn])+/g, "")
          // );
          // const getMessageBody = (item) => {
          //   var encodedBody = "";
          //   if (typeof item.payload?.parts === "undefined") {
          //     encodedBody = item.payload.body.data;
          //   } else {
          //     encodedBody = getHTMLPart(item.payload.parts);
          //   }

          //   return window.atob(encodedBody);
          // };

          // var part = item.payload.parts.filter(function (part) {
          //   return part.mimeType == "text/html";
          // });

          // var html = escape(atob(part[0]?.body?.data));
          // var text = html.replace(/<\/?[^>]+>/gi, " ");

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
    if (nextPageToken) {
      InboxIDs(user)
        .get(
          `/${user.user_id}/messages?labelIds=INBOX&maxResults=2&pageToken=${nextPageToken}`
        )
        .then((res) => {
          if (!res.data.nextPageToken) {
            setNextPageIcon(true);
          }
          setPrevPageIcon(false);

          if (res.data?.resultSizeEstimate > 0) {
            setPreArray((pre) => [...pre, nextPageToken]);
            setEmailGatheredDestructurying([]);
            dispatch(userData(res.data));
            setNewEmailListIDs(res.data.messages);
          } else setNextPageIcon(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const prevPage = () => {
    const preArraylength = preArray.length;

    if (preArraylength > 0) {
      const thisPageToken = preArray.pop(); //Just for next use
      nextPageToken = preArray.pop();
      prePageApIData(nextPageToken);
      setNextPageIcon(false);
    }
    if (preArraylength === 0) {
      setPrevPageIcon(true);
      InboxIDs(user)
        .get(`/${user.user_id}/messages?labelIds=INBOX&maxResults=2&pageToken`)
        .then((res) => {
          // if (!res.data.nextPageToken) {
          //   setNextPageIcon(true);
          // }

          if (res.data?.resultSizeEstimate > 0) {
            // setPreArray((pre) => [...pre, nextPageToken]);
            setEmailGatheredDestructurying([]);
            dispatch(userData(res.data));
            setNewEmailListIDs(res.data.messages);
          }
          //  else setNextPageIcon(true);
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
        if (res.data?.resultSizeEstimate > 0) {
          // setPreArray((pre) => [...pre, nextPageToken]);
          setEmailGatheredDestructurying([]);
          dispatch(userData(res.data));
          setNewEmailListIDs(res.data.messages);
        }
        //  else setNextPageIcon(true);
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
    if (load) {
      const emailGathered = newEmailGathered;
      dispatch(displayEmails({ emailGathered }));
    }
  }, [newEmailGathered]);

  return (
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
              setLoad(true);
            }}
            disabled={prevPageIcon}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setLoad(true);
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
      <div className="emailList-sections">
        <Section Icon={InboxIcon} title="Primary" color="red" selected />
        <Section Icon={PeopleIcon} title="Social" color="#1A73E8" />
        <Section Icon={LocalOfferIcon} title="Promotions" color="green" />
      </div>

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

        {/* {emails.map(({ id, data: { to, subject, message, timestamp } }) => (
          <EmailRow
            id={id}
            key={id}
            title={to}
            subject={subject}
            description={message}
            time={new Date(timestamp?.seconds * 1000).toUTCString()}
          />
        ))} */}
        {/* <EmailRow
          title="Twitch"
          subject="Hey fellow streamer!!"
          description="This is a DOPE"
          time="10pm"
        /> */}
      </div>
    </div>
  );
}

export default EmailList;
