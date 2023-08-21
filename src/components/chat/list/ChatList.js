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
const ChatList = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    //   
    const { profile } = useSelector((state) => state.user);
    const { chatList } = useSelector((state) => state.chat);

    // ? for SearchListComponent
    const [search, setSearch] = useState('');
    const debouncedValue = useDebounce(search, 1000);
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [componentType, setComponentType] = useState('chatList');

    // ? END for SearchListComponent
    let [chatMessageList, setChatMessageList] = useState([]);


    // 

    useEffect(() => {
        console.log(selectedUser, componentType, chatMessageList);
        setChatMessageList([...chatList])
    }, [chatList])

    useEffect(() => {
        if (debouncedValue) {
            // search very 1000s
            initUserList(debouncedValue)
        }
    }, [debouncedValue])

    // ? init user list

    //  * use in useEffect => use useCallback
    const initUserList = useCallback(
        async (query) => {

            try {
                setSearch(query);
                if (query) {
                    setIsSearching(true);
                    const response = await userService.searchUsers(query);
                    setSearchResult(response.data.search);
                    setIsSearching(false);
                }
            } catch (error) {
                setIsSearching(false);
                Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
            }
        },
        [dispatch]
    );

    // ? END init user list



    return (
        <div data-testid="chatList">
            <div className="conversation-container">
                <div className="conversation-container-header">
                    <div className="header-img">
                        <Avatar name={profile?.username} bgColor={profile?.avatarColor} textColor="#ffffff" size={40}
                            avatarSrc={profile?.profilePicture} />
                    </div>
                    <div className="title-text">{profile?.username}</div>
                </div>

                <div className="conversation-container-search" data-testid="search-container">
                    <FaSearch className="search" />
                    <Input id="message"
                        value={search}
                        name="message"
                        type="text"
                        className="search-input"
                        labelText=""
                        placeholder="Search"

                        handleChange={(event) => {
                            setIsSearching(true);
                            setSearch(event.target.value);
                        }}
                    />
                    {search && (
                        <FaTimes
                            className="times"
                            onClick={() => {
                                setSearch('');
                                setIsSearching(false);
                                setSearchResult([]);
                            }}
                        />
                    )}
                </div>

                <div className="conversation-container-body">
                    <div className="conversation">
                        {[].map((data) => (
                            <div key={Utils.generateString(10)} data-testid="conversation-item" className="conversation-item">
                                <div className="avatar">
                                    <Avatar name="placeholder" bgColor="red" textColor="#ffffff" size={40} avatarSrc="" />
                                </div>
                                <div className="title-text">
                                    Danny
                                </div>
                                <div className="created-date">1 hr ago</div>
                                <div className="created-date" >
                                    <FaTimes />
                                </div>

                                <div className="conversation-message">
                                    <span className="message-deleted">message deleted</span>
                                </div>
                                <div className="conversation-message">
                                    <span className="message-deleted">message deleted</span>
                                </div>

                            </div>
                        ))}
                    </div>




                    {/* search list */}
                    <SearchList
                        searchTerm={search}
                        result={searchResult}
                        isSearching={isSearching}
                        setSearchResult={setSearchResult}
                        setIsSearching={setIsSearching}
                        setSearch={setSearch}
                        setSelectedUser={setSelectedUser}
                        setComponentType={setComponentType}
                    />
                </div>
            </div>
        </div>
    );
};
export default ChatList;
