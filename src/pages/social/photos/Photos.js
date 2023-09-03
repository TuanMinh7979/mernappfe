import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Utils } from '@services/utils/utils.service'
import { PostUtils } from '@services/utils/post-utils.service'
import { postService } from '@services/api/post/post.service'
import { followerService } from '@services/api/follow/follow.service'
import useEffectOnce from '@hooks/useEffectOnce'
import GalleryImage from '@components/gallery-image/GalleryImage'
import "./Photos.scss"
import ImageModal from '@components/image-modal/ImageModal'
const Photos = () => {
  const { profile } = useSelector(state => state.user)
  const [posts, setPosts] = useState([])
  const [loggedUserIdols, setLoggedUserIdols] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const getPostWithImages = async () => {
    try {

      const response = await postService.getPostsWithImages(1)
      setPosts(response.data.posts)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
    }
  }
  const getMyIdols = async () => {
    try {

      const response = await followerService.getLoggedUserIdols()
      setLoggedUserIdols(response.data.following)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
    }
  }

  useEffectOnce(() => {
    getPostWithImages()
    getMyIdols()
  }, [])



  const emptyPost = (post) => {
    return (
      Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || PostUtils.checkPrivacy(post, profile, loggedUserIdols)
    );
  };

  const [imageUrl, setImageUrl] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const getPostImageUrl = (post) => {

    const imgUrl = Utils.getImage(post?.imgId, post?.imgVersion)
    console.log("----------", post, ">>>", imgUrl, "<<<<<<<<<");
    return post?.gifUrl ? post?.gifUrl : imgUrl
  }


  const [rightImageIdx, setRightImageIdx] = useState()
  const [leftImageIdx, setLeftImageIdx] = useState()

  const [lastItemRight, setLastItemRight] = useState(false)
  const [lastItemLeft, setLastItemLeft] = useState(false)


  const displayImage = (post) => {
    const imgUrl = post?.gifUrl ? post?.gifUrl : Utils.getImage(post?.imgId, post?.imgVersion)
    setImageUrl(imgUrl)
  }
  const onClickRight = () => {
    setLastItemLeft(false)
    setRightImageIdx(idx => idx + 1)
    const lstPost = posts[posts.length - 1]
    const curPost = posts[rightImageIdx]
    displayImage(curPost)
    setLeftImageIdx(rightImageIdx)
    if(posts[rightImageIdx]===lstPost){
      setLastItemRight(true)
    }

  }
  const onClickLeft = () => {
    setLastItemRight(false)
    setLeftImageIdx(idx => idx - 1)
    const fstPost = posts[0]
    const curPost = posts[leftImageIdx-1]
    displayImage(curPost)
    setRightImageIdx(leftImageIdx)
    if(fstPost===curPost){
      setLastItemLeft(true)
    }
  }
  return (
    <>
      <div className="photos-container">

        {showImageModal && <ImageModal
          image={imageUrl}
          showArrow={true}
          onClickRight={onClickRight}
          onClickLeft={onClickLeft}

          lastItemLeft={lastItemLeft}
          lastItemRight={lastItemRight}

          onCancel={() => {
            setRightImageIdx(0)
            setLeftImageIdx(0)
            setLastItemRight(false)
            setLastItemLeft(false)
            setShowImageModal(false)
          }}

        />}
        <div className="photos">  Photos   </div>
        {posts.length > 0 && (
          <div className="gallery-images">
            {posts.map((el, idx) =>
              <div className={`${!emptyPost(el) ? 'empty-post-div' : ''}`} key={idx}>
                {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, el?.userId) ||
                  el?.userId === profile?._id) && (
                    <>
                      {PostUtils.checkPrivacy(el, profile, loggedUserIdols) && (
                        <>
                          <div className="">

                            <GalleryImage

                              post={el}
                              showCaption={true}
                              showDelete={false}
                              imgSrc={getPostImageUrl(el)}
                              onClick={() => {
                                setRightImageIdx(idx + 1)
                                setLeftImageIdx(idx)

                                setLastItemLeft(idx==0)
                                setLastItemRight(idx+1===posts.length)
                                setShowImageModal(!showImageModal)
                                setImageUrl(getPostImageUrl(el))
                              }}

                            />

                          </div>

                        </>
                      )}
                    </>
                  )}
              </div>

            )}
          </div>
        )}


        {loading && !posts.length && <div className="card-element" style={{ height: '350px' }}></div>}

        {!loading && !posts.length && (
          <div className="empty-page" data-testid="empty-page">
            No photos to display
          </div>
        )}

      </div>
    </>

  )
}

export default Photos