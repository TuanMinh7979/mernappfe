import axios from "@services/axios";
import { deleteAPI, getAPI, postAPI } from "@services/utils/fetchData";
import { freshAccessToken } from "@services/utils/tokenUtils";
export const imageService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },
  getUserImages: async function (userId, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return getAPI(`/images/${userId}`, accessToken);
  },

  addImage: async function (url, data, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await postAPI(url, { image: data }, accessToken);
  },

  removeImage: async function (url, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await deleteAPI(url, accessToken);
  },
};
