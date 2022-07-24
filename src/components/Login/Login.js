import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
// import { auth, provider } from "../../firebase";
import "./Login.css";
import jwt_decode from "jwt-decode";

function Login() {
  const dispatch = useDispatch();

  function authenticate() {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({
        scope:
          "https://mail.google.com/ https://www.googleapis.com/auth/gmail.addons.current.message.action https://www.googleapis.com/auth/gmail.addons.current.message.metadata https://www.googleapis.com/auth/gmail.addons.current.message.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.readonly",
        plugin_name: "Sohaib",
      })
      .then(
        function (res) {
          var userObject = jwt_decode(res.Cc.id_token);
          localStorage.setItem("user", JSON.stringify(userObject));
          const { name, sub, picture, email } = userObject;
          const user = {
            _id: sub,
            _type: "user",
            userName: name,
            image: picture,
            email: email,
          };

          dispatch(
            login({
              displayName: user.userName,
              user_id: user._id,
              email: user.email,
              photoUrl: user.image,
              access_token: res.Cc.access_token,
            })
          );
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  }

  function loadClient() {
    window.gapi.client.setApiKey("AIzaSyAFFn6wAe3RyKjT_ItiWSJL-vrJgJPhcd0");
    return window.gapi.client
      .load("https://gmail.googleapis.com/$discovery/rest?version=v1")
      .then(
        function () {
          console.log("window.GAPI client loaded for API");
        },
        function (err) {
          console.error("Error loading window.GAPI client for API", err);
        }
      );
  }
  useEffect(() => {
    window.gapi.load("client:auth2", function () {
      window.gapi.auth2.init({
        client_id:
          "850110956503-qaajqu7m70b6mmkhtdq9uh3pqalg8obs.apps.googleusercontent.com",
        plugin_name: "Sohaib",
      });
    });
  }, []);

  const signIn = () => {
    const load = async () => {
      await authenticate().then(loadClient);
    };
    load();

    // auth.signInWithPopup(provider).then(({ user }) => {
    //   dispatch(
    //     login({
    //       displayName: user.displayName,
    //       email: user.email,
    //       photoUrl: user.photoURL,
    //     })
    //   );
    // });
  };
  return (
    <div className="login">
      <div className="login-container">
        <img
          src="https://static.dezeen.com/uploads/2020/10/gmail-google-logo-rebrand-workspace-design_dezeen_2364_col_0.jpg"
          alt=""
        />
        <Button variant="contained" color="primary" onClick={signIn}>
          Log In
        </Button>
      </div>
    </div>
  );
}

export default Login;
