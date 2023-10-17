import axios from "@services/axios";
import { deleteAPI, getAPI, postAPI } from "@services/utils/fetchData";
import { freshAccessToken } from "@services/utils/tokenUtils";
export const imageService = {
  accessToken: "",
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },
  setAccessToken: function (newAccessToken) {
    this.accessToken = newAccessToken;
  },
  getUserImages: async function (userId) {
    console.log("--------------access token in getUserImages", this.accessToken);
    this.accessToken = await freshAccessToken(this.accessToken, this.dispatch)
    return getAPI(`/images/${userId}`, this.accessToken);
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
