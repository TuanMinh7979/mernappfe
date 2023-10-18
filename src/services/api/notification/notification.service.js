import axios from "@services/axios";
import { deleteAPI, getAPI, putAPI } from "@services/utils/fetchData";
import { freshAccessToken } from "@services/utils/tokenUtils";
export const notificationService = {
  dispatch: null,
  // notificationService.setDispatch
  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },

  getUserNotifications: async function () {
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch);
    return await getAPI("/notification", accessToken);
  },
  markNotificationAsRead: async function (messageId) {
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch);
    return await putAPI(`/notification/${messageId}`, {}, accessToken);
  },
  deleteNotification: async function (messageId) {
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch);
    return await deleteAPI(`/notification/${messageId}`, accessToken);
  },
};
