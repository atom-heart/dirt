export const MOUNT_INITIAL_DATA = 'event:mountInitialData';
export const IS_LOADING = 'event:isLoading';

export const isLoading = () => ({
  type: IS_LOADING
});

export const mountInitialData = payload => ({
  type: MOUNT_INITIAL_DATA,
  payload
});

export const fetchEventData = () => {
  return dispatch => {
    dispatch(isLoading());
    
    fetch(`${window.location.href}api/event/info/1`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(mountInitialData(result));
        },
        (error) => {
          console.log('Error fetching event data!');
        }
      )
  }
}
