import React, { useState } from "react";
import { useForm } from "react-hook-form";

import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";

import { useDispatch } from "react-redux";
import { closeSendMessage } from "../../features/mailSlice";
import { forwardButtonClicked } from "../../features/dataSlice";

function SendReply(props) {
  const [forwardSubject, setForwardEmailSubject] = useState(
    props.props.subject
  );

  const [forwardEmailDescription, setForwardEmailDescription] = useState(
    props.props.description
  );
  const [imageEncode, setImageEncoded] = useState([]);
  const [fileName, setFileName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  function sendMessage(headers_obj, message) {
    const path = "upload/gmail/v1/users/me/messages/send";
    var pngData = imageEncode;
    var mail = [
      'Content-Type: multipart/mixed; boundary="foo_bar_baz"\r\n',
      "MIME-Version: 1.0\r\n",
      `To:${headers_obj.To}\r\n`,
      `Subject: ${headers_obj.Subject}\r\n\r\n`,

      "--foo_bar_baz\r\n",
      'Content-Type: text/plain; charset="UTF-8"\r\n',
      "MIME-Version: 1.0\r\n",
      "Content-Transfer-Encoding: 7bit\r\n\r\n",

      `${message}\r\n\r\n`,

      "--foo_bar_baz\r\n",
      "Content-Type: image/png\r\n",
      "MIME-Version: 1.0\r\n",
      "Content-Transfer-Encoding: base64\r\n",
      `Content-Disposition: attachment; filename="${fileName}" \r\n\r\n`,

      pngData,
      "\r\n\r\n",

      "--foo_bar_baz--",
    ].join("");

    window.gapi.client
      .request({
        path: path,
        headers: { "Content-Type": "message/rfc822" },
        method: "POST",
        body: mail,
      })
      .then(() => {
        alert("Email has been forward successfully");
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }
  const onSubmit = (formData) => {
    const headers_obj = {
      To: formData.to,
      Subject: forwardSubject,
    };
    const message = forwardEmailDescription;
    sendMessage(headers_obj, message);

    dispatch(closeSendMessage());
    dispatch(forwardButtonClicked(false));
  };
  //for attachment
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadImage = async (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
      const file = event.target.files[0];

      const base64 = await convertBase64(file);

      setImageEncoded(base64.split(",")[1]);
    }
  };

  return (
    <div className="sendMail">
      <div className="sendMail-header">
        <h3>Forward Message</h3>
        <CloseIcon
          onClick={() => dispatch(forwardButtonClicked(false))}
          className="sendMail-close"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="to"
          placeholder="To"
          type="email"
          {...register("to", { required: true })}
        />
        {errors.to && <p className="sendMail-error">To is Required!</p>}
        <input
          name="subject"
          placeholder="Subject"
          type="text"
          contentEditable={true}
          value={forwardSubject}
          onChange={(e) => setForwardEmailSubject(e.target.value)}
          required
        />

        <input
          name="message"
          placeholder="Write the Forward Message Here!"
          type="text"
          className="sendMail-message"
          contentEditable={true}
          value={forwardEmailDescription}
          onChange={(e) => setForwardEmailDescription(e.target.value)}
          required
        />
        {/* For Uploading documents */}
        <input
          id="selectImage"
          type="file"
          onChange={(e) => {
            uploadImage(e);
          }}
        />
        <div className="sendMail-options">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="sendMail-send"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SendReply;
