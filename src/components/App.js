import React from 'react';
import CoinList from '../components/CoinList';

const App = () => {
    return (
        <div className="ui container" style={{ marginTop: '60px', fontSize: '2rem' }}>
            <CoinList />
        </div>
    );
};

export default App;