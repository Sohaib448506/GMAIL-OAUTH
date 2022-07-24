import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { closeSendMessage } from "../../features/mailSlice";
import { forwardButtonClicked } from "../../features/dataSlice";

function SendReply(props) {
  const [forwardSubject, setForwardEmailSubject] = useState(
    props.props.subject
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  function sendMessage(headers_obj, message) {
    var email = "";

    for (var header in headers_obj)
      email += header += ": " + headers_obj[header] + "\r\n";

    email += "\r\n" + message;
    window.gapi.client.gmail.users.messages
      .send({
        userId: "me",
        resource: {
          raw: window.btoa(email).replace(/\+/g, "-").replace(/\//g, "_"),
        },
      })
      .then((res) => console.log("Reply Message has been Sent Successfully"))
      .catch((err) => console.log(err));
  }
  const onSubmit = (formData) => {
    const headers_obj = {
      To: formData.to,
      Subject: formData.subject,
    };
    const message = formData.message;
    sendMessage(headers_obj, message);

    dispatch(closeSendMessage());
    dispatch(forwardButtonClicked(false));
  };

  var reply_to = props?.props.title?.replace(/\"<>/g, '"');
  var reply_to_splitted = reply_to.split(" ");

  var email_fetched = reply_to_splitted[reply_to_splitted.length - 1].slice(
    1,
    -1
  );

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
          {...register("subject", { required: true })}
        />
        {errors.subject && (
          <p className="sendMail-error">Subject is Required!</p>
        )}
        <input
          name="message"
          placeholder="Write the Forward Message Here!"
          type="text"
          className="sendMail-message"
          value={props.props.description}
          {...register("message", { required: true })}
        />
        {errors.message && (
          <p className="sendMail-error">Message is Required!</p>
        )}
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
