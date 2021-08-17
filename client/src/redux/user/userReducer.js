const INITIAL_USER = {
    profile: {
    image_url: null,
    name: {
      first_name: "",
      surname: "",
      displayName: ""
    },
    email: "",
    userId: "",
    description: "",
    }
} 

const userReducer = (state = INITIAL_USER, action) => {
switch (action.type) {
    case 'SET_PROFILE':
        return {
            ...state,
            ...action.payload
        }
    case 'SET_PROFILE_PICTURE' :
        state.profile.image_url = action.payload;
        return {
            ...state
        }
    default:
        return state;
}
}

export default userReducer;