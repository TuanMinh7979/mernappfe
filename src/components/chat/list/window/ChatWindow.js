import React, { useState } from "react";
import Avatar from "@components/avatar/Avatar";
import { useSelector } from "react-redux";
import "./ChatWindow.scss";
import MessageInput from "./message-input/MessageInput";
import { Utils } from "@services/utils/utils.service";

import { ChatUtils } from "@services/utils/chat-utils.service.";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userService } from "@services/api/user/user.service";

import { chatService } from "@services/api/chat/chat.service";
import { useEffect } from "react";
import MessageDisplay from "./message-display/MessageDisplay";

import { socketService } from "@services/socket/socket.service";
const ChatWindow = () => {
  const reduxChat = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { profile, token } = useSelector((state) => state.user);

  const [receiver, setReceiver] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [searchParams] = useSearchParams();

  const getCurrentConversationMessages = async () => {
    try {
      if (searchParams.get("id") && searchParams.get("username")) {
        setChatMessages([]);
        const response = await chatService.getChatMessages(
          searchParams.get("id"), token
        );
        setChatMessages([...response.data.messages]);
      }
    } catch (error) {

      Utils.updToastsNewEle(error.response.data.message, "error", dispatch);
    }
  };

  //  * userfor: get target user profile
  const getTargetUserProfileById = async () => {
    try {
      const response = await userService.getUserProfileByUserId(
        searchParams.get("id"), token
      );
      setReceiver(response.data.user);
    } catch (error) {
      Utils.updToastsNewEle(error.response.data.message, "error", dispatch);
    }
  };

  useEffect(() => {
    if (searchParams.get("id")) {
      getTargetUserProfileById();
      getCurrentConversationMessages();
    }
  }, [searchParams]);

  useEffect(() => {
    ChatUtils.socketIOMessageReceived(
      chatMessages,
      searchParams.get("username"),
      setChatMessages
    );

    ChatUtils.socketIOMessageReaction(
      chatMessages,
      searchParams.get("username"),
      setChatMessages
    );
    return () => {
      socketService.socket.off("message received");
      socketService.socket.off("message read");
      socketService.socket.off("message reaction");
    };
  }, [chatMessages]);

  const createChatMessage = async (message, gifUrl, selectedImage) => {
    try {
      // if !conversationId=>create new conversation

      const messageData = ChatUtils.buildMessageData({
        receiver,

        message,

        chatMessages,
        gifUrl,
        selectedImage,

      });
      const res = await chatService.saveChatMessage(messageData, token);
      if (
        !chatMessages.find(
          (chat) =>
            chat.receiverId === searchParams.get("id") ||
            chat.senderId === searchParams.get("id")
        )
      ) {
        ChatUtils.joinConversation(profile, res.data.conversationId);
      }
    } catch (error) {

      Utils.updToastsNewEle(error.response.data.message, "error", dispatch);
    }
  };





  return (
    <div className="chat-window-container" data-testid="chatWindowContainer">
      <div data-testid="chatWindow">
        <div className="chat-title" data-testid="chat-title">
          {receiver && (
            <div className="chat-title-avatar">
              <Avatar
                name={receiver?.username}
                bgColor={receiver.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={receiver?.profilePicture}
              />
            </div>
          )}
          <div className="chat-title-items">
            <div className="chat-name">{receiver?.username}</div>
          </div>
        </div>
        <div className="chat-window">
          <div className="chat-window-message">
            <MessageDisplay
              chatMessages={chatMessages}
              profile={profile}
              token={token}
            ></MessageDisplay>
          </div>
          <div className="chat-window-input">
            <MessageInput sendChatMessage={createChatMessage}></MessageInput>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
