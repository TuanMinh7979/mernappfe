import PropTypes from 'prop-types';
import './SearchList.scss';
import Avatar from '@components/avatar/Avatar';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';

const SearchList = ({

  userSearchText,
  setUserSearchText,


  userSearchResult,
  setUserSearchResult,

  isSearching,
  setIsSearching,

  
  setSelectedUser,
  setComponentType
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const buildQueryUrl = (user) => {
    setComponentType('searchList');
    setSelectedUser(user);
    const url = `${location.pathname}?${createSearchParams({ username: user.username.toLowerCase(), id: user._id })}`;
    navigate(url);
    setUserSearchText('');
    setIsSearching(false);
    setUserSearchResult([]);
  };


  console.log(userSearchResult);
  return (
    <div className="search-result">
        SEARCH LIST
      <div className="search-result-container">
        {!isSearching && userSearchResult.length > 0 && (
          <>
            {userSearchResult.map((user) => (
              <div
                data-testid="search-result-item"
                className="search-result-container-item"
                key={user._id}
                onClick={() => buildQueryUrl(user)}
              >
                <Avatar
                  name={user.username}
                  bgColor={user.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={user.profilePicture}
                />
                <div className="username">{user.username}</div>
              </div>
            ))}
          </>
        )}

        {userSearchText && isSearching && userSearchResult.length === 0 && (
          <div className="search-result-container-empty" data-testid="searching-text">
            <span>Searching...</span>
          </div>
        )}

        {userSearchText && !isSearching && userSearchResult.length === 0 && (
          <div className="search-result-container-empty" data-testid="nothing-found">
            <span>Nothing found</span>
            <p className="search-result-container-empty-msg">We couldn&apos;t find any match for {userSearchText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

SearchList.propTypes = {
  userSearchResult: PropTypes.array,
  isSearching: PropTypes.bool,
  userSearchText: PropTypes.string,
  setSelectedUser: PropTypes.func,
  setUserSearchText: PropTypes.func,
  setIsSearching: PropTypes.func,
  setUserSearchResult: PropTypes.func,
  setComponentType: PropTypes.func
};

export default SearchList;
