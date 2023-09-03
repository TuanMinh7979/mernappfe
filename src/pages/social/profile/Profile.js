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
const Profile = () => {

  const { profile } = useSelector((state) => state.user);
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
      setLoading(false)
      setFromDbBackgroundUrl(Utils.getImage(res?.data?.user?.bgImageId, res?.data?.user?.bgImageVersion))
      // setUserProfileData(res.data)
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
  useEffect(() => {
    if (!rendered) setRendered(true)
    if (rendered) {
      getUserProfileAndPosts()
    }

  }, [rendered, getUserProfileAndPosts])


  const [hasError, setHasError] = useState(false)
  const [hasImage, setHasImage] = useState(false)
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState("")
  const [selectedProfileImage, setSelectedProfileImage] = useState("")
  const [fromDbBackgroundUrl, setFromDbBackgroundUrl] = useState("")
  const [galleryImages, setGalleryImages] = useState([])
  // const [imageUrl, setImageUrl] = useState('')


  const [loading, setLoading] = useState(true)
  // const [userProfileData, setUserProfileData] = useState(null)



  const [displayContent, setDisplayContent] = useState('timeline')


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

      saveImageToDB(selectedBackgroundImage, type);
    }
  };

  const removeBackgroundImage = async (bgImageId) => {

    try {

      setFromDbBackgroundUrl('')
      await removeImage(`/images/background/${bgImageId}`)
    } catch (error) {
      console.log(error)
      setHasError(false)
      Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);


    }
  }
  const removeImage = async (url) => {
    const response = await imageService.removeImage(url)
    Utils.updToastsNewEle(response.data.message, 'success', dispatch)
  }
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
    }

  }, [rendered, getUserProfileAndPosts, getUserImages])
  return (
    <>
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
              hideSettings={username === profile.username}
              onSelectFileImage={onSelectFileImage}
              onSaveImage={saveImage}
              cancelFileSelection={cancelFileSelection}
              removeBackgroundImage={removeBackgroundImage}
              galleryImages={galleryImages}

            ></BackgroundHeader>
          </div>
        </div>


      </div >
    </>
  )
}

export default Profile