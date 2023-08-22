import React from 'react'
import "./Chat.scss"
import { useSelector } from 'react-redux'
import ChatSidebar from '@components/chat/list/ChatSidebar'
const Chat = () => {

    const reduxChat = useSelector(state => state.chat)
    return (
        <div className="private-chat-wrapper">
            <div className="private-chat-wrapper-content">
                <div className="private-chat-wrapper-content-side" style={{border: "1px solid blue"}}>
                    <ChatSidebar />
                </div>
                <div className="private-chat-wrapper-content-conversation">
                    {/* {(reduxChat.selectedChatUser || reduxChat.chatList.length > 0) && <ChatWindow />} */}
                    {!reduxChat.selectedChatUser && !reduxChat.chatList.length && (
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