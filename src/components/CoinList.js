import './CoinList.css';
import React from 'react';
import { connect } from 'react-redux';
import { fetchCoins } from '../actions';

class CoinList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currency: 'php'
        };
    }

    componentDidMount() {
        this.props.fetchCoins(this.state.currency);
        this.timerID = setInterval(() => {
            this.props.fetchCoins(this.state.currency);
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    renderList() {
        let lighten = 1;
        return this.props.coins.map((coin) => {
            let symbol = this.state.currency === 'php' ? '₱' : '$';
            lighten++
            lighten = lighten === 5 ? 1 : lighten;
            return (
                <tr key={coin.symbol}>
                    <td>
                        <h4 className="ui image header">
                            <img src={coin.image} alt={coin.symbol} className="ui small rounded image" />
                            <div className="content">
                                {coin.name}
                                <div className="sub header">{coin.symbol.toUpperCase()}</div>
                            </div>
                        </h4>
                    </td>

                    <td className="td-price">
                        {symbol} {coin.current_price.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </td>
                    <td style={{ color: `${coin.price_change_percentage_1h_in_currency < 0 ? '#a53939' : '#96ffae'}` }}>
                        {coin.price_change_percentage_1h_in_currency.toFixed(1)}%
                    </td>
                    <td style={{ color: `${coin.price_change_percentage_24h_in_currency < 0 ? '#a53939' : '#96ffae'}` }}>
                        {coin.price_change_percentage_24h_in_currency.toFixed(1)}%
                    </td>
                    <td>
                        {symbol} {coin.low_24h.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })} / {symbol} {coin.high_24h.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </td>
                </tr>
            );
        });
    }

    setCurrency = (currency) => {
        if (this.state.currency === currency) {
            return;
        }

        clearInterval(this.timerID);
        this.setState({ currency }, () => {
            this.props.fetchCoins(this.state.currency);
            this.timerID = setInterval(() => {
                this.props.fetchCoins(this.state.currency);
            }, 10000);
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
            <div className="coin-wrapper">
                <div className="ui grid">
                    <div className="eight wide column left floated center aligned">
                        <h2 className="ui header main-title">
                            Crypto Coin Tracker
                        </h2>
                    </div>
                    <div className="four wide column">
                        <div className="ui large buttons right floated right aligned">
                            <button onClick={() => this.setCurrency('php')} className={`ui button ${this.state.currency === 'php' ? 'active' : ''}`}>PHP</button>
                            <div className="or"></div>
                            <button onClick={() => this.setCurrency('usd')} className={`ui button ${this.state.currency === 'usd' ? 'active' : ''}`}>USD</button>
                        </div>
                    </div>
                </div>
                
                
                <table className="ui inverted teal table">
                    <thead>
                        <tr>
                            <th>COIN</th>
                            <th>PRICE</th>
                            <th>1HR</th>
                            <th>24HR</th>
                            <th>LOW / HIGH 24hr</th>
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