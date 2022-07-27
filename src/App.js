import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import { useSelector, useDispatch } from "react-redux";
import { selectSendMessageIsOpen } from "./features/mailSlice";
import { selectUser } from "./features/userSlice";
import {
  userData,
  displayEmails,
  sentEmailFetchedDone,
} from "./features/dataSlice";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import EmailList from "./components/EmailList/EmailList";
import SendMail from "./components/SendMail/SendMail";
import Login from "./components/Login/Login";
import InboxIDs from "./components/api/InboxList";
import SentEmails from "./components/SentEmails/SentEmails";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const sendMessageIsOpen = useSelector(selectSendMessageIsOpen);

  const [emailListIDs, setEmailListIDs] = useState([]);
  const [emailGathered, setEmailGathered] = useState([]);
  const [sentEmailFetched, setSentEmailFetched] = useState([]);

  useEffect(() => {
    dispatch(sentEmailFetchedDone(sentEmailFetched));
  }, [sentEmailFetched]);

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      InboxIDs(user)
        .get(
          `/${user.user_id}/messages?labelIds=INBOX&maxResults=2&q=category%3Aprimary`
        )
        .then((res) => {
          dispatch(userData(res.data));
          setEmailListIDs(res.data.messages);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (emailListIDs.length > 0) {
      emailListIDs.map((Emailid) =>
        InboxIDs(user)
          .get(`/${user.user_id}/messages/${Emailid.id}`)
          .then((res) => {
            const setting = res.data;
            setEmailGathered((emailGathered) => [...emailGathered, setting]);
          })
          .catch((error) => {
            console.error(error);
          })
      );

      return () => {};
    }
  }, [emailListIDs]);
  useEffect(() => {
    dispatch(displayEmails({ emailGathered }));
  }, [emailGathered]);
  return (
    <Router>
      {!user ? (
        <Login />
      ) : (
        <div className="app">
          <Header />
          <div className="app-body">
            <Sidebar />
            <SentEmails />
            <Switch>
              <Route path="/" exact>
                <EmailList />
              </Route>
            </Switch>
          </div>

          {sendMessageIsOpen && <SendMail />}
        </div>
      )}
    </Router>
  );
}

export default App;
