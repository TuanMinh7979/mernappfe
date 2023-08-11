import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux/reducers/user/user.reducer';
import suggestionsReducer from './reducers/suggestions/suggestions.reducer';
import notificationsReducer from './reducers/notifications/notification.reducer';
import modalReducer from './reducers/modal/modal.reducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer,
    notifications: notificationsReducer,
    modal:modalReducer
  }
});