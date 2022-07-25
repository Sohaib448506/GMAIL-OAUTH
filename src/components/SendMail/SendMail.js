import React, { useState } from "react";
import "./SendMail.css";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { closeSendMessage } from "../../features/mailSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import axios from "axios";

function SendMail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [imageEncode, setImageEncoded] = useState([]);
  function sendMessage(headers_obj, message) {
    var email = "";

    for (var header in headers_obj)
      email += header += ": " + headers_obj[header] + "\r\n";
    email += "\r\n" + message;

    // email += "\r\n" + imageEncode;

    var emailToSend = window
      .btoa(email)
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    const path = "upload/gmail/v1/users/me/messages/send"; // Modified
    // const mail = btoa(mails).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // Deleted
    window.gapi.client
      .request({
        path: path,
        headers: { "Content-Type": "message/rfc822" },
        method: "POST",
        body: mail, // Modified
      })
      .then((response) => {
        console.log("Response:", response);
      })
      .catch((err) => {
        console.log("Error:", err);
      });

    // axios
    //   .post(
    //     `https://gmail.googleapis.com/upload/gmail/v1/users/${user.user_id}/messages/send`,
    //     {
    //       raw: emailToSend,
    //       attachments: [
    //         {
    //           name: "b2.png",
    //           path: imageEncode[0],
    //         },
    //       ],
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "message/rfc822",
    //         Authorization: `Bearer ${user.access_token}`,
    //       },
    //     }
    //   )
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
    // window.gapi.client.gmail.users.messages
    //   .send({
    //     userId: "me",
    //     resource: {
    //       raw:
    //         window.btoa(email).replace(/\+/g, "-").replace(/\//g, "_") +
    //         imageEncode,
    //     },
    //   })
    //   .then((res) => console.log("Message has been Sent Successfully", res))
    //   .catch((err) => console.log(err));
  }
  const onSubmit = (formData) => {
    const headers_obj = {
      To: formData.to,
      Subject: formData.subject,
    };
    const message = formData.message;
    sendMessage(headers_obj, message);

    dispatch(closeSendMessage());
  };
  //for attachments
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
    const file = event.target.files[0];

    const base64 = await convertBase64(file);

    setImageEncoded(base64.split(",")[1]);
  };

  //testing
  // Get the canvas from the DOM and turn it into base64-encoded png data.
  // var canvas = document.getElementById("canvas");
  // var dataUrl = canvas.toDataURL();

  // The relevant data is after 'base64,'.
  var pngData = imageEncode;
  var mail = [
    'Content-Type: multipart/mixed; boundary="foo_bar_baz"\r\n',
    "MIME-Version: 1.0\r\n",
    "From: sender@gmail.com\r\n",
    "To: sohaibbutt448506@gmail.com\r\n",
    "Subject: Subject Text\r\n\r\n",

    "--foo_bar_baz\r\n",
    'Content-Type: text/plain; charset="UTF-8"\r\n',
    "MIME-Version: 1.0\r\n",
    "Content-Transfer-Encoding: 7bit\r\n\r\n",

    "The actual message text goes here\r\n\r\n",

    "--foo_bar_baz\r\n",
    "Content-Type: image/png\r\n",
    "MIME-Version: 1.0\r\n",
    "Content-Transfer-Encoding: base64\r\n",
    'Content-Disposition: attachment; filename="example.png"\r\n\r\n',

    pngData,
    "\r\n\r\n",

    "--foo_bar_baz--",
  ].join("");

  return (
    <div className="sendMail">
      <div className="sendMail-header">
        <h3>New Message</h3>
        <CloseIcon
          onClick={() => dispatch(closeSendMessage())}
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
          {...register("subject", { required: true })}
        />
        {errors.subject && (
          <p className="sendMail-error">Subject is Required!</p>
        )}
        <input
          name="message"
          placeholder="Message"
          type="text"
          className="sendMail-message"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <p className="sendMail-error">Message is Required!</p>
        )}
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

export default SendMail;
