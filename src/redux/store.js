import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux/reducers/user/user.reducer';
import suggestionsReducer from './reducers/suggestions/suggestions.reducer';
import toastsReducer from './reducers/notifications/toasts.reducer';
import modalReducer from './reducers/modal/modal.reducer';
import postReducer from './reducers/post/post.reducer';
import postsReducer from './reducers/post/posts.reducer';
export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer,
    toasts: toastsReducer,
    modal: modalReducer,
    post: postReducer,
    posts: postsReducer
  }
});