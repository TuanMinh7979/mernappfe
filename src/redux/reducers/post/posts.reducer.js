import { fetchPosts } from '@redux/api/post';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  totalPostsCount: 0,
  isLoading: false
};

const postsSlice = createSlice({
  name: 'allPosts',
  initialState,
  reducers: {
    updatePosts: (state, action) => {
      state.posts = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      
      state.isLoading = false;
      const { posts, totalPosts } = action.payload;
      state.posts = [...posts];
      state.totalPostsCount = totalPosts;
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { updatePosts } = postsSlice.actions;
export default postsSlice.reducer;
