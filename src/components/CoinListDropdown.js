import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const CoinListDropdown = (props) => (
  <Dropdown
    button
    className='icon'
    floating
    labeled
    icon={props.icon}
    options={props.options}
    search
    value={props.value}
    onChange={props.onChange}
  />
);

export default CoinListDropdown;