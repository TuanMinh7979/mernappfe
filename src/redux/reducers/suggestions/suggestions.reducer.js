import { fetchUpdSugUsers } from '@redux/api/suggestion';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  isLoading: false
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    updateSugUsersNewEle: (state, action) => {
      const { isLoading, users } = action.payload;
      state.users = [...users];
      state.isLoading = isLoading;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUpdSugUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUpdSugUsers.fulfilled, (state, action) => {
      
      state.isLoading = false;
      const { users } = action.payload;

      state.users = [...users];
    });
    builder.addCase(fetchUpdSugUsers.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { updateSugUsersNewEle } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
