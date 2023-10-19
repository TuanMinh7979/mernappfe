import Avatar from "@components/avatar/Avatar";
import Input from "@components/input/Input";
import { Utils } from "@services/utils/utils.service";
import { FaSearch, FaTimes } from "react-icons/fa";

import "@components/chat/list/ChatSidebar.scss";
import "./ChatSidebar.scss";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import SearchList from "./search-list/SearchList";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { userService } from "@services/api/user/user.service";

import { chatService } from "@services/api/chat/chat.service";
import { ChatUtils } from "@services/utils/chat-utils.service.";


import { timeAgo } from "@services/utils/time.ago.utils";
import PreviewChatMessage from "./PreviewChatMessage";
import { createSearchParams } from "react-router-dom";
import { updateConversationList } from "@redux/reducers/chat/chat.reducer";

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile, token } = useSelector((state) => state.user);
  const { conversationList } = useSelector((state) => state.chat);

  //  for SearchListComponent
  const [userSearchText, setUserSearchText] = useState("");
  const [userSearchResult, setUserSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  //  END for SearchListComponent
  // let [conversationList, setToShowConversationList] = useState([]);

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
        Utils.displayError(error ,dispatch);
      }
    },
    [dispatch]
  );

  //  END init user list



  useEffect(() => {
    if (userSearchText) {
      const timer = setTimeout(() => searchUser(userSearchText), 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [userSearchText]);

  const callUpdateConversationListAction = (data) => {
    dispatch(updateConversationList(data))

  }


  const onConversationClick = async (newestMessageCvsData) => {
    try {
      const params = ChatUtils.makeDetailConversationUrlParam(
        newestMessageCvsData,
        profile
      );

      const receiverId =
        newestMessageCvsData?.receiverUsername !== profile?.username
          ? newestMessageCvsData?.receiverId
          : newestMessageCvsData?.senderId;

      ChatUtils.joinConversation(profile, newestMessageCvsData.conversationId);
      navigate(`${location.pathname}?${createSearchParams(params)}`);

      if (
        newestMessageCvsData?.receiverUsername === profile?.username &&
        !newestMessageCvsData.isRead
      ) {
        await chatService.markMessagesAsRead(profile?._id, receiverId);
      }
    } catch (error) {

      Utils.displayError(error ,dispatch);
    }
  };

  const addNewItemToConversationList = (user) => {
    const newUser = {
      receiverId: user?._id,
      receiverUsername: user?.username,
      receiverAvatarColor: user?.avatarColor,
      receiverProfilePicture: user?.profilePicture,
      senderUsername: profile?.username,
      senderId: profile?._id,
      senderAvatarColor: profile?.avatarColor,
      senderProfilePicture: profile?.profilePicture,
      body: "",
    };
    let newConversationList = [...conversationList]
    const findUser = newConversationList.find(
      (chat) => chat.receiverId === user._id || chat.senderId === user._id
    );
    if (!findUser) {
      newConversationList = [newUser, ...newConversationList];
      callUpdateConversationListAction([...newConversationList]);
    }

    const url = `${location.pathname}?${createSearchParams({
      username: user.username.toLowerCase(),
      id: user._id,
    })}`;

    ChatUtils.joinConversation(profile, "");

    navigate(url);
  };
  const removeInitConversation = (message) => {
    let tmp = [...conversationList];
    tmp = tmp.filter((el) => el.receiverUsername !== message.receiverUsername);
    callUpdateConversationListAction([...tmp]);
    ChatUtils.joinConversation(profile, "");

    return navigate("/app/social/chat/messages");
  };



  return (
    <div data-testid="conversationList">
      <div className="conversation-container">
        <div
          className="conversation-container-header"

        >
          <div className="header-img">
            <Avatar
              name={profile?.username}
              bgColor={profile?.avatarColor}
              textColor="#ffffff"
              size={40}
              avatarSrc={profile?.profilePicture}
            />
          </div>
          <div className="title-text">{profile?.username}</div>
        </div>
        {/* search user box */}
        <div
          className="conversation-container-search"
          data-testid="search-container"
        >
          <FaSearch className="search" />
          <Input
            id="message"
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
            // close search input
            <FaTimes
              className="times"
              onClick={() => {
                setUserSearchText("");
                setIsSearching(false);
                setUserSearchResult([]);
              }}
            />
          )}
        </div>
        {/* END search user box */}
        {/* search result list  */}
        <div
          className="conversation-container-body"

        >
          {!userSearchText && (
            <div className="conversation">
              {conversationList.map((data) => {
                let deletedByMe = data?.deletedByUsers?.some(
                  (el) => el == profile._id
                );
                return (
                  <div
                    key={Utils.generateString(10)}
                    data-testid="conversation-item"
                    className={`conversation-item ${searchParams.get("username") ===
                      data?.receiverUsername.toLowerCase() ||
                      searchParams.get("username") ===
                      data?.senderUsername.toLowerCase()
                      ? "active"
                      : ""
                      }`}
                    onClick={() => {
                      onConversationClick(data);
                    }}
                  >
                    <div className="avatar">
                      <Avatar
                        name={
                          data.receiverUsername !== profile?.username
                            ? data.receiverUsername
                            : data?.senderUsername
                        }
                        bgColor={
                          data.receiverUsername === profile?.username
                            ? data.receiverAvatarColor
                            : data?.senderAvatarColor
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
                    <div
                      className={`title-text ${
                        // selectedUser &&
                        !data.body ? "selected-user-text" : ""
                        }`}
                    >
                      {data.receiverUsername !== profile?.username
                        ? data.receiverUsername
                        : data?.senderUsername}
                    </div>
                    {data.body && data?.createdAt && (
                      <div className="created-date">
                        {timeAgo.transform(data?.createdAt)}
                      </div>
                    )}
                    {!data?.body && (
                      <div

                        className="created-date"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeInitConversation(data);
                        }}
                      >
                        <FaTimes />
                      </div>
                    )}
                    {data?.body && !deletedByMe && !data.deleteForEveryone && (
                      <PreviewChatMessage data={data} profile={profile} />
                    )}
                    {!deletedByMe && data?.deleteForEveryone && (
                      <div className="conversation-message">
                        <span className="message-deleted">
                          message returned
                        </span>
                      </div>
                    )}
                    {deletedByMe && !data.deleteForEveryone && (
                      <div className="conversation-message">
                        <span className="message-deleted">message deleted</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* search list */}

          <SearchList
            userSearchText={userSearchText}
            setUserSearchText={setUserSearchText}
            userSearchResult={userSearchResult}
            setUserSearchResult={setUserSearchResult}
            isSearching={isSearching}
            setIsSearching={setIsSearching}

            addNewItemToConversationList={addNewItemToConversationList}
          />
        </div>
        {/* END search result list  */}
      </div>
    </div>
  );
};
export default ChatSidebar;