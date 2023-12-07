import React, { useState } from 'react';

//Import Material UI Components.
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import Tooltip from '@material-ui/core/Tooltip';


//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux'

function Sidebar() {

  //Component State.
  const [selectedIndex, setSelectedIndex] = useState(0);

  //Reducer States.
  const dispatch = useDispatch();
  const objUser = useSelector(state => state.objUser);

  //Handle Sidebar item selection.
  const handleSidebbarListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  //Sidebar items array.
  const arrSidebar = [
    { text: "User", icon: <PersonIcon /> },
    { text: "Manual Entry", icon: <ScheduleIcon fontSize="large" /> }
  ]

  //Render sidebar items.
  const arrSidebarItems = arrSidebar.map((item, key) =>
    <ListItem
      key={`sidebar-list-item-${key}`}
      button
      divider={true}
      selected={selectedIndex === key}
      onClick={(event) => handleSidebbarListItemClick(event, key)}
      className="sidebar-list-Item"
    >
      <ListItemAvatar>
        {(item.text === "User" && objUser.profile_image_url)
          ? <Avatar
            alt={objUser.first_name}
            src={objUser.profile_image_url}
            className="sidebar-list-avatar-icon"
          />
          : <div className="sidebar-list-icon">
            {item.icon}
          </div>
        }
      </ListItemAvatar>
      <ListItemText
        primary={item.text === "User" ? (objUser.first_name + " " + objUser.last_name) : item.text}
        className="sidebar-list-text"
      />
    </ListItem>
  );

  //Handle Sidebar bottom item selection.
  const handleSidebarBottomListItemClick = (event, index) => {
    if (index === 1) {
      if (objUser && !objUser.rememberMe) {
        dispatch({ type: 'USER_SIGNOUT_POPUP_REQUESTED', strUserSignoutPopup: "directSignout" });
      } else {
        dispatch({ type: 'USER_SIGNOUT_POPUP_REQUESTED', strUserSignoutPopup: "show" });
      }
    }
  };

  //Sidebar bottom items array.
  const arrSidebarBottom = [
    { text: "Day End Report", icon: <EmailIcon className="day-end-report" /> },
    { text: "Signout", icon: <ExitToAppIcon className="logout" /> },
  ]

  //Render sidebar bottom items.
  const arrSidebarBottomItems = arrSidebarBottom.map((item, key) =>
    <ListItem
      key={`sidebar-list-item-${key}`}
      button
      onClick={(event) => handleSidebarBottomListItemClick(event, key)}
      className="sidebar-bottom-list-Item"
    >
      <ListItemAvatar className="sidebar-bottom-list-icon">
        <Tooltip title={item.text} placement="top">
          {item.icon}
        </Tooltip>
      </ListItemAvatar>
    </ListItem>
  );

  return (
    <div className="sidebar-component">
      <Drawer
        className="drawer"
        variant="permanent"
        classes={{ paper: "drawer-paper" }}
        anchor="left"
      >
        <List className="sidebar-list">
          {arrSidebarItems}
        </List>
        <List className="sidebar-bottom-list">
          {arrSidebarBottomItems}
        </List>
      </Drawer>

    </div >
  );
}

export default Sidebar;