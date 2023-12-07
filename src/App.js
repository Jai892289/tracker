import React, { useEffect } from 'react';

//Import Style
import './styles/App.scss';

//Import Routes.
import routes from './routes';

//Import Redux releated function.
import { useDispatch } from 'react-redux';

//Import Custom Components.
import FullScreenLoader from './components/Loader/FullScreenLoader';
import Notification from './components/Notifications/Notification';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';

//Import Utils.
import { delay } from './utils/functions';

function App() {

  //Reducer States.
  const dispatch = useDispatch();

  //Update internet connection status.
  const updateInternetStatus = async () => {
    dispatch({ type: 'UPDATE_INTERNET_STATUS', payload: navigator.onLine });
    window.tracker.trayIconEvents.setTrayOnlineStatus(navigator.onLine);
    if (navigator.onLine) {
      await delay(10000);
      dispatch(({ type: 'BULK_ROW_DATA_SYNC_SERVER_REQUESTED' }));
      await delay(30000);
      dispatch({ type: 'BULK_IMAGES_DATA_SYNC_SERVER_REQUESTED', payload: { syncType: "CURRENT_USER_IMAGES" } });
    }
  }

  useEffect(() => {
    //update internet status when first time loads.
    updateInternetStatus();
    //Listening Tray icon event in order to stop tracking when user quit the application.
    window.tracker.trayIconEvents.stopTracker(() => {
      dispatch({ type: 'START_FULL_SCREEN_LOADER' });
      dispatch({ type: 'STOP_TRACKER', payload: { inActivityEndTime: new Date().getTime(), inTrackerStop: 1 } });
    });
  }, []);// eslint-disable-line

  //Add/Remove listener for internet connection detection.
  useEffect(() => {
    window.addEventListener('online', updateInternetStatus);
    window.addEventListener('offline', updateInternetStatus);
    return () => {
      window.removeEventListener('online', updateInternetStatus);
      window.removeEventListener('offline', updateInternetStatus);
    };
  }, [navigator.onLine]); // eslint-disable-line
  // passed [navigator.onLine] because the state values and selectors value are not updating afiter first time registering events. so we need to re registre the events every time the online status change.

  return (
    <div >
      <FullScreenLoader />
      <Notification />
      <ErrorHandler />
      {routes}
    </div>
  );
}

export default App;