import React from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import LabelImportantOutlinedIcon from "@material-ui/icons/LabelImportantOutlined";
const SingleEmailDisplaySent = ({
  id,
  to,
  subject,
  description,
  timestamp,
}) => {
  return (
    <>
      <div className="emailRow">
        <div className="emailRow-options">
          <Checkbox />
          <IconButton>
            <StarBorderOutlinedIcon />
          </IconButton>
          <IconButton>
            <LabelImportantOutlinedIcon />
          </IconButton>
        </div>
        <h3 className="emailRow-title">{to}</h3>
        <div className="emailRow-message">
          <h4>
            {subject}{" "}
            <span className="emailRow-description"> - {description}</span>
          </h4>
        </div>
        <p className="emailRow-time">{timestamp}</p>
      </div>
    </>
  );
};

export default SingleEmailDisplaySent;
