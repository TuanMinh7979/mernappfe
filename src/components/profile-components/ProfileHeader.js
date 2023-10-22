import ImageGridModal from "@components/Image-grid-modal/ImageGridModal";
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import Button from "@root/base-components/button/Button";
import Spinner from "@root/base-components/spinner/Spinner";
import Avatar from "@components/avatar/Avatar";
import Input from "@root/base-components/input/Input";
import { FaCamera } from "react-icons/fa";
import { Utils } from "@services/utils/utils.service";
import "./styles/ProfileHeader.scss";
import ProfileHeaderSkeleton from "./ProfileHeaderSkeleton";
const ProfileHeader = ({
  user,
  loading,
  fromDbBackgroundUrl,
  onClick,
  tab,
  hasImage,
  tabItems,
  hasError,
  hideSettings,
  onSelectFile,
  saveImage,
  cancelSaveChanges,

  galleryImages,
}) => {
  const [selectedBackgroundUrl, setSelectedBackgroundUrl] = useState("");
  const [selectedProfileImageUrl, setSelectedProfileImageUrl] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const [isOpenBackgroundDropdown, setIsOpenBackgroundDropdown] =
    useState(false);
  const [showGalleryImagesModal, setShowGalleryImagesModal] = useState(false);
  const backgroundFileRef = useRef();
  const profileImageRef = useRef();

  const hideSaveChangesContainer = () => {
    setSelectedBackgroundUrl("");
    setSelectedProfileImageUrl("");
    setShowSpinner(false);
  };

  useEffect(() => {
    if (!hasImage) {
      setShowSpinner(false);
    }
  }, [hasImage]);

  const BackgroundSelectDropdown = () => {
    return (
      <nav className="menu">
        <ul>
          {galleryImages.length > 0 && (
            <li
              onClick={() => {
                setShowGalleryImagesModal(true);
                setIsOpenBackgroundDropdown(false);
              }}
            >
              <div className="item">Select</div>
            </li>
          )}
          <li
            onClick={() => {
              backgroundFileRef.current.click();
              setIsOpenBackgroundDropdown(false);
              setShowGalleryImagesModal(false);
            }}
          >
            <div className="item">Upload</div>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      {showGalleryImagesModal && (
        <ImageGridModal
          images={galleryImages}
          closeModal={() => setShowGalleryImagesModal(false)}
          onSelectImage={(data) => {
            setSelectedBackgroundUrl(
              Utils.getImage(data?.imgId, data?.imgVersion)
            );
            onSelectFile(data, "updatebackground");
          }}
        />
      )}

      {loading ? (
        <ProfileHeaderSkeleton tabItems={tabItems} />
      ) : (
        <div className="profile-top" >
          {hasImage && (
            <div
              className="save-changes-container"
           
            >
              <div className="save-changes-box">
                <div className="spinner-container">
                  {showSpinner && !hasError && <Spinner bgColor="white" />}
                </div>
                <div className="save-changes-buttons">
                  <div className="save-changes-buttons-bg">
                    <Button
                      label="Cancel"
                      className="cancel change-btn"
                      disabled={false}
                      handleClick={() => {
                        setShowSpinner(false);
                        cancelSaveChanges();
                        hideSaveChangesContainer();
                      }}
                    />
                    <Button
                      label="Save Changes"
                      className="save change-btn"
                      disabled={false}
                      handleClick={() => {
                        setShowSpinner(true);
                        saveImage()
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            data-testid="profile-top-image"
            className="profile-top-image"
            style={{ background: user?.avatarColor }}
          >
            {!selectedBackgroundUrl && !fromDbBackgroundUrl && (
              <h3>No background image</h3>
            )}
            {selectedBackgroundUrl ? (
              // show new choosed image
              <img src={selectedBackgroundUrl} alt="" />
            ) : (
              // show existing image
              <img src={fromDbBackgroundUrl} alt="" />
            )}
          </div>
          <div className="profile-top-data" >
            <div
              className="profile-pic"
              style={{
                width: `${user?.profilePicture ? "180px" : ""}`,
              
              }}
            >
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={180}
                avatarSrc={selectedProfileImageUrl || user?.profilePicture}
              />

              {hideSettings && (
                <div
                  className="profile-pic-select"
                  data-testid="profile-pic-select"
                >
                  <Input
                    type="file"
                    ref={profileImageRef}
                    className="inputFile"
                    name="profile"
                    onClick={() => {
                      if (profileImageRef.current) {
                        profileImageRef.current.value = null;
                      }
                    }}
                    handleChange={(e) => {
                      setSelectedProfileImageUrl(
                        URL.createObjectURL(e.target.files[0])
                      );

                      onSelectFile(e.target.files[0], "profile");
                    }}
                  />
                  <label onClick={() => profileImageRef.current.click()}>
                    <FaCamera className="camera" />
                  </label>
                </div>
              )}
            </div>
            <div className="profile-name">{user?.username}</div>
            {hideSettings && (
              <div className="profile-select-image">
                <Input
                  name="background"
                  ref={backgroundFileRef}
                  type="file"
                  className="inputFile"
                  onClick={() => {
                    if (backgroundFileRef?.current) {
                      backgroundFileRef.current.value = null;
                    }
                  }}
                  handleChange={(e) => {
                    setSelectedBackgroundUrl(
                      URL.createObjectURL(e.target.files[0])
                    );

                    onSelectFile(e.target.files[0], "background");
                  }}
                />
                <label
                  data-testid="add-cover-photo"
                  onClick={() =>
                    setIsOpenBackgroundDropdown(!isOpenBackgroundDropdown)
                  }
                >
                  <FaCamera className="camera" /> <span>Add Cover Photo</span>
                </label>
                {isOpenBackgroundDropdown && <BackgroundSelectDropdown />}
              </div>
            )}
          </div>
          <div className="profile-top-items">
            <ul className="banner-nav">
              {tabItems.map((data) => (
                <div key={data.key} data-testid="tab-elements">
                  {data.show && (
                    <li className="banner-nav-item">
                      <div
                        className={`banner-nav-item-name ${tab === data.key.toLowerCase() ? "active" : ""
                          }`}
                        onClick={() => onClick(data.key.toLowerCase())}
                      >
                        {data.icon}
                        <p className="title">{data.key}</p>
                      </div>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool,
  fromDbBackgroundUrl: PropTypes.string,
  onClick: PropTypes.func,
  tab: PropTypes.string,
  hasImage: PropTypes.bool,
  tabItems: PropTypes.array,
  hasError: PropTypes.bool,
  hideSettings: PropTypes.bool,
  onSelectFile: PropTypes.func,
  saveImage: PropTypes.func,
  cancelSaveChanges: PropTypes.func,

  galleryImages: PropTypes.array,
};

export default ProfileHeader;
