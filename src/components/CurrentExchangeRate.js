// This component shows exchange rate based on the from & To wallet selected from the panel
import React from "react";
import {observer} from 'mobx-react';
import { toCurrencyString } from "../utils/utils";
import { List } from "semantic-ui-react";

@observer
class CurrentExchangeRate extends React.Component {  

  constructor(props) {
    super(props);
    this.store = props.store;
  }
  

  render () { 
    const fromCurrencyCode = this.store.state.fromCurrencyCode;
    const toCurrencyCode = this.store.state.toCurrencyCode;
    const toRate = this.store.rates[toCurrencyCode];
    const fromRate = this.store.rates[fromCurrencyCode];

    return (
        <div className="CurrentExchange">
          <List.Content 
            floated='right'
            className="white"
            >
            {toCurrencyString(1, fromCurrencyCode)}
              -
            {toCurrencyString((toRate/fromRate), toCurrencyCode)}
          
          </List.Content>
        </div>
    );
  }
}

export default CurrentExchangeRate;

