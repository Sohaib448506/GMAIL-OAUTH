import { Checkbox, IconButton } from "@material-ui/core";
import React from "react";
import "./EmailRow.css";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import LabelImportantOutlinedIcon from "@material-ui/icons/LabelImportantOutlined";
import { useHistory } from "react-router-dom";
import { selectMail } from "../../features/mailSlice";
import { useDispatch } from "react-redux";

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
  const history = useHistory();
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
    history.push("/mail");
  };

  return (
    <>
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
    </>
  );
}

export default EmailRow;
