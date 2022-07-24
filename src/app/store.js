import { configureStore } from "@reduxjs/toolkit";
import mailReducer from "../features/mailSlice";
import userReducer from "../features/userSlice";
import dataReducer from "../features/dataSlice";

export const store = configureStore({
  reducer: {
    mail: mailReducer,
    user: userReducer,
    data: dataReducer,
  },
});
