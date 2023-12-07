import React from 'react';

//Import Tracker sub views.
import TodayTimeSummary from './TodayTimeSummary/TodayTimeSummary';
import Header from './Header/Header';
import ProjectList from './ProjectList';
import Footer from './Footer/Footer';

//Import custom components.
import ActivityName from '../../components/ActivityName/ActivityName';

function Tracker() {

  return (
    <div className="tracker-view">
      <ActivityName />
      <TodayTimeSummary/>
      <Header />
      <ProjectList />
      <Footer />
    </div>
  );
}

export default Tracker;