const INITIAL_CREDENTIAL_LIST = {
    credentials : []
} 

const credentialsReducer = (state = INITIAL_CREDENTIAL_LIST, action) => {
switch (action.type) {
    case 'SET_CREDENTIAL_LIST':
        return {
            ...state,
            credentials: action.payload,
            filteredList: action.payload
        }
        case 'SET_FILTERED_LIST':
            return {
                ...state,
                filteredList: action.payload,
            }
    default:
        return state;
}
}

export default credentialsReducer;