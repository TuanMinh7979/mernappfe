import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

const ProfileHeaderSkeleton = ({ tabItems }) => {
  return (
    <>
      <div className="profile-top" data-testid="profile-top-skeleton">
        <div className="profile-top-image" style={{ border: '1px solid white', backgroundColor: '#EFF1F6' }}></div>
        <div className="profile-top-data">
          <div className="profile-pic">
            <Skeleton baseColor="#EFF1F6" height={180} width={180} />
          </div>
          <div className="profile-name">
            <Skeleton baseColor="#EFF1F6" height={20} width={120} />
          </div>
        </div>
        <div className="profile-top-items">
          <ul className="banner-nav">
            {tabItems.map((data) => (
              <div key={data.key}>
                {data.show && (
                  <li className="banner-nav-item" key={data.key}>
                    <div className="banner-nav-item-name ">
                      <Skeleton baseColor="#EFF1F6" height={20} width={20} />
                      <p className="title">
                        <Skeleton baseColor="#EFF1F6" height={20} width={50} />
                      </p>
                    </div>
                  </li>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

ProfileHeaderSkeleton.propTypes = {
  tabItems: PropTypes.array
};

export default ProfileHeaderSkeleton;
