import React from 'react';

//Import Logo.
import TrackerLogo4 from '../../assets/images/tracker-logo-4.png';

function Header() {
  return (
    <div className="header">
      <img src={TrackerLogo4} alt='DHTRACKER' />
    </div>
  );
}

export default Header;