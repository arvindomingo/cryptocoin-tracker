import coins from '../apis/coins';
import { FETCH_COINS } from './types';

const DEFAULT_COINS = [
    'smooth-love-potion',
    'coinary-token',
    'my-defi-pet',
    'ethereum',
    'binancecoin'
];

export const fetchCoins = () => async (dispatch) => {
    // let responseData = [];
    // await Promise.all(
    //     DEFAULT_COINS.map(async (coin) => {
    //         const response = await coins.get(`/coins/${coin}?localization=false&community_data=false&developer_data=false&sparkline=false`);
    //         return responseData.push(response.data);
    //     })
    // );

    // dispatch({ type: FETCH_COINS, payload: responseData });
    const response = await coins.get(`/coins/markets?vs_currency=php&ids=${DEFAULT_COINS.map((coin) => coin).join('%2C')}&order=gecko_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h`);

    dispatch({ type: FETCH_COINS, payload: response.data });
};