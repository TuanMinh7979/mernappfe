import React, { useState } from 'react'
import Avatar from '@components/avatar/Avatar';
import { useSelector } from 'react-redux';
import "./ChatWindow.scss"
import MessageInput from './message-input/MessageInput';
import { Utils } from '@services/utils/utils.service';
import { useCallback } from 'react';
import { ChatUtils } from '@services/utils/chat-utils.service.';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userService } from '@services/api/user/user.service';
import useEffectOnce from '@hooks/useEffectOnce';
import { chatService } from '@services/api/chat/chat.service';
import { useEffect } from 'react';
import MessageDisplay from './message-display/MessageDisplay';
import sumBy from "lodash"
const ChatWindow = () => {

    const [rendered, setRendered] = useState(false)

    const dispatch = useDispatch()
    const { profile } = useSelector((state) => state.user);
    const { isLoading } = useSelector((state) => state.chat);
    const [receiver, setReceiver] = useState("")
    const [conversationId, setConversationId] = useState("")
    const [chatMessages, setChatMessages] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])

    const searchChatMessages = useCallback(
        async (receiverId) => {
            try {
                const response = await chatService.getChatMessages(receiverId);
                ChatUtils.privateChatMessages = [...response.data.messages];

                setChatMessages([...ChatUtils.privateChatMessages]);
                console.log("call api messages");
            } catch (error) {
                Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
            }
        },
        [dispatch]
    );


    const [searchParams] = useSearchParams();
    const getChatMessageCallback = useCallback(() => {
        if (searchParams.get('id') && searchParams.get('username')) {
            setConversationId('');
            setChatMessages([]);

            searchChatMessages(searchParams.get('id'));
        }
    }, [searchChatMessages, searchParams]);


    const getUserProfileByUserId = useCallback(async () => {
        try {

            const response = await userService.getUserProfileByUserId(searchParams.get('id'));
            setReceiver(response.data.user);
            ChatUtils.joinRoomEvent(response.data.user, profile);
        } catch (error) {
            Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
        }
    }, [dispatch, profile, searchParams]);



    useEffect(() => {
        if (!rendered) setRendered(true)

        if (
            rendered &&
            searchParams.get('id')) {
            getUserProfileByUserId()
            getChatMessageCallback()
        }

    }, [searchParams, rendered])



    useEffect(() => {

        ChatUtils.socketIOMessageReceived(chatMessages, searchParams.get('username'), setConversationId, setChatMessages);


        ChatUtils.usersOnline(setOnlineUsers);
        ChatUtils.usersOnChatPage();

    }, [searchParams]);

    const sendChatMessage = async (message, gifUrl, selectedImage) => {
        try {
            const checkUserOne = ChatUtils.chatUsers.some(

                (user) => user?.userOne === profile?.username && user?.userTwo === receiver?.username
            );
            const checkUserTwo = ChatUtils.chatUsers.some(

                (user) => user?.userOne === receiver?.username && user?.userTwo === profile?.username
            );
            const messageData = ChatUtils.messageData({
                receiver,
                conversationId,
                message,
                searchParamsId: searchParams.get('id'),
                chatMessages,
                gifUrl,
               selectedImage,
                isRead: checkUserOne && checkUserTwo
            });
            await chatService.saveChatMessage(messageData);
        } catch (error) {
            console.log(error);
            Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
        }
    };
    console.log(chatMessages);

    // ? func for message:
    const updateMessageReaction = async (body) => {
        try {
            await chatService.updateMessageReaction(body);
        } catch (error) {
            Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
        }
    };

    const deleteChatMessage = async (senderId, receiverId, messageId, type) => {
        try {
            await chatService.markMessageAsDelete(messageId, senderId, receiverId, type);
        } catch (error) {
            Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
        }
    };
    // ? END func for message:



    return (
        <div className="chat-window-container" data-testid="chatWindowContainer">
            {isLoading ? (
                <div className="message-loading" data-testid="message-loading"></div>
            ) : (

                <div data-testid="chatWindow">
                    <div className="chat-title" data-testid="chat-title">
                        {receiver &&
                            <div className="chat-title-avatar">

                                <Avatar
                                    name={receiver?.username}
                                    bgColor={receiver.avatarColor}
                                    textColor="#ffffff"
                                    size={40}
                                    avatarSrc={receiver?.profilePicture}
                                />
                            </div>}
                        <div className="chat-title-items">
                            <div
                                className=
                                {`chat-name ${Utils.checkIfUserIsOnline(receiver?.username, onlineUsers) ? '' : 'user-not-online'
                                    }`}
                            >
                                {receiver?.username}
                            </div>
                            {Utils.checkIfUserIsOnline(receiver?.username, onlineUsers) && (
                                <span className="chat-active">Online</span>
                            )}
                        </div>
                    </div>
                    <div className="chat-window">
                        <div className="chat-window-message">
                            <MessageDisplay

                                chatMessages={chatMessages}
                                profile={profile}
                                updateMessageReaction={updateMessageReaction}
                                deleteChatMessage={deleteChatMessage}

                            ></MessageDisplay>
                        </div>
                        <div className="chat-window-input">
                            <MessageInput sendChatMessage={sendChatMessage}></MessageInput>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default ChatWindow