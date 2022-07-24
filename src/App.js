import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Mail from "./components/Mail/Mail";
import EmailList from "./components/EmailList/EmailList";
import SendMail from "./components/SendMail/SendMail";
import { useSelector, useDispatch } from "react-redux";
import { selectSendMessageIsOpen } from "./features/mailSlice";
import { selectUser } from "./features/userSlice";
import Login from "./components/Login/Login";
import InboxIDs from "./components/api/InboxList";
import { userData, displayEmails, clickRecord } from "./features/dataSlice";

function App() {
  const sendMessageIsOpen = useSelector(selectSendMessageIsOpen);
  const user = useSelector(selectUser);
  const Emails = useSelector(displayEmails);

  const emailsToDisplay = Emails.payload.data.emailData?.emailGathered;

  const dispatch = useDispatch();

  const [emailListIDs, setEmailListIDs] = useState([]);

  const [emailGathered, setEmailGathered] = useState([]);

  useEffect(() => {
    if (user) {
      InboxIDs(user)
        .get(`/${user.user_id}/messages?labelIds=INBOX&maxResults=2`)
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

      return () => {}; //console.log("my effect is destroying");
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
            <Sidebar emails={emailsToDisplay} />
            <Switch>
              <Route path="/mail">
                <Mail />
              </Route>
              <Route path="/" exact>
                <EmailList emailGathered={emailsToDisplay} />
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
