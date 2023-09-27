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

  static updatedSelectedChatUser({
    chatMessageList,
    profile,
    username,
    setSelectedChatUser,
    params,
    pathname,
    navigate,
    dispatch,
  }) {
    if (chatMessageList.length) {
      dispatch(
        setSelectedChatUser({ isLoading: false, user: chatMessageList[0] })
      );
      navigate(`${pathname}?${createSearchParams(params)}`);
    } else {
      dispatch(setSelectedChatUser({ isLoading: false, user: null }));
    }
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
        // let newToShowConversationList = [...toShowConversationList];
        let newToShowConversationList = cloneDeep(toShowConversationList);
        if (messageIndex > -1) {
          // không là conversation rỗng
          newToShowConversationList = newToShowConversationList.filter(
            (el) => el.conversationId !== data.conversationId
          );
          newToShowConversationList = [data, ...newToShowConversationList];
        } else {

          //   là conversation rỗng
          newToShowConversationList = newToShowConversationList.filter(
            (el) => el?.conversationId
          );

          newToShowConversationList = [data, ...newToShowConversationList];
        }
        setToShowConversationList(newToShowConversationList);
      }
    });
  }

  static chatMessages = [];
  static targetUserName = "";
  static setChatMessages = () => { };
  static link = "";

  // like above
  static setupSocketIOMessageReceived(
    chatMessages,
    targetUserName,
    setChatMessages,
    link
  ) {
    this.chatMessages = new Set([...chatMessages]);
    this.targetUserName = targetUserName;
    this.setChatMessages = setChatMessages;
    this.link = link;
    this.socketIOMessageReceived1();
  }

  static socketIOMessageReceived1() {
    socketService?.socket?.on("message received", (data) => {
      if (
        data.senderUsername.toLowerCase() === this.targetUserName ||
        data.receiverUsername.toLowerCase() === this.targetUserName
      ) {
        this.chatMessages.add(data);
        this.setChatMessages([...this.chatMessages]);
      }
    });

    socketService?.socket?.on("message read", (data) => {

      if (
        data.senderUsername.toLowerCase() ===
        this.targetUserName.toLowerCase() ||
        data.receiverUsername.toLowerCase() ===
        this.targetUserName.toLowerCase()
      ) {
        const findMessageIndex = findIndex(this.chatMessages, [
          "_id",
          data._id,
        ]);
        if (findMessageIndex > -1) {

          this.chatMessages.splice(findMessageIndex, 1, data);
          this.setChatMessages(this.chatMessages);
        }
      }
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
