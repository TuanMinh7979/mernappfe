import { updatePost } from "@redux/reducers/post/post.reducer";

export class PostUtils {

    
    // * Params: 
    // post: 
    // inputRef: 
    // setSelectedPostImage: 
    //  setPostImage: 
    //  setPostData:
    // * Res: void
    //* use for clear image in post modal
  static clearPostModalImage(postData, 
    post, 
    inputRef, 
    dispatch,
     setSelectedPostImage, 
     setPostImage, 
     setPostData) {
    postData.gifUrl = '';
    postData.image = '';
  
    setSelectedPostImage(null);
    setPostImage('');
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
      }

    });
    dispatch( 
      updatePost({ gifUrl: '', image: '', imgId: '', imgVersion: '', video: '', videoId: '', videoVersion: '' })
    );
  }

}