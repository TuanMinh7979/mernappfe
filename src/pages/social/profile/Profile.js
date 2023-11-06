import React from "react";
import ProfileHeader from "@components/profile-components/ProfileHeader";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { Utils } from "@services/utils/utils.service";
import { userService } from "@services/api/user/user.service";
import { useParams, useSearchParams } from "react-router-dom";
import { tabItems } from "@services/utils/static.data";

import { imageService } from "@services/api/image/image.service";
import TimeLine from "@components/profile-components/TimeLine";
import Follow from "../../../components/profile-components/Follow";
import ChangePassword from "@components/profile-components/ChangePassword";
import NotificationSetting from "@components/profile-components/NotificationSetting";
import GalleryImage from "@components/gallery-image/GalleryImage";
import { updateModalIsDeleteDialogOpen } from "@redux/reducers/modal/modal.reducer";
import ImageModal from "@components/image-modal/ImageModal";
import "./Profile.scss";
import Dialog from "@root/base-components/dialog/Dialog";
import { useEffect } from "react";
import { updateLoggedUserProfile } from "@redux/reducers/user/user.reducer";

const Profile = () => {
  const { profile } = useSelector((state) => state.user);

  const { isDeleteDialogOpen } = useSelector((state) => state.modal);
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  // * get user background image  , profile image and posts

  const [hasError, setHasError] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  // type: File || string(url)
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState(null);
  //  type string(url)
  const [selectedBackgroundFromGallery, setSelectedBackgroundFromGallery] =
    useState({
      imgId: "",
      imgVersion: "",
    });
  // type: File
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState(null);

  const [fromDbBackgroundUrl, setFromDbBackgroundUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [userProfileData, setUserProfileData] = useState(null);

  const [displayContent, setDisplayContent] = useState("timeline");
  const [toDeleteGalleryImage, setToDeleteGalleryImage] = useState(null);

  const [galleryImageToShow, setGalleryImageToShow] = useState("");
  const [showGalleryImageModal, setShowGalleryImageModal] = useState(false);

  const changeTabContent = (data) => {
    setDisplayContent(data);
  };

  const onSelectFile = (data, type) => {
    setHasImage(!hasImage);
    if (type == "background") {
      setSelectedBackgroundImage(data);
    } else if (type == "updatebackground") {
      setSelectedBackgroundFromGallery({
        imgId: data.imgId,
        imgVersion: data.imgVersion,
      });
    } else {
      setSelectedProfileImageFile(data);
    }
  };

  const saveImageToDB = async (result) => {

    try {
      let url = selectedBackgroundImage ? "/images/background" : "/images/profile";
      let response;
      if (selectedBackgroundFromGallery.imgId && selectedBackgroundFromGallery.imgVersion) {
        response = await userService.updateBackgroundImage({
          bgImageVersion: selectedBackgroundFromGallery.imgVersion,
          bgImageId: selectedBackgroundFromGallery.imgId,
        });
      } else {

        if (url == "/images/profile") {
          response = await imageService.save(url, result);
          console.log(response);
          dispatch(updateLoggedUserProfile({ ...profile, profilePicture: response.data.url }))
        } else {

          response = await imageService.save(url, result);
        }
      }

      if (response) {
        Utils.displaySuccess(response.data.message, dispatch);
        setHasError(false);
        setHasImage(false);
      }
    } catch (error) {
      setHasError(true);
      Utils.displayError(error, dispatch);
    }
  };
  const saveImage = () => {
    const reader = new FileReader();
    // save base 64 to db
    reader.addEventListener(
      "load",
      async () => saveImageToDB(reader.result),

      false
    );

    if (
      selectedBackgroundImage &&
      typeof selectedBackgroundImage !== "string"
    ) {
      reader.readAsDataURL(Utils.renameFile(selectedBackgroundImage));
    } else if (
      selectedProfileImageFile &&
      typeof selectedProfileImageFile !== "string"
    ) {
      reader.readAsDataURL(Utils.renameFile(selectedProfileImageFile));
    } else {
      // it can be a link url (image that user has posted before in their post)
      saveImageToDB(selectedBackgroundFromGallery);
    }
  };

  const cancelSaveChanges = () => {
    setHasImage(!hasImage);
    setSelectedBackgroundImage("");
    setSelectedProfileImageFile("");
    setSelectedBackgroundFromGallery({
      imgId: "",
      imgVersion: ""
    });
    setHasError(false);
  };

  const getShowingImageUrlFromPost = (post) => {
    return post?.gifUrl
      ? post?.gifUrl
      : Utils.getImage(post?.imgId, post?.imgVersion);
  };



  const removeImageFromGallery = async (id) => {
    try {
      dispatch(updateModalIsDeleteDialogOpen(false));
      const images = galleryImages.filter((el) => el._id !== id);
      setGalleryImages(images);

      const response = await imageService.delete(`/images/${id}`);
      Utils.displaySuccess(response.data.message, dispatch);
    } catch (error) {
      Utils.displayError(error, dispatch);
    }
  };

  useEffect(() => {
    // asynchonus getUserProfileAndPosts and getsByUser start as the same
    async function initFetch() {
      try {
        const res = await userService.getProfileAndPost(
          username,
          searchParams.get("id")
        );

        setFromDbBackgroundUrl(
          Utils.getImage(
            res?.data?.user?.bgImageId,
            res?.data?.user?.bgImageVersion
          )
        );
        setUserProfileData(res.data);
        setUser(res.data.user);
        const res1 = await imageService.getsByUser(searchParams.get("id"));
        setGalleryImages(res1.data.images);

        setLoading(false);
      } catch (error) {
        Utils.displayError(error, dispatch);
      }
    }

    initFetch()

  }, []);
  return (
    <>
      {showGalleryImageModal && (
        <ImageModal
          image={galleryImageToShow}
          onCancel={() => setShowGalleryImageModal(!showGalleryImageModal)}
          showArrow={false}
        />
      )}

      {isDeleteDialogOpen && (
        <Dialog
          title="Wanna delete it?"
          showButtons={true}
          firstButtonText="Remove"
          secondButtonText="Cancel"
          firstBtnHandler={() => {
            if (toDeleteGalleryImage) {
              removeImageFromGallery(toDeleteGalleryImage._id);
            }
          }}
          secondBtnHandler={() =>
            dispatch(updateModalIsDeleteDialogOpen(false))
          }
        />
      )}
      <div className="profile-wrapper">
        <div className="profile-wrapper-container">
          <div className="profile-header">
            <ProfileHeader
              user={user}
              loading={loading}
              fromDbBackgroundUrl={fromDbBackgroundUrl}
              onClick={changeTabContent}
              tab={displayContent}
              hasImage={hasImage}
              tabItems={tabItems(
                username === profile?.username,
                username === profile?.username
              )}
              hasError={hasError}
              hideSettings={username === profile?.username}
              onSelectFile={onSelectFile}
              saveImage={saveImage}
              cancelSaveChanges={cancelSaveChanges}

              galleryImages={galleryImages}
            ></ProfileHeader>
          </div>

          <div className="profile-content">
            {displayContent === "timeline" && (
              <TimeLine userProfileData={userProfileData} loading={loading} />
            )}
            {displayContent === "followers" && <Follow useData={user} />}
            {displayContent === "gallery" && (
              <>
                {galleryImages.length > 0 && (
                  <>
                    <div className="imageGrid-container">
                      {galleryImages.map((el) => (
                        <div className="" key={el._id}>
                          <GalleryImage
                            post={el}
                            showCaption={false}
                            showDelete={username === profile?.username}
                            imgSrc={getShowingImageUrlFromPost(el)}
                            onClick={() => {
                              setGalleryImageToShow(getShowingImageUrlFromPost(el));
                              setShowGalleryImageModal(!showGalleryImageModal);
                            }}
                            onRemoveImage={(e) => {
                              e.stopPropagation();
                              setToDeleteGalleryImage(el);
                              dispatch(
                                updateModalIsDeleteDialogOpen(
                                  !isDeleteDialogOpen
                                )
                              );
                            }}
                          ></GalleryImage>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {displayContent === "change password" && <ChangePassword />}
            {displayContent === "notifications" && <NotificationSetting />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
