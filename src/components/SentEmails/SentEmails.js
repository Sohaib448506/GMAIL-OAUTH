import React, { useEffect, useMemo, useState } from "react";
import InboxIDs from "../api/InboxList";
import { selectUser } from "../../features/userSlice";
import { sentEmailFetchedDone, APIUserData } from "../../features/dataSlice";
import { useSelector, useDispatch } from "react-redux";

import parseMessage from "gmail-api-parse-message";
import SingleEmailDisplaySent from "./SingleEmailDisplaySent";
const SentEmails = () => {
  const user = useSelector(selectUser);
  const [sentEmail, SetSentEmail] = useState([]);

  const [sentEmailFetched, setSentEmailFetched] = useState([]);
  const dispatch = useDispatch();
  const sentEmailsToDisplay = useSelector(APIUserData);

  useEffect(() => {
    dispatch(sentEmailFetchedDone(sentEmail));
  }, [sentEmail]);

  useEffect(() => {
    if (sentEmailFetched.length > 0) {
      sentEmailFetched.map((item) => {
        var parsedMessage = parseMessage(item);

        const condition = sentEmail.find((array) => array.id === item.id);

        if (condition) {
          return sentEmail;
        } else {
          const arr = {
            id: parsedMessage.id,
            to: parsedMessage.headers.to,
            subject: parsedMessage.headers.subject,
            description: parsedMessage.snippet,
            timestamp: parsedMessage.headers.date,
          };

          SetSentEmail((sentEmail) => [...sentEmail, arr]);
          return;
        }
      });
    }
  }, [sentEmailFetched]);

  useEffect(() => {
    InboxIDs(user)
      .get(`/${user.user_id}/messages?labelIds=SENT`)

      .then(
        function (response) {
          response.data.messages.map(async (item) => {
            await InboxIDs(user)
              .get(`/${user.user_id}/messages/${item.id}`)
              .then((res) => {
                setSentEmailFetched((sentEmailFetched) => [
                  ...sentEmailFetched,
                  res.data,
                ]);
              })
              .catch((error) => {
                console.error(error);
              });
          });
        },
        function (err) {
          console.error("Execute error", err);
        }
      );
  }, [user]);

  return (
    <>
      {" "}
      <div className="emailList-list">
        {sentEmailsToDisplay.sentEmailFetchedDisplay &&
          sentEmailsToDisplay.sentEmailFetchedDone.map(
            ({ id, to, subject, description, timestamp }) => (
              <SingleEmailDisplaySent
                key={id}
                id={id}
                to={to}
                subject={subject}
                description={description}
                timestamp={timestamp}
              />
            )
          )}
      </div>
    </>
  );
};

export default SentEmails;
