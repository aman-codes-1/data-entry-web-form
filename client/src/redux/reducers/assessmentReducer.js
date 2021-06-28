import ACTIONS from '../actions'

const _token = ''

const assessmentReducer = (state = _token, action) => {
    switch(action.type){
        case ACTIONS.GET_TOKEN:
            return action.payload
        default: 
            return state
    }
}

export default assessmentReducer