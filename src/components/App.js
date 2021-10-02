import 'semantic-ui-css/semantic.min.css'
import React from 'react';
import CoinList from '../components/CoinList';

const App = () => {
    return (
        <div className="ui container">
            <CoinList />
        </div>
    );
};

export default App;