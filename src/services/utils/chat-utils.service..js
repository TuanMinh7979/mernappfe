import { chatService } from '@services/api/chat/chat.service';
import { socketService } from '@services/socket/socket.service';
import { createSearchParams } from 'react-router-dom';
import { cloneDeep, find, findIndex, remove } from 'lodash';

export class ChatUtils {
    static privateChatMessages = [];
    static chatUsers = [];

    static usersOnline(setOnlineUsers) {
        socketService?.socket?.on('user online', (data) => {
            setOnlineUsers(data);
        });
    }

    static usersOnChatPage() {
        socketService?.socket?.on('add chat users', (data) => {
            ChatUtils.chatUsers = [...data];
        });
    }

    static joinRoomEvent(user, profile) {
        const users = {
            receiverId: user.receiverId,
            receiverName: user.receiverUsername,
            senderId: profile?._id,
            senderName: profile?.username
        };
        socketService?.socket?.emit('join room', users);
    }

    static emitChatPageEvent(event, data) {
        socketService?.socket?.emit(event, data);
    }

    static makeDetailConversationUrlParam(user, profile) {
        const params = { username: '', id: '' };
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
        selectedImage
    }) {
        // const chatConversationId = chatMessages.find(

        //     (chat) => chat.receiverId === searchParamsId || chat.senderId === searchParamsId
        // );

        // conversationId only setted when created new message, but at the begining, no conversationId setted
        // => so if it was unset, get it from  chatMessages

        // 
        // if (!conversationId && chatMessages.length) {
        //     conversationId = chatMessages[0].conversationId
        // }
        const chatConversationId = chatMessages.find(

            (chat) => chat.receiverId === searchParamsId || chat.senderId === searchParamsId
        );

        const messageData = {
            conversationId: chatConversationId ? chatConversationId.conversationId : conversationId,

            receiverId: receiver?._id,
            receiverUsername: receiver?.username,
            receiverAvatarColor: receiver?.avatarColor,
            receiverProfilePicture: receiver?.profilePicture,
            body: message.trim(),
            isRead,
            gifUrl,
            selectedImage
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
        dispatch
    }) {
        if (chatMessageList.length) {
            dispatch(setSelectedChatUser({ isLoading: false, user: chatMessageList[0] }));
            navigate(`${pathname}?${createSearchParams(params)}`);
        } else {
            dispatch(setSelectedChatUser({ isLoading: false, user: null }));
            const sender =
                ChatUtils.chatUsers.find(
                    (user) => user.userOne === profile?.username && user.userTwo.toLowerCase() === username
                );
            if (sender) {
                chatService.removeChatUsers(sender);
            }
        }
    }

    static socketIOConversations(profile, toShowConversationList, setToShowConversationList) {
        socketService?.socket?.on('chat list', (data) => {
            if (data.senderUsername === profile?.username || data.receiverUsername === profile?.username) {
                console.log("-----------conversations----------data", data);
                const messageIndex = toShowConversationList.findIndex(el => el.conversationId == data.conversationId);
                let newToShowConversationList = [...toShowConversationList];
                if (messageIndex > -1) {
                    newToShowConversationList = newToShowConversationList.filter((el) => el.conversationId !== data.conversationId);
                    newToShowConversationList = [data, ...newToShowConversationList];
                } else {
                    console.log("------------------->>>>>>> comehere", data, newToShowConversationList);
                    newToShowConversationList = newToShowConversationList.filter((el) =>
                        el.receiverUsername !== data.receiverUsername )
          
                    // newToShowConversationList = newToShowConversationList.filter((el) =>
                    // el.senderUsername !== data.receiverUsername )

                        
                    
                  
                      
                    

                    newToShowConversationList = [data, ...newToShowConversationList];
                }

                console.log("-----------conversations", newToShowConversationList);
                setToShowConversationList(newToShowConversationList);
            }
        });
    }

    // like above
    static socketIOMessageReceived(chatMessages, targetUserName, setConversationId, setChatMessages) {
        let newChatMessages = [...chatMessages];
        socketService?.socket?.on('message received', (data) => {
            if (data.senderUsername.toLowerCase() === targetUserName || data.receiverUsername.toLowerCase() === targetUserName) {

                setConversationId(data.conversationId);
                console.log("oldddddddddddddd", ChatUtils.privateChatMessages);
                let oldIdx = ChatUtils.privateChatMessages.findIndex(el => el.conversationId === data.conversationId)
                if (!oldIdx) {
                    ChatUtils.privateChatMessages.push(data);
                } else {
                    ChatUtils.privateChatMessages.splice(oldIdx, 1, data);
                }

                newChatMessages = [...ChatUtils.privateChatMessages];
                console.log("socketio:receive", data, newChatMessages);
                setChatMessages([...newChatMessages]);
            }
        });

        socketService?.socket?.on('message read', (data) => {
            if (data.senderUsername.toLowerCase() === targetUserName || data.receiverUsername.toLowerCase() === targetUserName) {
                const findMessageIndex = ChatUtils.privateChatMessages.findIndex(el => el._id === data._id)
                if (findMessageIndex > -1) {
                    ChatUtils.privateChatMessages.splice(findMessageIndex, 1, data);
                    chatMessages = [...ChatUtils.privateChatMessages];
                    setChatMessages(chatMessages);
                }
            }
        });
    }

    static socketIOMessageReaction(chatMessages, username, setConversationId, setChatMessages) {
        socketService?.socket?.on('message reaction', (data) => {
            if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
                chatMessages = cloneDeep(chatMessages);
                setConversationId(data.conversationId);
                const messageIndex = findIndex(chatMessages, (message) => message?._id === data._id);
                if (messageIndex > -1) {
                    chatMessages.splice(messageIndex, 1, data);
                    setChatMessages(chatMessages);
                }
            }
        });
    }
}
