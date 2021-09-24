import { FETCH_COINS } from '../actions/types';

const coinReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_COINS:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export default coinReducer;