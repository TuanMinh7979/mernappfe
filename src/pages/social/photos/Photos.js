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
  const { profile, token } = useSelector(state => state.user)
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
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", error);
      setLoading(false)
      // Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
      Utils.updToastsNewEle(error.msg, 'error', dispatch);
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
  })



  const emptyPost = (post) => {
    return (
      Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || PostUtils.checkPrivacy(post, profile, loggedUserIdols)
    );
  };

  const [curImageUrl, setCurImageUrl] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)


  const getShowingImageUrlFromPost = (post) => {
    return post?.gifUrl ? post?.gifUrl : Utils.getImage(post?.imgId, post?.imgVersion)

  }

  const onClickRight = () => {
    setCurrentShowImageIdx(prev => prev + 1)
    setCurImageUrl(getShowingImageUrlFromPost(posts[currentImageIdx + 1]))
  }
  const onClickLeft = () => {
    setCurrentShowImageIdx(prev => prev - 1)
    setCurImageUrl(getShowingImageUrlFromPost(posts[currentImageIdx - 1]))
  }

  const [currentImageIdx, setCurrentShowImageIdx] = useState(0)
  return (
    <>
      <div className="photos-container">

        {showImageModal && <ImageModal
          image={curImageUrl}
          showArrow={true}
          onClickRight={onClickRight}
          onClickLeft={onClickLeft}
          isLastItemRight={currentImageIdx == posts.length - 1}
          isLastItemLeft={currentImageIdx == 0}
          onCancel={() => {
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
                              imgSrc={getShowingImageUrlFromPost(el)}
                              onClick={() => {
                                setCurrentShowImageIdx(idx)
                                setShowImageModal(!showImageModal)
                                setCurImageUrl(getShowingImageUrlFromPost(el))
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