import { createSearchParams } from 'react-router-dom';

export class ProfileUtils {
  static navigateToProfile(data, navigate) {
    const url = `/profile/${data?.username}?${createSearchParams({ id: data?._id })}`;
    navigate(url);
  }
}
