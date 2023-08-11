
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
      const updatedIdx =
        newNotifications.findIndex(
          (notification) => notification._id === notificationId)

      if (updatedIdx) {
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

  static socketIOMessageNotification(
    profile,
    messageNotifications,
    setMessageNotifications,
    setMessageCount,
    dispatch,
    location
  ) {
    socketService?.socket?.on("chat list", (data) => {
      messageNotifications = cloneDeep(messageNotifications);
      if (data?.receiverUsername === profile?.username) {
        const notificationData = {
          senderId: data.senderId,
          senderUsername: data.senderUsername,
          senderAvatarColor: data.senderAvatarColor,
          senderProfilePicture: data.senderProfilePicture,
          receiverId: data.receiverId,
          receiverUsername: data.receiverUsername,
          receiverAvatarColor: data.receiverAvatarColor,
          receiverProfilePicture: data.receiverProfilePicture,
          messageId: data._id,
          conversationId: data.conversationId,
          body: data.body,
          isRead: data.isRead,
        };
        const messageIndex = findIndex(
          messageNotifications,
          (notification) => notification.conversationId === data.conversationId
        );
        if (messageIndex > -1) {
          remove(
            messageNotifications,
            (notification) =>
              notification.conversationId === data.conversationId
          );
          messageNotifications = [notificationData, ...messageNotifications];
        } else {
          messageNotifications = [notificationData, ...messageNotifications];
        }
        const count = sumBy(messageNotifications, (notification) => {
          return !notification.isRead ? 1 : 0;
        });
        if (!Utils.checkUrl(location.pathname, "chat")) {
          Utils.dispatchNotification(
            "You have a new message",
            "success",
            dispatch
          );
        }
        setMessageCount(count);
        setMessageNotifications(messageNotifications);
      }
    });
  }
}
