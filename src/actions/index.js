import coins from '../apis/coins';
import { FETCH_COINS, DEFAULT_COINS } from './types';

export const fetchCoins = (currency) => async (dispatch) => {
    const response = await coins.get(`/coins/markets?vs_currency=${currency}&ids=${DEFAULT_COINS.map((coin) => coin.code).join('%2C')}&order=market_cap_asc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h`);

    dispatch({ type: FETCH_COINS, payload: response.data });
};