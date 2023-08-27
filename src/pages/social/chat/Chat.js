import React from 'react'
import "./Chat.scss"
import { useSelector } from 'react-redux'
import ChatSidebar from '@components/chat/list/ChatSidebar'
import ChatWindow from '@components/chat/list/window/ChatWindow'
const Chat = () => {

    const reduxChat = useSelector(state => state.chat)

    return (
        <div className="private-chat-wrapper">
            <div className="private-chat-wrapper-content">
                <div className="private-chat-wrapper-content-side" style={{ border: "1px solid blue" }}>
                    <ChatSidebar />
                </div>
                <div className="private-chat-wrapper-content-conversation">
                    {reduxChat.selectedChatUser  && <ChatWindow />}
                    {!reduxChat.selectedChatUser && !reduxChat.conversationList.length && (
                        <div className="no-chat" data-testid="no-chat">
                            Select or Search for users to chat with
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Chat