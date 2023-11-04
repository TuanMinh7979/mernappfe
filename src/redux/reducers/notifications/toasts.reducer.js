import { createSlice } from "@reduxjs/toolkit";

import checkIcon from '@assets/images/check.svg'
import errorIcon from '@assets/images/error.svg'
import infoIcon from '@assets/images/info.svg'

import { uniqBy } from "lodash";


const initialState = [];

const toastIcons = [
  { success: checkIcon, color: "#5cb85c" },
  { error: errorIcon, color: "#d9534f" },
  { info: infoIcon, color: "#5bc0de" },
  { clientError: errorIcon, color: "orange" },
];

const toastsSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    updateToastsNewEle: (state, action) => {
      const { message, type } = action.payload;
      const toastIconObject = toastIcons.find((item) => item[type]);

      const toastItem = {
        id: state.length,
        description: message,
        type,
        icon: toastIconObject[type], // checkIcon || errorIcon ||...
        backgroundColor: toastIconObject.color,
      };

      //   them vao dau list
      let newList = [...state]
      newList.unshift(toastItem);
      newList = [...uniqBy(newList, "description")];
      return newList;
    },
    removeToasts: () => {
      return [];
    },
  },
});

export const { updateToastsNewEle, removeToasts } =
  toastsSlice.actions;
export default toastsSlice.reducer;
