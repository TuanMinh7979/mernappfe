import { createSlice } from "@reduxjs/toolkit";

import checkIcon from '@assets/images/check.svg'
import errorIcon from '@assets/images/error.svg'
import infoIcon from '@assets/images/info.svg'
import warningIcon from '@assets/images/warning.svg'
import { cloneDeep, uniqBy } from "lodash";

const initialState = [];

const toastIcons = [
  { success: checkIcon, color: "#5cb85c" },
  { error: errorIcon, color: "#d9534f" },
  { info: infoIcon, color: "#5bc0de" },
  { warning: warningIcon, color: "#f0ad4e" },
];

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const { message, type } = action.payload;
      const toastIconObject = toastIcons.find((item) => item[type]);
      console.log(toastIconObject);
      const toastItem = {
        id: state.length,
        description: message,
        type,
        icon: toastIconObject[type], // checkIcon || errorIcon ||...
        backgroundColor: toastIconObject.color,
      };
  
      //   them vao dau list
      let newList=[...state]
      newList.unshift(toastItem);
      newList = [...uniqBy(newList, "description")];
      return newList;
    },
    clearNotification: () => {
      
      return [];
    },
  },
});

export const { addNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
