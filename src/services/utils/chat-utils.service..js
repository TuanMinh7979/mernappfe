import { chatService } from "@services/api/chat/chat.service";
import { socketService } from "@services/socket/socket.service";
import { createSearchParams } from "react-router-dom";
import { cloneDeep, find, findIndex, remove } from "lodash";

export class ChatUtils {


  static joinConversation(
    profile,
    newConversationId
  ) {
    console.log("---------------join", profile._id, newConversationId);
    socketService?.socket?.emit("join conversation", {
      userId: profile._id,
      newConversationId,
    });
  }

  static leaveOnChatPage(profile) {
    socketService?.socket?.emit("leave chat page", {
      userId: profile._id
    });
  }

  static makeDetailConversationUrlParam(user, profile) {
    const params = { username: "", id: "" };
    if (user.receiverUsername === profile?.username) {
      params.username = user.senderUsername.toLowerCase();
      params.id = user.senderId;
    } else {
      params.username = user.receiverUsername.toLowerCase();
      params.id = user.receiverId;
    }
    return params;
  }

  static buildMessageData({
    receiver,
    message,
    searchParamsId,
    conversationId,
    chatMessages,
    isRead,
    gifUrl,
    selectedImage,
  }) {
    const chatConversationId = chatMessages.find(
      (chat) =>
        chat.receiverId === searchParamsId || chat.senderId === searchParamsId
    );

    const messageData = {
      conversationId: chatConversationId
        ? chatConversationId.conversationId
        : conversationId,

      receiverId: receiver?._id,
      receiverUsername: receiver?.username,
      receiverAvatarColor: receiver?.avatarColor,
      receiverProfilePicture: receiver?.profilePicture,
      body: message.trim(),
      isRead,
      gifUrl,
      selectedImage,
    };
    return messageData;
  }



  static socketIOConversations(
    profile,

    toShowConversationList,
    setToShowConversationList
  ) {
    socketService?.socket?.on("chat list", (data) => {
      console.log("DATA ON CHAT LIST", data);
      if (
        data.senderUsername === profile?.username ||
        data.receiverUsername === profile?.username
      ) {
        const messageIndex = toShowConversationList.findIndex(
          (el) => el.conversationId == data.conversationId
        );

        toShowConversationList = cloneDeep(toShowConversationList);
        if (messageIndex > -1) {

          remove(toShowConversationList,
            (el) => el.conversationId === data.conversationId
          );
          toShowConversationList = [data, ...toShowConversationList];
        } else {

          //   là conversation rỗng
          remove(toShowConversationList,
            (el) => el.receiverUsername === data.receiverUsername
          );

          toShowConversationList = [data, ...toShowConversationList];
        }
        setToShowConversationList(toShowConversationList);
      }
    });
  }


  static socketIOMessageReceived(chatMessages,
    targetUserName,
    setChatMessages
  ) {
    socketService?.socket?.on("message received", (data) => {

      if (
        data.senderUsername.toLowerCase() === targetUserName ||
        data.receiverUsername.toLowerCase() === targetUserName
      ) {
        chatMessages.push(data);
        setChatMessages([...chatMessages]);
      }
    });

    socketService?.socket?.on("message read", (data) => {
      console.log('MESSAGE READED ', data);
      if (
        data.senderUsername.toLowerCase() ===
        targetUserName.toLowerCase() ||
        data.receiverUsername.toLowerCase() ===
        targetUserName.toLowerCase()
      ) {
        const findMessageIndex = findIndex(chatMessages, [
          "_id",
          data._id,
        ]);
        if (findMessageIndex > -1) {

          chatMessages.splice(findMessageIndex, 1, data);
          // setChatMessages(chatMessages);
          setChatMessages([...chatMessages]);

        }
      }

      console.log("-----------------done message readed");
    });
  }

  static socketIOMessageReaction(
    chatMessages,
    username,

    setChatMessages
  ) {
    socketService?.socket?.on("message reaction", (data) => {
      if (
        data.senderUsername.toLowerCase() === username ||
        data.receiverUsername.toLowerCase() === username
      ) {
        chatMessages = cloneDeep(chatMessages);

        const messageIndex = findIndex(
          chatMessages,
          (message) => message?._id === data._id
        );
        if (messageIndex > -1) {
          chatMessages.splice(messageIndex, 1, data);
          setChatMessages(chatMessages);
        }
      }
    });
  }
}
