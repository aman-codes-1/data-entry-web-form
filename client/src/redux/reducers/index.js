import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import _token from './assessmentReducer'
import users from './usersReducer'

export default combineReducers({
    auth,
    token,
    _token,
    users
})