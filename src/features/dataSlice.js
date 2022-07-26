import { createSlice } from "@reduxjs/toolkit";

export const APISlice = createSlice({
  name: "data",
  initialState: {
    data: null,
    emailData: null,
    clickRecord: true,
    replyButtonClicked: false,
    forwardButtonClicked: false,
    profileData: 0,
    profileSentMessages: 0,
    profiletotalMessages: 0,
    profiletotalInboxMessages: 0,
  },
  reducers: {
    userData: (state, action) => {
      state.data = action.payload;
    },
    displayEmails: (state, action) => {
      state.emailData = action.payload;
    },
    resetDisplayEmails: (state, action) => {
      state.emailData = null;
    },
    clickRecord: (state, action) => {
      state.clickRecord = action.payload;
    },
    replyButtonClicked: (state, action) => {
      state.replyButtonClicked = action.payload;
    },
    forwardButtonClicked: (state, action) => {
      state.forwardButtonClicked = action.payload;
    },
    profileData: (state, action) => {
      state.profileData = action.payload;
    },
    profileSentMessages: (state, action) => {
      state.profileSentMessages = action.payload;
    },
    profiletotalMessages: (state, action) => {
      state.profiletotalMessages = action.payload;
    },
    profiletotalInboxMessages: (state, action) => {
      state.profiletotalMessages = action.payload;
    },
  },
});

export const {
  userData,
  displayEmails,
  resetDisplayEmails,
  clickRecord,
  replyButtonClicked,
  forwardButtonClicked,
  profileData,
  profileSentMessages,
  profiletotalMessages,
  profiletotalInboxMessages,
} = APISlice.actions;

export const APIUserData = (state) => state.data;

export default APISlice.reducer;
