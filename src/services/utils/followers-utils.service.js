import { updateLoggedUser } from '@redux/reducers/user/user.reducer';
import { followerService } from '@services/api/follow/follow.service';

import { Utils } from '@services/utils/utils.service';


export class FollowersUtils {
  static async followUser(user, dispatch) {
    const response = await followerService.followUser(user?._id);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }

  
}
