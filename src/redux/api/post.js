import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';

const fetchPosts = createAsyncThunk('post/fetchPosts', async (name, { dispatch }) => {
  try {
    const response = await postService.getAllPosts(1);
    return response.data;
  } catch (error) {
    Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
  }
});

export { fetchPosts };
