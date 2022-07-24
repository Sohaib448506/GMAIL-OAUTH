import axios from "axios";

const InboxIDs = (user) =>
  axios.create({
    baseURL: "https://gmail.googleapis.com/gmail/v1/users",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.access_token}`,
    },
  });
export default InboxIDs;
