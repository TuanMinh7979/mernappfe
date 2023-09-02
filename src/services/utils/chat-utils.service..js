import { chatService } from '@services/api/chat/chat.service';
import { socketService } from '@services/socket/socket.service';
import { createSearchParams } from 'react-router-dom';
import { cloneDeep, find, findIndex, remove } from 'lodash';

export class ChatUtils {

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

    // static joinRoomEvent(user, profile) {
    //     const users = {
    //         receiverId: user.receiverId,
    //         receiverName: user.receiverUsername,
    //         senderId: profile?._id,
    //         senderName: profile?.username
    //     };
    //     socketService?.socket?.emit('join room', users);
    // }
    static joinRoomEvent(profile) {

        socketService?.socket?.emit('join room', profile);
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

                const messageIndex = toShowConversationList.findIndex(el => el.conversationId == data.conversationId);
                let newToShowConversationList = [...toShowConversationList];
                if (messageIndex > -1) {
                    newToShowConversationList = newToShowConversationList.filter((el) => el.conversationId !== data.conversationId);
                    newToShowConversationList = [data, ...newToShowConversationList];
                } else {

                    newToShowConversationList = newToShowConversationList.filter((el) =>
                        el?.conversationId)

                    // newToShowConversationList = newToShowConversationList.filter((el) =>
                    // el.senderUsername !== data.receiverUsername )







                    newToShowConversationList = [data, ...newToShowConversationList];
                }


                setToShowConversationList(newToShowConversationList);
            }
        });
    }

    static chatMessages = []
    static targetUserName = ''
    static setChatMessages = () => { }
    static link = ''

    // like above
    static setupSocketIOMessageReceived(chatMessages, targetUserName, setChatMessages, link) {
        this.chatMessages = new Set([...chatMessages])
        this.targetUserName = targetUserName
        this.setChatMessages = setChatMessages
        this.link = link
        this.socketIOMessageReceived1()

    }


    static socketIOMessageReceived1() {

        console.log("1111111111111111 LEN SOCKET", this.chatMessages[0]?.receiverUsername, this.chatMessages[0]?.senderUsername, this.targetUserName);
        socketService?.socket?.on('message received', (data) => {
            console.log(this.link);
            console.log("2222222222222222222, LEN SOCKET", this.chatMessages, this.targetUserName

            );

            if (data.senderUsername.toLowerCase() === this.targetUserName || data.receiverUsername.toLowerCase() === this.targetUserName) {



                console.log("======------------conditionok", this.chatMessages, this.targetUserName)



                console.log("ADD")


                this.chatMessages.add(data);

                console.log("socketio:receive", data);

                this.setChatMessages([...this.chatMessages]);

            }
        });
    }
    // static socketIOMessageReceived(chatMessages, targetUserName, setChatMessages, link) {

    //     console.log("1111111111111111 LEN SOCKET", chatMessages[0]?.receiverUsername, chatMessages[0]?.senderUsername, targetUserName);
    //     socketService?.socket?.on('message received', (data) => {
    //         console.log(link);
    //         console.log("2222222222222222222, LEN SOCKET", chatMessages, targetUserName

    //         );
    //         if (data.senderUsername.toLowerCase() === targetUserName || data.receiverUsername.toLowerCase() === targetUserName) {



    //             console.log("======------------conditionok", chatMessages, targetUserName)


    //             let newChatMessages = [...chatMessages];
    //             console.log("ADD")

    //             console.log(newChatMessages[0], "------", data);
    //             newChatMessages.push(data);

    //             console.log("socketio:receive", data, newChatMessages);
    //             setChatMessages([...newChatMessages]);






    //         }
    //     });

    //     // socketService?.socket?.on('message read', (data) => {
    //     //     let newChatMessages = [...chatMessages];
    //     //     if (data.senderUsername.toLowerCase() === targetUserName || data.receiverUsername.toLowerCase() === targetUserName) {
    //     //         const findMessageIndex = newChatMessages.findIndex(el => el._id === data._id)
    //     //         if (findMessageIndex > -1) {
    //     //             newChatMessages.splice(findMessageIndex, 1, data);

    //     //             setChatMessages(chatMessages);
    //     //         }
    //     //     }
    //     // });
    // }

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
