import Avatar from '@components/avatar/Avatar';
import Input from '@components/input/Input';
import { Utils } from '@services/utils/utils.service';
import { FaSearch, FaTimes } from 'react-icons/fa';

import '@components/chat/list/ChatList.scss';
import "./ChatList.scss"
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import SearchList from './search-list/SearchList';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { userService } from '@services/api/user/user.service';
import useDebounce from '@hooks/useDebounce';
import { chatService } from '@services/api/chat/chat.service';
import { ChatUtils } from '@services/utils/chat-utils.service.';
import { cloneDeep, find, findIndex } from 'lodash';
import { updateChatSelectedUser } from '@redux/reducers/chat/chat.reducer';
import { timeAgo } from '@services/utils/time.ago.utils';
import ChatListBody from './ChatListBody';
import { createSearchParams } from 'react-router-dom';
const ChatList = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    //   
    const { profile } = useSelector((state) => state.user);
    const { chatList } = useSelector((state) => state.chat);

    // ? for SearchListComponent
    const [userSearchText, setUserSearchText] = useState('');
    const debouncedValue = useDebounce(userSearchText, 1000);
    const [userSearchResult, setUserSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [componentType, setComponentType] = useState('chatList');

    // ? END for SearchListComponent
    let [chatMessageList, setChatMessageList] = useState([]);





    useEffect(() => {
        console.log(selectedUser, componentType, chatMessageList);
        setChatMessageList([...chatList])
    }, [chatList])

    useEffect(() => {
        if (debouncedValue) {
            // userSearchText very 1000s
            initUserList(debouncedValue)
        }
    }, [debouncedValue])

    // ? init user list

    //  * use in useEffect => use useCallback
    const initUserList = useCallback(
        async (query) => {

            try {
                setUserSearchText(query);
                if (query) {
                    setIsSearching(true);
                    const response = await userService.searchUsers(query);
                    setUserSearchResult(response.data.search);
                    setIsSearching(false);
                }
            } catch (error) {
                setIsSearching(false);
                Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
            }
        },
        [dispatch]
    );

    // ? END init user list


    // ? add user to chat list(conversationlist)
    // api /chat/message/add-chat-users
    // trigger when searchList component item onclick
    const addSelectedUserToList = useCallback(
        (user) => {
            const newUser = {
                receiverId: user?._id,
                receiverUsername: user?.username,
                receiverAvatarColor: user?.avatarColor,
                receiverProfilePicture: user?.profilePicture,
                senderUsername: profile?.username,
                senderId: profile?._id,
                senderAvatarColor: profile?.avatarColor,
                senderProfilePicture: profile?.profilePicture,
                body: ''
            };
            ChatUtils.joinRoomEvent(user, profile);
            ChatUtils.privateChatMessages = [];
            const findUser = find(
                chatMessageList,
                (chat) => chat.receiverId === searchParams.get('id') || chat.senderId === searchParams.get('id')
            );
            if (!findUser) {
                const newChatList = [newUser, ...chatMessageList];
                setChatMessageList(newChatList);
                if (!chatList.length) {
                    dispatch(updateChatSelectedUser({ isLoading: false, user: newUser }));
                    const userTwoName =
                        newUser?.receiverUsername !== profile?.username ? newUser?.receiverUsername : newUser?.senderUsername;
                    // ! Service:
                    chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
                }
            }
        },
        [chatList, chatMessageList, dispatch, searchParams, profile]
    );
    // ? END add user to chat list(conversationlist)

    // 
    useEffect(() => {
        if (selectedUser && componentType === 'searchList') {
            // * navigate to new url
            addSelectedUserToList(selectedUser);

        }
    }, [addSelectedUserToList, componentType, selectedUser]);


    const updateQueryParams = (user) => {
        setSelectedUser(user);
        const params = ChatUtils.chatUrlParams(user, profile);
        ChatUtils.joinRoomEvent(user, profile);
        ChatUtils.privateChatMessages = [];
        return params;
      };
    const removeSelectedUserFromList = (event) => {
        event.stopPropagation();
        chatMessageList = cloneDeep(chatMessageList);
        const userIndex = findIndex(chatMessageList, ['receiverId', searchParams.get('id')]);
        if (userIndex > -1) {
            chatMessageList.splice(userIndex, 1);
            setSelectedUser(null);
            setChatMessageList(chatMessageList);
            ChatUtils.updatedSelectedChatUser({
                chatMessageList,
                profile,
                username: searchParams.get('username'),
                setSelectedChatUser: updateChatSelectedUser,
                params: chatMessageList.length ? updateQueryParams(chatMessageList[0]) : null,
                pathname: location.pathname,
                navigate,
                dispatch
            });
        }
    }

    console.log(chatMessageList);


    // this is for when a user already exist in the chat list
  const addUsernameToUrlQuery = async (user) => {
    try {
      const sender = find(
        ChatUtils.chatUsers,
        (userData) =>
          userData.userOne === profile?.username && userData.userTwo.toLowerCase() === searchParams.get('username')
      );
      const params = updateQueryParams(user);
      const userTwoName = user?.receiverUsername !== profile?.username ? user?.receiverUsername : user?.senderUsername;
      const receiverId = user?.receiverUsername !== profile?.username ? user?.receiverId : user?.senderId;
      navigate(`${location.pathname}?${createSearchParams(params)}`);
      if (sender) {
        chatService.removeChatUsers(sender);
      }
      chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
      if (user?.receiverUsername === profile?.username && !user.isRead) {
        await chatService.markMessagesAsRead(profile?._id, receiverId);
      }
    } catch (error) {
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
    }
  };
    return (
        <div data-testid="chatList" style={{ backgroundColor: "grey" }}>
            <div className="conversation-container">
                <div className="conversation-container-header" style={{ border: "1px solid red" }}>
                    <div className="header-img">
                        <Avatar name={profile?.username} bgColor={profile?.avatarColor} textColor="#ffffff" size={40}
                            avatarSrc={profile?.profilePicture} />
                    </div>
                    <div className="title-text">{profile?.username}</div>
                </div>

                <div className="conversation-container-search" data-testid="search-container">
                    <FaSearch className="search" />
                    <Input id="message"
                        value={userSearchText}
                        name="message"
                        type="text"
                        className="search-input"
                        labelText=""
                        placeholder="Search"

                        handleChange={(event) => {
                            setIsSearching(true);
                            setUserSearchText(event.target.value);
                        }}
                    />
                    {userSearchText && (
                        <FaTimes
                            className="times"
                            onClick={() => {
                                setUserSearchText('');
                                setIsSearching(false);
                                setUserSearchResult([]);
                            }}
                        />
                    )}
                </div>

                <div className="conversation-container-body" style={{ border: "1px solid red" }}>
                    {!userSearchText && (
                        <div className="conversation">
                            {chatMessageList.map((data) => (
                                <div key={Utils.generateString(10)} data-testid="conversation-item"


                                    className={`conversation-item ${searchParams.get('username') === data?.receiverUsername.toLowerCase() ||
                                        searchParams.get('username') === data?.senderUsername.toLowerCase()
                                        ? 'active'
                                        : ''
                                        }`}

                                >

                                    <div className="avatar">
                                        <Avatar
                                            name={data.receiverUsername === profile?.username ? profile?.username : data?.senderUsername}
                                            bgColor={
                                                data.receiverUsername === profile?.username ? data.receiverAvatarColor : data?.senderAvatarColor
                                            }
                                            textColor="#ffffff"
                                            size={40}
                                            avatarSrc={
                                                data.receiverUsername !== profile?.username
                                                    ? data?.receiver?.ProfilePicture
                                                    : data?.sender?.ProfilePicture
                                            }

                                        />
                                    </div>
                                    <div className={`title-text ${selectedUser && !data.body ? 'selected-user-text' : ''}`}>
                                        {data.receiverUsername !== profile?.username ? data.receiverUsername : data?.senderUsername}
                                    </div>
                                    {data?.createdAt && <div className="created-date">{timeAgo.transform(data?.createdAt)}</div>}
                                    {!data?.body && (
                                        <div className="created-date" onClick={removeSelectedUserFromList}>
                                            <FaTimes />
                                        </div>
                                    )}
                                    {data?.body && !data?.deleteForMe && !data.deleteForEveryone && (

                                        <ChatListBody data={data} profile={profile} />
                                    )}
                                    {data?.deleteForMe && data?.deleteForEveryone && (
                                        <div className="conversation-message">
                                            <span className="message-deleted">message deleted</span>
                                        </div>
                                    )}
                                    {data?.deleteForMe && !data.deleteForEveryone && data.senderUsername !== profile?.username && (
                                        <div className="conversation-message">
                                            <span className="message-deleted">message deleted</span>
                                        </div>
                                    )}
                                    {data?.deleteForMe && !data.deleteForEveryone && data.receiverUsername !== profile?.username && (
                                        <ChatListBody data={data} profile={profile} />

                                    )}

                                </div>
                            ))}
                        </div>)}




                    {/* search list */}
                    <SearchList
                        userSearchText={userSearchText}
                        setUserSearchText={setUserSearchText}

                        userSearchResult={userSearchResult}
                        setUserSearchResult={setUserSearchResult}

                        isSearching={isSearching}
                        setIsSearching={setIsSearching}


                        setSelectedUser={setSelectedUser}
                        setComponentType={setComponentType}
                    />
                </div>
            </div>
        </div>
    );
};
export default ChatList;
