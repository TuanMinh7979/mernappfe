import Avatar from "@components/avatar/Avatar";
import PostPrivacySelectDropdown from "@components/select-dropdown/PostPrivacySelectDropdown";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import { privacyList } from "@services/utils/static.data";
import { useCallback, useEffect, useRef } from "react";
import { FaGlobe } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

const AddPostHeader = ({ privacyObject }) => {
  const { profile } = useSelector((state) => state.user);

  const feeling = useSelector((state) => state.post.feelings);
  const privacyRef = useRef(null);
  const [selectedPrivacy, setSelectedPrivacy] = useState({ ...privacyObject });
  const [isPrivacySelectActive, setIsPrivacySelectActive] =
    useDetectOutsideClick(privacyRef, false);

  return (
    <div
    
      className="modal-box-content"
      data-testid="modal-box-content"
    >
      <div className="user-post-image" data-testid="box-avatar">
        <Avatar
          name={profile?.username}
          bgColor={profile?.avatarColor}
          textColor="#ffffff"
          size={40}
          avatarSrc={profile?.profilePicture}
        />
      </div>
      <div className="modal-box-info">
        <h5 className="inline-title-display" data-testid="box-username">
          {profile.username}
        </h5>

        {feeling?.name && (
          <p className="inline-display" data-testid="box-feeling">
            is feeling{" "}
            <img className="feeling-icon" src={`${feeling?.image}`} alt="" />
            <span>{feeling.name}</span>
          </p>
        )}
        <div
          data-testid="box-text-display"
          className="time-text-display"
          onClick={() => setIsPrivacySelectActive(!isPrivacySelectActive)}
        >
          <div className="selected-item-text" data-testid="box-item-text">
            {selectedPrivacy.topText}
          </div>
          <div ref={privacyRef}>
            <PostPrivacySelectDropdown
              isActive={isPrivacySelectActive}
              items={privacyList}
              setSelectedItem={setSelectedPrivacy}
            ></PostPrivacySelectDropdown>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddPostHeader;
