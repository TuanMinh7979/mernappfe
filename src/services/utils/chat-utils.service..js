import { socketService } from "@services/socket/socket.service";



export class ChatUtils {
  static joinConversation(profile, newConversationId) {
    console.log("join", profile._id, newConversationId);
    socketService?.socket?.emit("join conversation", {
      userId: profile._id,
      newConversationId,
    });
  }

  static leaveOnChatPage(profile) {
    socketService?.socket?.emit("leave chat page", {
      userId: profile._id,
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

    chatMessages,

    gifUrl,
    selectedImage,
  }) {
    const currentConversationId =
      chatMessages.length > 0 ? chatMessages[0].conversationId : "";

    const messageData = {
      conversationId: currentConversationId,

      receiverId: receiver?._id,
      receiverUsername: receiver?.username,
      receiverAvatarColor: receiver?.avatarColor,
      receiverProfilePicture: receiver?.profilePicture,
      body: message.trim(),
      isRead: false,
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

        let newtoShowConversationList = [...toShowConversationList];
        if (messageIndex > -1) {
          // remove old conversation message
          newtoShowConversationList = newtoShowConversationList.filter(
            (el) => el.conversationId !== data.conversationId)

          // add new conversation message to top
          newtoShowConversationList = [data, ...newtoShowConversationList];
        } else {
          //   là conversation rỗng

          newtoShowConversationList = newtoShowConversationList.filter(
            (el) => el.receiverUsername === data.receiverUsername)


          newtoShowConversationList = [data, ...newtoShowConversationList];
        }
        setToShowConversationList([...newtoShowConversationList]);
      }
    });
  }

  static socketIOMessageReceived(
    chatMessages,
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
      console.log("MESSAGE READED ", data);
      if (
        data.senderUsername.toLowerCase() === targetUserName.toLowerCase() ||
        data.receiverUsername.toLowerCase() === targetUserName.toLowerCase()
      ) {
        const findMessageIndex = chatMessages.findIndex(el => el._id === data._id);
        if (findMessageIndex > -1) {
          chatMessages.splice(findMessageIndex, 1, data);
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
        let newChatMessages = [...chatMessages];

        const messageIndex =
          newChatMessages.findIndex(
            (message) => message?._id === data._id
          );
        if (messageIndex > -1) {
          newChatMessages.splice(messageIndex, 1, data);
          setChatMessages([...newChatMessages]);
        }
      }
    });
  }
}
