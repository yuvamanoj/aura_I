import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
import credentialsReducer from "./credentials/credentialsReducer";
import userReducer from "./user/userReducer";
import customersReducer from "./customers/customerReducer";

export default combineReducers({
    user : userReducer,
    list : credentialsReducer,
    auth : authReducer,
    customers : customersReducer
});