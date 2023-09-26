import { sideBarItems, fontAwesomeIcons } from "@services/utils/static.data";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { useSelector } from "react-redux";
import { createSearchParams } from "react-router-dom";
import { socketService } from "@services/socket/socket.service";
const Sidebar = () => {
  const { profile } = useSelector((state) => state.user);

  const [sidebar, setSideBar] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setSideBar(sideBarItems);
  }, []);

  const checkUrl = (name) => {
    return location.pathname.includes(name.toLowerCase());
  };
  const navigateToPage = (name, url) => {
    if (name === 'Profile') {
      url = `${url}/${profile?.username}?${createSearchParams({ id: profile?._id, uId: profile?.uId })}`;
    }
    if (name !== 'Chat') {
      //  leave chat room
      socketService?.socket?.emit("leave room", profile);
    }
    navigate(url);
  };





  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((data) => (
            <li
              key={data.index}
              onClick={() => navigateToPage(data.name, data.url)}
            >
              <div
                data-testid="sidebar-list"
                className={`sidebar-link ${checkUrl(data.name) ? 'active' : ''}`}
              >
                <div className="menu-icon">
                  {fontAwesomeIcons[data.iconName]}
                </div>
                <div className="menu-link">
                  <span>{`${data.name}`}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
