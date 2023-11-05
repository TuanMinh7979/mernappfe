import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '@services/api/post/post.service';


const fetchPosts = createAsyncThunk('post/fetchPosts', async (name, { dispatch }) => {
    const response = await postService.getAllPosts(1);
    return response.data;
 
});

export { fetchPosts };
