import React, { useEffect } from "react";
import "./Mail.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";
import EmailIcon from "@material-ui/icons/Email";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import PrintIcon from "@material-ui/icons/Print";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { selectOpenMail } from "../../features/mailSlice";
import { useSelector, useDispatch } from "react-redux";
import ForwardMessage from "../ForwardMessage/ForwardsMessage";
import {
  clickRecord,
  replyButtonClicked,
  forwardButtonClicked,
} from "../../features/dataSlice";
// import { Button } from "@material-ui/Button";
import SendReply from "../SendReply/SendReply";
import { Button } from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";

function Mail() {
  const history = useHistory();
  const selectedMail = useSelector(selectOpenMail);

  const dispatch = useDispatch();
  const messageActionUpdate = useSelector(replyButtonClicked);
  const replyMessageOpen = messageActionUpdate.payload.data.replyButtonClicked;
  const forwardButtonClickedRecord = useSelector(forwardButtonClicked);
  const forwardMessageOpen =
    forwardButtonClickedRecord.payload.data.forwardButtonClicked;
  useEffect(() => {
    document.getElementById("textHTML").innerHTML = selectedMail?.textHTML;
  }, [selectedMail]);

  return (
    <>
      <div className="mail">
        <div className="mail-tools">
          <div className="mail-toolsLeft">
            <IconButton
              onClick={() => {
                history.push("/");
                dispatch(clickRecord(false));
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <IconButton>
              <MoveToInboxIcon />
            </IconButton>

            <IconButton>
              <ErrorIcon />
            </IconButton>

            <IconButton>
              <DeleteIcon />
            </IconButton>

            <IconButton>
              <EmailIcon />
            </IconButton>

            <IconButton>
              <WatchLaterIcon />
            </IconButton>

            <IconButton>
              <CheckCircleIcon />
            </IconButton>

            <IconButton>
              <LabelImportantIcon />
            </IconButton>

            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
          <div className="mail-toolsRight">
            <IconButton>
              <UnfoldMoreIcon />
            </IconButton>

            <IconButton>
              <PrintIcon />
            </IconButton>

            <IconButton>
              <ExitToAppIcon />
            </IconButton>
          </div>
        </div>
        <div className="mail-body">
          <div className="mail-bodyHeader">
            <div className="mail-subject">
              <h2>{selectedMail?.subject}</h2>
              <LabelImportantIcon className="mail-important" />
            </div>
            <p>{selectedMail?.title}</p>
            <p className="mail-time">{selectedMail?.time}</p>
          </div>
          <div className="mail-message-button">
            {" "}
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() => {
                dispatch(replyButtonClicked(true));
              }}
            >
              Reply
            </Button>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() => {
                dispatch(forwardButtonClicked(true));
              }}
            >
              Forward
            </Button>
          </div>
          <div className="mail-message" id="textHTML">
            <p>Loading...</p>
          </div>

          {selectedMail?.attachmentId?.length > 1 && (
            <>
              <h4>This mail has attachment attached with attachment ID:</h4>
              <p>{selectedMail?.attachmentId}</p>
            </>
          )}
        </div>
      </div>
      {replyMessageOpen && <SendReply props={selectedMail} />}
      {forwardMessageOpen && <ForwardMessage props={selectedMail} />}
    </>
  );
}

export default Mail;
