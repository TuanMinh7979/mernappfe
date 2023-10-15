import axios from "@services/axios"
import { deleteAPI, getAPI, putAPI } from "@services/utils/fetchData";
class NotificationService {

    async getUserNotifications(accessToken) {
        return await getAPI('/notification', accessToken)


    }

    async markNotificationAsRead(messageId, accessToken) {
        return await putAPI(`/notification/${messageId}`,{},  accessToken);

    }

    async deleteNotification(messageId, accessToken) {
        return await deleteAPI(`/notification/${messageId}`, accessToken);

    }
}

export const notificationService = new NotificationService()