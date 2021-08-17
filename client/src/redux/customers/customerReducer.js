const INITIAL_CUSTOMERS = {
    customers: []
} 

const customersReducer = (state = INITIAL_CUSTOMERS, action) => {
    if(action.type === 'SET_CUSTOMER_LIST') {
        return {
            ...state,
            customers : action.payload
        }
    } else {
        return state;
    }
}

export default customersReducer;