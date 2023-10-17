import axios from "@services/axios";
import { deleteAPI, getAPI, postAPI } from "@services/utils/fetchData";
import { freshAccessToken } from "@services/utils/tokenUtils";
export const imageService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },

  // accessToken: null,

  // setAccessToken: function (newtk) {
  //   this.accessToken = newtk;
  // },

  getUserImages: async function (userId, accessToken) {
    console.log(
      "--------------<<<<<<getUserImages be force refresh",
      accessToken
    );
    accessToken = await freshAccessToken(sessionStorage.getItem("accessToken"), this.dispatch);
    console.log("-------------->>>>>>getUserImages after refresh", accessToken);
    return getAPI(`/images/${userId}`, accessToken);
  },

  addImage: async function (url, data, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await postAPI(url, { image: data }, accessToken);
  },

  removeImage: async function (url, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await deleteAPI(url, accessToken);
  },
};
