import Avatar from '@components/avatar/Avatar';
import Button from '@root/base-components/button/Button';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Suggestions.scss'
import { Utils } from '@services/utils/utils.service';
import { followerService } from '@services/api/follow/follow.service';
import { filter } from 'lodash';
import { updateSugUsersNewEle } from '@redux/reducers/suggestions/suggestions.reducer';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import { socketService } from '@services/socket/socket.service';

const Suggestions = () => {
  const { suggestions } = useSelector((state) => state);

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const followUser = async (user) => {
    try {

      await followerService.save(user._id);
  
      const result = filter(users, (data) => data?._id !== user?._id);
      setUsers(result);
      dispatch(updateSugUsersNewEle({ users: result, isLoading: false }));
    } catch (error) {
      alert(error)

      Utils.displayError(error, dispatch);
    }
  };

  useEffect(() => {
    setUsers(suggestions?.users);
  }, [suggestions, users]);

  return (
    <div className="suggestions-list-container" data-testid="suggestions-container">
      <div className="suggestions-header">
        <div className="title-text">Other people</div>
      </div>
      <hr />
      <div className="suggestions-container">
        <div className="suggestions">
          {users?.map((user) => (
            <div data-testid="suggestions-item" onClick={() => { ProfileUtils.navigateToProfile(user, navigate) }} className="suggestions-item" key={user?._id}>
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={user?.profilePicture}
              />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button
                  label="Follow"
                  className="button follow"
                  disabled={false}
                  handleClick={(e) => {
                    e.stopPropagation()
                    followUser(user)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {users?.length > 8 && (
          <div className="view-more"
            onClick={() => navigate('/people')}>
            View More
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
