
import { notificationService } from "@services/api/notification/notification.service";
import { socketService } from "@services/socket/socket.service";
import { Utils } from "@services/utils/utils.service";
import { cloneDeep, find, findIndex, remove, sumBy } from "lodash";


export class NotificationUtils {
  static socketIONotification(
    profile,
    notifications,
    setNotifications,
    type,
    setNotificationsCount
  ) {

    console.log("init", notifications);
    socketService?.socket?.on("insert notification", (data, userToData) => {
      // data(is list of current user's notification) and userToData from server
      if (profile?._id === userToData.userTo) {
        notifications = [...data];
        if (type === "notificationPage") {
          setNotifications(notifications);
        }
      }
    });

    socketService?.socket?.on("update notification", (notificationId) => {
      let newNotifications = [...notifications];
      console.log(newNotifications);
      const updatedIdx =
        newNotifications.findIndex(
          (notification) => notification._id === notificationId)
      console.log(updatedIdx);
      if (updatedIdx !== -1) {
        newNotifications[updatedIdx].read = true
        if (type === "notificationPage") {
          setNotifications(newNotifications);
        }
      }
    });

    socketService?.socket?.on("delete notification", (notificationId) => {

      let newNotifications = [...notifications].filter(item => item._id === notificationId)
      if (type === "notificationPage") {
        setNotifications(newNotifications);
      }
    });
  }




}
