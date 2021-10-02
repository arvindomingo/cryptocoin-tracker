import './CoinList.css';
import React from 'react';
import { connect } from 'react-redux';
import { fetchCoins } from '../actions';
import CoinListDropdown from './CoinListDropdown';
import { DEFAULT_COINS } from '../actions/types';
import { Form, Icon } from 'semantic-ui-react';

class CoinList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currency: 'php',
            convertto: [],
            selectedCoin: '',
            coinToConvert: '',
            currencyToConvert: ''
        };
    }

    componentDidMount() {
        this.props.fetchCoins(this.state.currency);
        this.timerID = setInterval(() => {
            this.props.fetchCoins(this.state.currency);
        }, 10000);
        this.setState({ selectedCoin: this.props.defaultCoins[0].value })
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
                    <td>
                        <span style={{ color: `${coin.price_change_percentage_1h_in_currency < 0 ? '#a53939' : '#96ffae'}` }}>
                            {coin.price_change_percentage_1h_in_currency.toFixed(1)}%
                        </span> <span> | </span>  
                        <span style={{ color: `${coin.price_change_percentage_24h_in_currency < 0 ? '#a53939' : '#96ffae'}` }}>
                            {coin.price_change_percentage_24h_in_currency.toFixed(1)}%
                        </span>
                    </td>
                    <td>
                        {symbol} {coin.low_24h.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })} | {symbol} {coin.high_24h.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </td>
                </tr>
            );
        });
    }

    setCurrency = (e, { value }) => {
        if (this.state.currency === value) {
            return;
        }

        clearInterval(this.timerID);
        this.setState({ currency: value }, async () => {
            await this.props.fetchCoins(this.state.currency);
            this.converter('currency', { value: this.state.coinToConvert });
            this.timerID = setInterval(() => {
                this.props.fetchCoins(this.state.currency);
            }, 10000);
        });

    }

    converter = (convertTo = 'currency', props) => {
        const symbolToCompare = this.state.selectedCoin.toLowerCase();
        if (convertTo === 'currency') {
            let currencyToConvert = 0;
            this.props.coins.map((coin) => {
                if (coin.symbol === symbolToCompare) {
                    return currencyToConvert = props.value * coin.current_price;
                }
                return null;
            });
            this.setState({
                coinToConvert: props.value,
                currencyToConvert
            });
        } else if (convertTo === 'coin') {
            let coinToConvert = 0;
            this.props.coins.map((coin) => {
                if (coin.symbol === symbolToCompare) {
                    return coinToConvert = props.value / coin.current_price;
                }
                return null;
            });
            this.setState({
                currencyToConvert: props.value,
                coinToConvert
            });
        }
    }

    selectedCoin = (e, { value }) => {
        this.setState({ selectedCoin: value }, () => {
            this.converter('currency', { value: this.state.coinToConvert });
        });
    }

    coinToConvert = (e, props) => {
        this.converter('currency', props);
    }

    currencyToConvert = (e, props) => {
        this.converter('coin', props);
    }

    renderConverter() {
        return (
            <Form>
                <Form.Group>
                    <CoinListDropdown options={this.props.defaultCoins} icon="bitcoin" value={this.state.selectedCoin} onChange={this.selectedCoin} />
                    <Form.Input
                        placeholder='Coin Amount'
                        name='cointamount'
                        value={this.state.coinToConvert}
                        type='number'
                        onChange={this.coinToConvert}
                    />
                    <Icon name='exchange' style={{ margin: '10px' }} />
                    <CoinListDropdown options={this.props.currencyOptions} icon="currency" value={this.state.currency} onChange={this.setCurrency} />
                    <Form.Input
                        placeholder='Currency Amount'
                        name='currencyamount'
                        value={this.state.currencyToConvert}
                        type='number'
                        onChange={this.currencyToConvert}
                    />
                </Form.Group>
            </Form>
        );
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
                <div className="ui right aligned grid">
                    <div className="right aligned sixteen wide column converter-container">
                        {this.renderConverter()}
                    </div>
                </div>
                
                
                <table className="ui inverted teal table">
                    <thead>
                        <tr>
                            <th>CRYPTOCOIN TRACKER</th>
                            <th>PRICE</th>
                            <th>1HR | 24 HR Diff</th>
                            <th>LOWEST | HIGHEST 24HR</th>
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
    const defaultCoins = [];
    DEFAULT_COINS.map(({ symbol, code }) => {
        return defaultCoins.push({ key: code, text: symbol, value: symbol });
    });
    const currencyOptions = [
        { key: 'php', text: 'PHP', value: 'php' },
        { key: 'usd', text: 'USD', value: 'usd' },
    ];
    return {
        coins: Object.values(state.coins),
        defaultCoins,
        currencyOptions
    };
};

export default connect(
    mapStateToProps,
    { fetchCoins }
)(CoinList);