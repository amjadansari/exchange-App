//@flow

import React, { Component } from "react";
import { observer } from "mobx-react";
import SliderPanel from "./SliderPanel";

import {
  Message,
  List,
  Icon
} from "semantic-ui-react";
import { toCurrencyString } from "./utils/utils";
import "./css/style.css";


@observer
class App extends Component {
  state = {
    conversionError: false,
    conversionSuccess: false,
    conversionErrorMsg: "",
    conversionSuccessMsg: ""
  };
  constructor(props) {
    super(props);
    this.store = props.store;
  }
  

  componentDidMount() {

    this.store.fetchRates();
    //Fetches rates every 10 seconds
    setInterval(function() {
      this.store.fetchRates();
      console.log("Rates are fetched", this.store.rates);
    }, 10 * 1000000);
  }

  clearMessage() {
    this.setState({
      conversionError: false,
      conversionSuccess: false
    })
  }

  convertCurrency (
    fromValue: number,
    fromWallet: string,
    toValue: number,
    toWallet: string
  ): void {
    this.setState({
        conversionError: false,
        conversionSuccess: false
      });
    const { conversionError, conversionSuccess } = this.state;
    if (this.store.wallets[fromWallet] - fromValue < 0) {
      this.setState({
        conversionError: true,
        conversionErrorMsg: `You don't have enough balance in ${fromWallet} wallet!`
      });
    } else {
      this.store.convertCurrency(fromValue, fromWallet, toValue, toWallet);
      this.setState({
        conversionSuccess: true,
        conversionSuccessMsg: `Exchange to ${toWallet}`
      });
    }
  }

  renderIfError() {
    return (
      <React.Fragment>
        {this.state.conversionError && (
          <Message negative floating>
            <p>{this.state.conversionErrorMsg}</p>
          </Message>
        )}
      </React.Fragment>
    );
  }

  renderIfSuccess() {
    var timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return (
      <React.Fragment>
        {this.state.conversionSuccess && (
          <Message icon floating>
            <Icon name='sync' size='small'/>
            <Message.Content>
              <Message.Header> {this.state.conversionSuccessMsg} <span className='right'>+{toCurrencyString(this.props.store.state.toValue, this.props.store.state.toCurrencyCode)}</span> </Message.Header>
              {timestamp} <span className='right'> - {toCurrencyString(this.props.store.state.fromValue, this.props.store.state.fromCurrencyCode)}</span>
            </Message.Content>
          </Message>
        )}
      </React.Fragment>
    );
  }

  render() {
    const {
      fromValue,
      toValue,
      fromCurrencyCode,
      toCurrencyCode
    } = this.props.store.state;

    const { conversionError, conversionErrorMsg, conversionSuccess, conversionSuccessMsg } = this.state;

    const currencies = [
      {value: "GBP", index: 0 },
      {value: "EUR", index: 1 },
      {value: "USD", index: 2 }      
    ];
  return (
      <div className="currency-converter">
        <div className="converter-container">
          <List divided inverted verticalAlign='middle' className="topLink">
            <List.Item>
              <List.Content 
                as='a'
                floated='right'
                negative={conversionError}
                positive={conversionSuccess}
                onClick={() =>
                  this.convertCurrency(
                    fromValue,
                    fromCurrencyCode,
                    toValue,
                    toCurrencyCode
                  )
                }
                >
                Exchange
              </List.Content>
              
              <List.Content
                as='a'
                floated='left'
                negative={conversionError}
                positive={conversionSuccess}
                onClick={() =>
                  this.convertCurrency(
                    toValue,
                    toCurrencyCode,
                    fromValue,
                    fromCurrencyCode
                  )
                }
              >
                Cancel
              </List.Content>
            </List.Item>
          </List>
          <div className="from-currency" onClick={() => this.clearMessage() }>
            <SliderPanel key="from" panelID="from" data={this.props.store.state} currencies={currencies} wallets={this.store.wallets} store={this.store}/>
          </div>
          <div className="triangle"></div>
          <div className="to-currency" onClick={() => this.clearMessage() }>
            <SliderPanel key="to" panelID="to" data={this.props.store.state} currencies={currencies} wallets={this.store.wallets} store={this.store}/>
          </div>
          <div className="convert-container-bottom"> 
            {this.renderIfError()}
            {this.renderIfSuccess()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
