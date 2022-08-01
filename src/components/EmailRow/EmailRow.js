import React from "react";
import "./EmailRow.css";

import { Checkbox, IconButton } from "@material-ui/core";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import LabelImportantOutlinedIcon from "@material-ui/icons/LabelImportantOutlined";

import { selectMail } from "../../features/mailSlice";
import {
  APIUserData,
  displayList,
  displaySingleMessage,
} from "../../features/dataSlice";
import { useDispatch, useSelector } from "react-redux";

//import Mail from "../Mail/Mail";

function EmailRow({
  id,
  title,
  subject,
  description,
  time,
  label,
  attachmentId,
  textHTML,
}) {
  const dispatch = useDispatch();

  const openMail = () => {
    dispatch(
      selectMail({
        id,
        title,
        subject,
        description,
        time,
        attachmentId,
        textHTML,
      })
    );
    dispatch(displayList(false));
    dispatch(displaySingleMessage(true));
  };
  const ListRecord = useSelector(APIUserData);

  const listDisplay = ListRecord.displayList;

  return (
    <>
      {listDisplay && (
        <div onClick={openMail} className="emailRow">
          <div className="emailRow-options">
            <Checkbox />
            <IconButton>
              <StarBorderOutlinedIcon />
            </IconButton>
            <IconButton>
              <LabelImportantOutlinedIcon />
            </IconButton>
          </div>
          <h3 className={label ? " emailRow-title unread" : "emailRow-title"}>
            {title}
          </h3>
          <div
            className={label ? " emailRow-message unread" : "emailRow-message"}
          >
            <h4>
              {subject}{" "}
              <span className="emailRow-description"> - {description}</span>
            </h4>
          </div>
          <p className="emailRow-time">{time}</p>
        </div>
      )}
    </>
  );
}

export default EmailRow;
