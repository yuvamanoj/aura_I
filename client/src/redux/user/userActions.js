export const setProfile = user => ({
    type: 'SET_PROFILE',
    payload: user
});

export const setProfilePic = image_url => ({
    type: 'SET_PROFILE_PICTURE',
    payload: image_url
});
