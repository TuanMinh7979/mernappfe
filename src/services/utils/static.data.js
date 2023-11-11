import blessed from '../../assets/feelings/blessed.jpg';
import excited from '../../assets/feelings/excited.jpg';
import happyFeelings from '../../assets/feelings/happy.jpg';
import loved from '../../assets/feelings/loved.jpg';
import angry from '../../assets/reactions/angry.png';
import happy from '../../assets/reactions/happy.png';
import like from '../../assets/reactions/like.png';
import love from '../../assets/reactions/love.png';
import sad from '../../assets/reactions/sad.png';
import wow from '../../assets/reactions/wow.png';
import defaultIcon from '../../assets/reactions/default.png';


import {
  FaGlobe,
  FaKey,
  FaLock,
  FaUser,
  FaUserCheck,
} from 'react-icons/fa';


import {
  RiNewspaperFill,
  RiUserAddFill,
  RiUserSmileFill,
  RiChat2Fill,
  RiHeart3Fill,
  RiImageFill,
  RiNotification2Fill,
  RiUser3Fill
} from 'react-icons/ri'
import { ProfileUtils } from './profile-utils.service';

export const sideBarItems = [
  {
    index: 1,
    name: 'Feeds',
    url: '/',
    iconName: 'RiNewspaperFill'
  },
  {
    index: 2,
    name: 'Chat',
    url: '/chat/messages',
    iconName: 'RiChat2Fill'
  },
  {
    index: 3,
    name: 'People',
    url: '/people',
    iconName: 'RiUserSmileFill'
  },
  {
    index: 4,
    name: 'Following',
    url: '/following',
    iconName: 'RiUserAddFill'
  },
  {
    index: 5,
    name: 'Followers',
    url: '/followers',
    iconName: 'RiHeart3Fill'
  },
  {
    index: 6,
    name: 'Photos',
    url: '/photos',
    iconName: 'RiImageFill'
  },

  {
    index: 7,
    name: 'Notifications',
    url: '/notifications',
    iconName: 'RiNotification2Fill'
  },
  {
    index: 8,
    name: 'Profile',
    url: '/profile',
    iconName: 'RiUser3Fill'
  }
];

export const feelingsList = [
  {
    index: 0,
    name: 'happy',
    image: happyFeelings
  },
  {
    index: 1,
    name: 'excited',
    image: excited
  },
  {
    index: 2,
    name: 'blessed',
    image: blessed
  },
  {
    index: 3,
    name: 'loved',
    image: loved
  }
];

export const fontAwesomeIcons = {


  RiNewspaperFill: <RiNewspaperFill className='icon' />,

  RiChat2Fill: <RiChat2Fill className="icon" />,
  RiUserSmileFill: <RiUserSmileFill className="icon" />,
  RiUserAddFill: <RiUserAddFill className="icon" />,
  RiHeart3Fill: <RiHeart3Fill className="icon" />,
  RiImageFill: <RiImageFill className="icon" />,

  RiNotification2Fill: <RiNotification2Fill className="icon" />,

  RiUser3Fill: <RiUser3Fill className="icon" />
};

export const privacyList = [
  {
    topText: 'Public',
    subText: 'Anyone on Chatty',
    icon: <FaGlobe className="globe-icon globe" />
  },
  {
    topText: 'Followers',
    subText: 'Your followers on Chatty',
    icon: <FaUserCheck className="globe-icon globe" />
  },
  {
    topText: 'Private',
    subText: 'For you only',
    icon: <FaLock className="globe-icon globe" />
  }
];

export const bgColors = [
  '#ffffff',
  '#f44336',
  '#e91e63',
  '#2196f3',
  '#9c27b0',
  '#3f51b5',
  '#00bcd4',
  '#4caf50',
  '#ff9800',
  '#8bc34a',
  '#009688',
  '#03a9f4',
  '#cddc39'
];

export const avatarColors = [
  '#f44336',
  '#e91e63',
  '#2196f3',
  '#9c27b0',
  '#3f51b5',
  '#00bcd4',
  '#4caf50',
  '#ff9800',
  '#8bc34a',
  '#009688',
  '#03a9f4',
  '#cddc39',
  '#2962ff',
  '#448aff',
  '#84ffff',
  '#00e676',
  '#43a047',
  '#d32f2f',
  '#ff1744',
  '#ad1457',
  '#6a1b9a',
  '#1a237e',
  '#1de9b6',
  '#d84315'
];

export const emptyPostData = {
  _id: '',
  post: '',// dont need to save in redux when add new
  bgColor: '',
  privacy: '',
  feelings: '',
  gifUrl: '',
  profilePicture: '',// dont need to save in redux when add new
  image: '',// only use to preview image, not use in db
  userId: '',
  username: '',
  email: '',
  avatarColor: '',
  commentsCount: '',
  reactions: [],
  imgVersion: '',
  imgId: '',
  createdAt: '',
  video: ''
};

export const reactionsMap = {
  like,
  love,
  wow,
  sad,
  happy,
  angry,
  default: defaultIcon
};

export const reactionsColor = {
  like: '#50b5ff',
  love: '#f33e58',
  angry: '#e9710f',
  happy: '#f7b124',
  sad: '#f7b124',
  wow: '#f7b124'
};

export const notificationItems = [
  // {
  //   index: 0,
  //   title: 'Direct Messages',
  //   description: 'New direct messages notifications.',
  //   toggle: true,
  //   type: 'messages'
  // },
  {
    index: 1,
    title: 'Follows',
    description: 'New followers notifications.',
    toggle: true,
    type: 'follows'
  },
  {
    index: 2,
    title: 'Post Reactions',
    description: 'New reactions for your posts notifications.',
    toggle: true,
    type: 'reactions'
  },
  {
    index: 3,
    title: 'Comments',
    description: 'New comments for your posts notifications.',
    toggle: true,
    type: 'comments'
  }
];


export const tabItems = (showPassword, showNotification) => {
  const items = [
    { key: 'Timeline', show: true, icon: <FaUser className="banner-nav-item-name-icon" /> },
    { key: 'Followers', show: true, icon: <RiHeart3Fill className="banner-nav-item-name-icon" /> },
    { key: 'Gallery', show: true, icon: <RiImageFill className="banner-nav-item-name-icon" /> },
    {
      key: 'Change Password',
      show: showPassword,
      icon: <FaKey className="banner-nav-item-name-icon" />
    },
    {
      key: 'Notifications',
      show: showNotification,
      icon: <RiNotification2Fill className="banner-nav-item-name-icon" />
    }
  ];
  return items;
};