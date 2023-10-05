import React from 'react'
import BackgroundHeader from '@components/background-header/BackgroundHeader'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useCallback } from 'react';
import { Utils } from '@services/utils/utils.service';
import { userService } from '@services/api/user/user.service';
import { useParams, useSearchParams } from 'react-router-dom';
import { tabItems } from '@services/utils/static.data';
import { useEffect } from 'react';
import { imageService } from '@services/api/image/image.service';
import TimeLine from '@components/timeline/TimeLine';
import FollowerCard from '../follower/FollowerCard';
import ChangePassword from '@components/change-password/ChangePassword';
import NotificationSetting from '@components/notification-setting/NotificationSetting';
import GalleryImage from '@components/gallery-image/GalleryImage';
import { updateModalIsDeleteDialogOpen } from '@redux/reducers/modal/modal.reducer';
import ImageModal from '@components/image-modal/ImageModal';
import "./Profile.scss"
import Dialog from '@components/dialog/Dialog';
const Profile = () => {

  const { profile } = useSelector((state) => state.user);

  const { isDeleteDialogOpen } = useSelector((state) => state.modal);
  const [user, setUser] = useState()
  const dispatch = useDispatch()
  const { username } = useParams()
  const [searchParams] = useSearchParams();

  const [rendered, setRendered] = useState(false)
  // * get user background image  , profile image and posts
  const getUserProfileAndPosts = useCallback(async () => {

    try {
      const res = await userService.getUserProfileAndPosts(username,
        searchParams.get('id'),
        searchParams.get('uId')
      )

      setFromDbBackgroundUrl(Utils.getImage(res?.data?.user?.bgImageId, res?.data?.user?.bgImageVersion))

      setUserProfileData(res.data)
      setUser(res.data.user)
    } catch (error) {

      console.log(error);
      Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
    }
  }, [dispatch, searchParams, username])

  const getUserImages = useCallback(async () => {
    try {
      const res = await imageService.getUserImages(
        searchParams.get('id')
      )

      setGalleryImages(res.data.images)
    } catch (error) {
      console.log(error);
      Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
    }
  }, [dispatch, searchParams, username])



  const [hasError, setHasError] = useState(false)
  const [hasImage, setHasImage] = useState(false)
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState("")
  const [selectedProfileImage, setSelectedProfileImage] = useState("")
  const [fromDbBackgroundUrl, setFromDbBackgroundUrl] = useState("")
  const [galleryImages, setGalleryImages] = useState([])
  // const [imageUrl, setImageUrl] = useState('')


  const [loading, setLoading] = useState(true)
  const [userProfileData, setUserProfileData] = useState(null)



  const [displayContent, setDisplayContent] = useState('timeline')
  const [toDeleteGalleryImage, setToDeleteGalleryImage] = useState(null)


  const changeTabContent = (data) => {
    setDisplayContent(data)

  }


  const onSelectFileImage = (data, type) => {
    setHasImage(!hasImage)
    if (type == 'background') {
      setSelectedBackgroundImage(data)
    } else {

      setSelectedProfileImage(data)
    }

  }


  const saveImageToDB = async (result, type) => {
    try {
      const url = type === 'background' ? '/images/background' : '/images/profile';

      const response = await imageService.addImage(url, result);
      if (response) {
        Utils.updToastsNewEle(response.data.message, 'success', dispatch);
        setHasError(false);
        setHasImage(false);
      }
    } catch (error) {
      console.log(error);
      setHasError(true);
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
    }
  };
  const saveImage = (type) => {
    const reader = new FileReader();
    reader.addEventListener('load', async () => saveImageToDB(reader.result, type), false);

    if (selectedBackgroundImage && typeof selectedBackgroundImage !== 'string') {
      reader.readAsDataURL(Utils.renameFile(selectedBackgroundImage));
    } else if (selectedProfileImage && typeof selectedProfileImage !== 'string') {
      reader.readAsDataURL(Utils.renameFile(selectedProfileImage));
    } else {

      // it can be a link url (image that user has posted before in their post)
      saveImageToDB(selectedBackgroundImage, type);
    }
  };




  const cancelFileSelection = (type) => {
    setHasImage(!hasImage)
    setSelectedBackgroundImage('')
    setSelectedProfileImage('')
    setHasError(false)
  }


  useEffect(() => {
    if (!rendered) setRendered(true)
    if (rendered) {
      getUserProfileAndPosts()
      getUserImages()
      setLoading(false)
    }

  }, [rendered, getUserProfileAndPosts, getUserImages])


  const getShowingImageUrlFromPost = (post) => {
    return post?.gifUrl ? post?.gifUrl : Utils.getImage(post?.imgId, post?.imgVersion)

  }


  const [curImageUrl, setCurImageUrl] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)


  const removeImageFromGallery = async (id) => {
    try {

      dispatch(updateModalIsDeleteDialogOpen(false))
      const images = galleryImages.filter(el => el._id !== id)
      setGalleryImages(images);

      const response = await imageService.removeImage(`/images/${id}`)
      Utils.updToastsNewEle(response.data.message, 'success', dispatch)
    } catch (error) {
      console.log(error)
      Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
    }
  }


  return (
    <>

      {
        showImageModal &&
        <ImageModal

          image={curImageUrl}
          onCancel={() => setShowImageModal(!showImageModal)}
          showArrow={false}
        />
      }


      {

        isDeleteDialogOpen && (
          <Dialog
            title="Wanna delete it?"
            showButtons={true}
            firstButtonText='Remove'
            secondButtonText='Cancel'
            firstBtnHandler={() => {
              if (toDeleteGalleryImage) {
                console.log(toDeleteGalleryImage);

                removeImageFromGallery(toDeleteGalleryImage._id)
              }

            }}
            secondBtnHandler={() => dispatch(updateModalIsDeleteDialogOpen(false))}

          />
        )

      }
      <div className="profile-wrapper">

        <div className="profile-wrapper-container">

          <div className="profile-header">
            <BackgroundHeader

              user={user}
              loading={loading}
              fromDbBackgroundUrl={fromDbBackgroundUrl}
              onClick={changeTabContent}
              tab={displayContent}
              hasImage={hasImage}
              tabItems={tabItems(username === profile?.username, username === profile?.username)}
              hasError={hasError}
              hideSettings={username === profile?.username}
              onSelectFileImage={onSelectFileImage}
              onSaveImage={saveImage}
              cancelFileSelection={cancelFileSelection}
              removeBackgroundImage={() => { }}
              galleryImages={galleryImages}

            ></BackgroundHeader>
          </div>


          <div className="profile-content">
            {displayContent === 'timeline' && <TimeLine userProfileData={userProfileData} loading={loading} />}
            {displayContent === 'followers' && <FollowerCard useData={user} />}
            {displayContent === 'gallery' && <>

              {
                galleryImages.length > 0 && (
                  <>
                    <div className="imageGrid-container">



                      {galleryImages.map((el) =>
                        <div className="" key={el._id}>
                          <GalleryImage
                            post={el}
                            showCaption={false}
                            showDelete={username === profile?.username}
                            imgSrc={getShowingImageUrlFromPost(el)}
                            onClick={() => {
                              setCurImageUrl(getShowingImageUrlFromPost(el))
                              setShowImageModal(!showImageModal)
                            }}

                            onRemoveImage={(e) => {
                              e.stopPropagation()
                              setToDeleteGalleryImage(el)
                              dispatch(updateModalIsDeleteDialogOpen(!isDeleteDialogOpen))
                            }}
                          >
                          </GalleryImage>
                        </div>
                      )}



                    </div>


                  </>
                )
              }
            </>}

            {displayContent === 'change password' && <ChangePassword />}
            {displayContent === 'notifications' && <NotificationSetting />}


          </div>
        </div>


      </div >
    </>
  )
}

export default Profile