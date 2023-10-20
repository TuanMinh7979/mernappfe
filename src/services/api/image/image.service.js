
import { deleteAPI, getAPI, postAPI } from "@services/utils/fetchData";
import { newestAccessToken } from "@services/utils/tokenUtils";
export const imageService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },


  getsByUser: async function (userId) {

    let accessToken = await newestAccessToken( this.dispatch);

    return getAPI(`/images/${userId}`, accessToken);
  },

  save: async function (url, data) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await postAPI(url, { image: data }, accessToken);
  },

  delete: async function (url) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await deleteAPI(url, accessToken);
  },
};
