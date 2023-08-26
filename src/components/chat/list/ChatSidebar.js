import Avatar from '@components/avatar/Avatar';
import Input from '@components/input/Input';
import { Utils } from '@services/utils/utils.service';
import { FaSearch, FaTimes } from 'react-icons/fa';

import '@components/chat/list/ChatSidebar.scss';
import "./ChatSidebar.scss"
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
import PreviewChatMessage from './PreviewChatMessage';
import { createSearchParams } from 'react-router-dom';
const ChatSidebar = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    //   
    const { profile } = useSelector((state) => state.user);
    const { conversationList } = useSelector((state) => state.chat);

    // ? for SearchListComponent
    const [userSearchText, setUserSearchText] = useState('');


    const [userSearchResult, setUserSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [componentType, setComponentType] = useState('conversationList');

    // ? END for SearchListComponent
    let [toShowConversationList, setToShowConversationList] = useState([]);





    useEffect(() => {

        setToShowConversationList([...conversationList])
    }, [conversationList])

    useEffect(() => {
        if (userSearchText) {
            const timer = setTimeout(() =>
                searchUser(userSearchText), 500
            );
            return () => {
                clearTimeout(timer);
            };
        }
    }, [userSearchText])

    // ? init user list

    //  * use in useEffect => use useCallback
    const searchUser = useCallback(
        async (query) => {

            try {
                setIsSearching(true);
                if (query) {

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
    // trigger searchParasm change:
    const updateToShowConversationsFromSelectedUser = useCallback(
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
            console.log(user, toShowConversationList);
            const findUser = toShowConversationList.find(

                (chat) => chat.receiverId === user.receiverId || chat.senderId === user.receiverId

            );
            if (!findUser) {

                const newConversationList = [newUser, ...toShowConversationList];
                setToShowConversationList(newConversationList);

                dispatch(updateChatSelectedUser({ isLoading: false, user: newUser }));
                // const userTwoName =
                //     newUser?.receiverUsername !== profile?.username ? newUser?.receiverUsername : newUser?.senderUsername;
                // ! Service:
                // chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });

            }
        },
        [searchParams]
    );
    // ? END add user to chat list(conversationlist)

    // 
    useEffect(() => {
        if (selectedUser && componentType === 'searchList') {
            // * navigate to new url
            updateToShowConversationsFromSelectedUser(selectedUser);

        }
    }, [componentType, selectedUser]);



    const removeSelectedUserFromList = (event) => {
        // event.stopPropagation();
        // toShowConversationList = cloneDeep(toShowConversationList);
        // const userIndex = findIndex(toShowConversationList, ['receiverId', searchParams.get('id')]);
        // if (userIndex > -1) {
        //     toShowConversationList.splice(userIndex, 1);
        //     setSelectedUser(null);
        //     setToShowConversationList(toShowConversationList);
        //     ChatUtils.updatedSelectedChatUser({
        //         toShowConversationList,
        //         profile,
        //         username: searchParams.get('username'),
        //         setSelectedChatUser: updateChatSelectedUser,
        //         params: toShowConversationList.length ? updateQueryParams(toShowConversationList[0]) : null,
        //         pathname: location.pathname,
        //         navigate,
        //         dispatch
        //     });
        // }
    }




    // this is for when a user already exist in the chat list
    const onConversationClick = async (newestMessageCvsData) => {
        try {
            // TODO
            // const sender = find(
            //     ChatUtils.chatUsers,
            //     (userData) =>
            //         userData.userOne === profile?.username && userData.userTwo === searchParams.get('username')
            // );

            dispatch(updateChatSelectedUser({ isLoading: false, user: newestMessageCvsData }));

            const params = ChatUtils.makeDetailConversationUrlParam(newestMessageCvsData, profile);
            ChatUtils.joinRoomEvent(newestMessageCvsData, profile);
            ChatUtils.privateChatMessages = [];
            // const userTwoName = newestMessageCvsData?.receiverUsername !== profile?.username ? newestMessageCvsData?.receiverUsername : newestMessageCvsData?.senderUsername;
            // const targetUserId = newestMessageCvsData?.receiverUsername !== profile?.username ? newestMessageCvsData?.receiverId : newestMessageCvsData?.senderId;
            // console.log("PARAMS FOR DETAIL CONVERSATION URL", params);

            navigate(`${location.pathname}?${createSearchParams(params)}`);
            // if (sender) {
            //     chatService.removeChatUsers(sender);
            // }
            // TODO
            // chatService.addChatUsers({ userOne: profile?.username, userTwo: userTwoName });
            // if (newestMessageCvsData?.receiverUsername === profile?.username && !newestMessageCvsData.isRead) {
            //     await chatService.markMessagesAsRead(profile?._id, targetUserId);
            // }
        } catch (error) {
            console.log(error);
            Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
        }
    };



    useEffect(() => {

        ChatUtils.socketIOConversations(profile, toShowConversationList, setToShowConversationList);


    }, [toShowConversationList]);

    console.log("toShowConversationList", toShowConversationList);
    return (
        <div data-testid="conversationList" >
            <div className="conversation-container">
                <div className="conversation-container-header" style={{ border: "1px solid red" }}>
                    <div className="header-img">
                        <Avatar name={profile?.username} bgColor={profile?.avatarColor} textColor="#ffffff" size={40}
                            avatarSrc={profile?.profilePicture} />
                    </div>
                    <div className="title-text">{profile?.username}</div>
                </div>
                {/* search user box */}
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
                            setIsSearching(true)
                            setUserSearchText(event.target.value);

                        }}
                    />
                    {userSearchText && (
                        // close search input 
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
                {/* END search user box */}
                {/* search result list  */}
                <div className="conversation-container-body" style={{ border: "1px solid red" }}>
                    {!userSearchText && (
                        <div className="conversation">
                            {toShowConversationList.map((data) => {

                                return (<div key={Utils.generateString(10)} data-testid="conversation-item"
                                    className={`conversation-item ${searchParams.get('username') === data?.receiverUsername.toLowerCase() ||
                                        searchParams.get('username') === data?.senderUsername.toLowerCase()
                                        ? 'active'
                                        : ''
                                        }`}
                                    onClick={() => {
                                        console.log("}}}}}}}}}}}}}}}}}");
                                        onConversationClick(data)
                                    }}
                                >

                                    <div className="avatar">
                                        <Avatar
                                            name={data.receiverUsername !== profile?.username ? data.receiverUsername : data?.senderUsername}
                                            bgColor={
                                                data.receiverUsername === profile?.username ? data.receiverAvatarColor : data?.senderAvatarColor
                                            }
                                            textColor="#ffffff"
                                            size={40}
                                            avatarSrc={
                                                data.receiverUsername !== profile?.username
                                                    ? data?.receiverProfilePicture
                                                    : data?.senderProfilePicture
                                            }

                                        />
                                    </div>
                                    <div className={`title-text ${selectedUser && !data.body ? 'selected-user-text' : ''}`}>
                                        {data.receiverUsername !== profile?.username ? data.receiverUsername : data?.senderUsername}
                                    </div>
                                    {data.body && data?.createdAt && <div className="created-date">{timeAgo.transform(data?.createdAt)}</div>}
                                    {!data?.body && (
                                        <div className="created-date" onClick={removeSelectedUserFromList}>


                                            <FaTimes />
                                        </div>
                                    )}
                                    {data?.body && !data?.deleteForMe && !data.deleteForEveryone && (

                                        <PreviewChatMessage data={data} profile={profile} />
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
                                        <PreviewChatMessage data={data} profile={profile} />

                                    )}

                                </div>)
                            }

                            )}
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
                {/* END search result list  */}
            </div>
        </div>
    );
};
export default ChatSidebar;
