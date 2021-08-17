export const setCredentials = list => ({
    type: 'SET_CREDENTIAL_LIST',
    payload: list
});

// export const updateCredentials = data => ({
//     type: 'UPDATE_CREDENTIAL_LIST',
//     payload: data
// });

// export const disableUpdateStatus = data => ({
//     type: 'DISABLE_UPDATE_STATUS',
//     payload: data
// });

export const setFilteredList = data => ({
    type: 'SET_FILTERED_LIST',
    payload: data
});