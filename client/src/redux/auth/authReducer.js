const INITIAL_AUTH_STATUS = {
    loggedIn: false,
    token: ''

}

const authReducer = (state = INITIAL_AUTH_STATUS, action) => {
    if (action.type === 'SET_AUTH_STATUS') {
        return {
            ...state,
            loggedIn: action?.payload?.loggedIn,
            token: action?.payload?.token
        }
    } else {
        return state;
    }
}

export default authReducer;