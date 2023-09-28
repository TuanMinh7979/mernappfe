import React, { useState } from "react";
import Avatar from "@components/avatar/Avatar";
import { useSelector } from "react-redux";
import "./ChatWindow.scss";
import MessageInput from "./message-input/MessageInput";
import { Utils } from "@services/utils/utils.service";
import { useCallback } from "react";
import { ChatUtils } from "@services/utils/chat-utils.service.";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userService } from "@services/api/user/user.service";
import useEffectOnce from "@hooks/useEffectOnce";
import { chatService } from "@services/api/chat/chat.service";
import { useEffect } from "react";
import MessageDisplay from "./message-display/MessageDisplay";
import sumBy from "lodash";
const ChatWindow = () => {

  const reduxChat = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.chat);
  const [receiver, setReceiver] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [searchParams] = useSearchParams();

  const getCurrentConversationMessages = async () => {
    try {
      if (searchParams.get("id") && searchParams.get("username")) {
        setChatMessages([]);
        const response = await chatService.getChatMessages(
          searchParams.get("id")
        );
        setChatMessages([...response.data.messages]);
      }
    } catch (error) {
      console.log(error);
      Utils.updToastsNewEle(error.response.data.message, "error", dispatch);
    }
  };

  //  * userfor: get target user profile
  const getTargetUserProfileById = async () => {
    try {
      const response = await userService.getUserProfileByUserId(
        searchParams.get("id")
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
    ChatUtils.setupSocketIOMessageReceived(
      chatMessages,
      searchParams.get("username"),
      setChatMessages,
      window.location.href
    );

    ChatUtils.socketIOMessageReaction(
      chatMessages,
      searchParams.get("username"),
      setChatMessages
    );

    
  }, [chatMessages]);

  const createChatMessage = async (message, gifUrl, selectedImage) => {
    try {

      // if !conversationId=>create new conversation

      const newConversationId = reduxChat?.selectedChatUser?.conversationId
        ? reduxChat?.selectedChatUser?.conversationId
        : ""
      const messageData = ChatUtils.buildMessageData({
        receiver,
        conversationId: newConversationId,
        message,
        searchParamsId: searchParams.get("id"),
        chatMessages,
        gifUrl,
        selectedImage,
        isRead: false,
      });
      const res = await chatService.saveChatMessage(messageData);
      if (!newConversationId) {
        // if is new conversation
        console.log(">>>RESDATA ADD NEW CONVERSATION", res.data);
        ChatUtils.joinConversation(profile, res.data.conversationId)

      }
    } catch (error) {
      console.log(error);
      Utils.updToastsNewEle(error.response.data.message, "error", dispatch);
    }
  };

  // * usefor : update message.reaction in DB

  // * usefor : delete message.reaction in DB

  // ? END func for message:


  return (
    <div className="chat-window-container" data-testid="chatWindowContainer">
      {isLoading ? (
        <div className="message-loading" data-testid="message-loading"></div>
      ) : (
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
              ></MessageDisplay>
            </div>
            <div className="chat-window-input">
              <MessageInput sendChatMessage={createChatMessage}></MessageInput>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
