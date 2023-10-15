import React from "react";
import "./Chat.scss";
import { useSelector } from "react-redux";
import ChatSidebar from "@components/chat/list/ChatSidebar";
import ChatWindow from "@components/chat/list/window/ChatWindow";
import { useEffect } from "react";
import { ChatUtils } from "@services/utils/chat-utils.service.";
import { fetchConversationList } from "@redux/api/chat";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
const Chat = () => {
  const dispatch = useDispatch();

  const reduxChat = useSelector((state) => state.chat);

  const { profile, token } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchConversationList(token));
  }, []);

  const [searchParams] = useSearchParams();

  return (
    <div className="private-chat-wrapper">
      <div className="private-chat-wrapper-content">
        <div
          className="private-chat-wrapper-content-side"

        >
          <ChatSidebar />
        </div>
        <div className="private-chat-wrapper-content-conversation">
          {searchParams.get("username") && <ChatWindow />}
          {!reduxChat.conversationList.length && (
            <div className="no-chat" data-testid="no-chat">
              Select or Search for users to chat with
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
