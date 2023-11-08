import { BrowserRouter } from "react-router-dom";
import AppRouter from "./route";
import { useEffect } from "react";

import { socketService } from "@services/socket/socket.service";
import Toast from "@root/base-components/toast/Toast";

import { useDispatch, useSelector } from "react-redux";
import { chatService } from "@services/api/chat/chat.service";
import { followerService } from "@services/api/follow/follow.service";
import { imageService } from "@services/api/image/image.service";
import { notificationService } from "@services/api/notification/notification.service";
import { postService } from "@services/api/post/post.service";
import { userService } from "@services/api/user/user.service";

const App = () => {
  const dispatch = useDispatch();
  const reduxToasts = useSelector((state) => state.toasts);

  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);
  useEffect(() => {
    chatService.setDispatch(dispatch);
    followerService.setDispatch(dispatch);
    imageService.setDispatch(dispatch);
    notificationService.setDispatch(dispatch);
    postService.setDispatch(dispatch);
    userService.setDispatch(dispatch);
  }, [dispatch]);




  return (
    <>
      {reduxToasts && reduxToasts.length > 0 && (
        <Toast
          position="top-right"
          toastList={reduxToasts}
          autoDelete={false}
        />
      )}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};
export default App;
