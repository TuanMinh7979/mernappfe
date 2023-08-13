import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updatePost } from '@redux/reducers/post/post.reducer';
import './PostPrivacySelectDropdown.scss';

const PostPrivacySelectDropdown = ({ isActive, setSelectedItem, items = [] }) => {
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const selectItem = (item) => {
    //  ! STATE
    setSelectedItem(item);
    //  ! REDUX :
    dispatch(updatePost({ privacy: item.topText }));
  };

  return (
    <div className="menu-container" data-testid="menu-container">
      <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
        <ul>
          {items.map((item, index) => (
            <li data-testid="select-dropdown" key={index} onClick={() => selectItem(item)}>
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-text">
                <div className="menu-text-header">{item.topText}</div>
                <div className="sub-header">{item.subText}</div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

PostPrivacySelectDropdown.propTypes = {
  isActive: PropTypes.bool,
  setSelectedItem: PropTypes.func,
  items: PropTypes.array
};

export default PostPrivacySelectDropdown;
