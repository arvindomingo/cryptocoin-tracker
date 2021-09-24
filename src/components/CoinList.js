import React from 'react';
import { connect } from 'react-redux';
import { fetchCoins } from '../actions';

class CoinList extends React.Component {
    componentDidMount() {
        this.props.fetchCoins();
        setInterval(() => {
            this.props.fetchCoins();
        }, 10000);
    }

    renderList() {
        let lighten = 1;
        return this.props.coins.map((coin) => {
            lighten++
            lighten = lighten === 5 ? 1 : lighten;
            return (
                <tr key={coin.symbol}>
                    <td>
                        <h4 className="ui image header">
                            <img src={coin.image} alt={coin.symbol} className="ui mini rounded image" />
                            <div className="content" style={{ color: '#fff' }}>
                                {coin.name}
                                <div className="sub header" style={{ color: '#fff' }}>{coin.symbol.toUpperCase()}</div>
                            </div>
                        </h4>
                    </td>

                    <td style={{ fontWeight: 'bolder' }}>
                        ₱ {coin.current_price.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </td>
                    <td style={{ color: `${coin.price_change_percentage_1h_in_currency < 0 ? 'red' : '#96ffae'}` }}>
                        {coin.price_change_percentage_1h_in_currency.toFixed(1)}%
                    </td>
                    <td style={{ color: `${coin.price_change_percentage_24_in_currency < 0 ? 'red' : '#96ffae'}` }}>
                        {coin.price_change_percentage_24h_in_currency.toFixed(1)}%
                    </td>
                    <td>
                        ₱ {coin.low_24h.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </td>
                    <td>
                        ₱ {coin.high_24h.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </td>
                </tr>
            );
        });
    }

    render() {
        if (!this.props.coins) {
            return (
                <div className="ui active inverted dimmer">
                    <div className="ui mini loader"></div>
                </div>
            );
        }

        return (
            <div>
                <h2 style={{ fontSize: '2rem' }}>CryptoCoin Tracker</h2>
                <table className="ui inverted teal table">
                    <thead>
                        <tr>
                            <th>Coin</th>
                            <th>Price</th>
                            <th>1hr</th>
                            <th>24hr</th>
                            <th>Low 24hr</th>
                            <th>High 24hr</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderList()}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        coins: Object.values(state.coins)
    };
};

export default connect(
    mapStateToProps,
    { fetchCoins }
)(CoinList);