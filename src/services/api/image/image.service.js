import axios from "@services/axios";
import { deleteAPI, getAPI, postAPI } from "@services/utils/fetchData";
import { newestAccessToken } from "@services/utils/tokenUtils";
export const imageService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },


  getUserImages: async function (userId) {

    let accessToken = await newestAccessToken( this.dispatch);
    console.log("-------------->>>>>>getUserImages after refresh", accessToken);
    return getAPI(`/images/${userId}`, accessToken);
  },

  addImage: async function (url, data) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await postAPI(url, { image: data }, accessToken);
  },

  removeImage: async function (url) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await deleteAPI(url, accessToken);
  },
};
