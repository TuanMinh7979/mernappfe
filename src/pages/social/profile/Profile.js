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
const Profile = () => {

  const { profile } = useSelector((state) => state.user);
  const [ user, setUser ] = useState()
  const dispatch = useDispatch()
  const { username } = useParams()
  const [searchParams] = useSearchParams();

  const [rendered, setRendered] = useState(false)
  const getUserProfileAndPosts = useCallback(async () => {
    try {
      const res = await userService.getUserProfileAndPosts(username,
        searchParams.get('id'),
        searchParams.get('uId')
      )
      setUser(res.data.user)
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

  return (
    <>
      <div className="profile-wrapper">

        <div className="profile-wrapper-container">

          <div className="profile-header">
            <BackgroundHeader

              user={user}
              loading={false}
              url={""}
              onClick={() => { }}
              tab={''}
              hasImage={false}
              tabItems={tabItems(username === profile?.username, username === profile?.username)}
              hasError={false}
              hideSettings={username === profile.username}
              onSelectFileImage={() => { }}
              onSaveImage={() => { }}
              cancelFileSelection={() => { }}
              removeBackgroundImage={() => { }}
              galleryImages={[]}

            ></BackgroundHeader>
          </div>
        </div>


      </div >
    </>
  )
}

export default Profile