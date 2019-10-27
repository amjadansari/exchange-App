// This component renders the sliding Wallet along with the input filed.
// If the user slide the wallet it changes the amount showing in the input box based on the currency and input box on the other slide
import React from "react";
import {observer, inject} from 'mobx-react';
import { toCurrencyString, hasClass } from "../utils/utils";
import CurrentExchangeRate from "../components/CurrentExchangeRate";
import Swipe from 'react-easy-swipe';

import {
  List,
  Input
} from "semantic-ui-react";

@inject("store")
@observer

class SliderPanel extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
    this.state = { 
      slider: ["first", "second", "third"],
      activeIndex: 2,
      onSwipeEnd: false,
      onSwipeDirection:''
     };
  }
  
  componentDidMount() {
  }

  onSwipeMove = (position, event) => {
    var toCurrency = hasClass(event.target, 'to-currency');
    if(position.x > 1 && this.state.onSwipeEnd){
      this.nextSlide(toCurrency);
    }
    else if (position.x < 1 && this.state.onSwipeEnd){
      this.prevSlide(toCurrency);
    }

    this.setState({
      onSwipeEnd: false,
    })
  }
 
  onSwipeEnd =(event) => {
    this.setState({
      onSwipeEnd: true,
    })
  }

  setCurrencyValue =(tocurrency, currencyIndex) => {
    if (tocurrency) {
      this.store.setToCurrency(currencyIndex);
      this.store.setToValue(this.store.exchangeToRate);    
    }
    else {
      this.store.setFromCurrency(currencyIndex);
      this.store.setFromValue(this.store.exchangeFromRate);  
    }
  }

  prevSlide = (tocurrency) => {
    var activeIndex = this.state.activeIndex;
    var currency = Object.keys(this.store.rates);

    if (activeIndex === 1) {
      activeIndex = currency.length;
    }
    else {
      activeIndex = activeIndex - 1;
    }

    this.setCurrencyValue(tocurrency, currency[activeIndex - 1]);

    this.setState({
      activeIndex: activeIndex,
      onSwipeDirection: 'left'
    })
  }

  nextSlide = (tocurrency) => {
    var currency = Object.keys(this.store.rates);
    var activeIndex = this.state.activeIndex;

    if (activeIndex === currency.length) {
      activeIndex = 1 ; 
    }
    else {
      activeIndex = activeIndex + 1;
    } 
    this.setCurrencyValue(tocurrency, currency[activeIndex - 1]);
    this.setState({
      activeIndex: activeIndex,
      onSwipeDirection: 'right'
    })
  }

  clickIndicator = (e, value, panel) => {
    this.setCurrencyValue((panel === "to"), value);
    this.setState({
      activeIndex: parseInt(e.target.textContent,10),
    })
  }

  updateOtherInput = (panel, value, fromCurrencyCode) => {
    const fromWalletValue = this.store.wallets[fromCurrencyCode];
    if (panel === "from") { 
      this.store.setFromValue(value);
      this.store.setToValue(this.store.exchangeToRate);
    }
    else {
      this.store.setToValue(value);
      this.store.setFromValue(this.store.exchangeFromRate);
    }
    if (value > fromWalletValue) {
       this.store.setConversionError(true);
       this.store.setConversionMsg(`You don't have enough balance in ${fromCurrencyCode} Wallet`);
    }
  }
  
  render () { 
    const {
      fromValue,
      toValue,
      fromCurrencyCode,
      toCurrencyCode,
    } = this.props.store.state;
    return (
        <Swipe
            onSwipeMove={this.onSwipeMove}
            onSwipeEnd={this.onSwipeEnd}>
          <div >
        <div  className="slider-wrapper">
        <List divided inverted verticalAlign='middle' className="slider">
            {Object.keys(this.store.rates).map((value, index) => {
            return (
              <List.Item key={index} className={`${index+1 === this.state.activeIndex ? (`slider-item ${this.state.onSwipeDirection}`) : 'hide'}`} >
                {value}
              </List.Item>
            )
          },this)
          }
          </List>
          <Input
            fluid
            transparent
            size='big'
            type="number"
            value={this.props.panelID === "from" ? fromValue : toValue}
            onChange={event => this.updateOtherInput(this.props.panelID, event.target.value, fromCurrencyCode)}
          />
        </div>

          <List divided inverted verticalAlign='middle'>
            <List.Item key={this.props.panelID}>
              {this.props.panelID === "to" && 
                <CurrentExchangeRate store={this.store}/>
              }

              <List.Content
                floated='left'
              >
                {Object.keys(this.store.rates).map((value) => {
                  if ((this.props.panelID === "from" ? fromCurrencyCode : toCurrencyCode) === value){
                    return (
                      <span className="white" key={value}>
                          You have {toCurrencyString(this.store.wallets[value], value)}
                      </span>
                  );
                  }
                })}
              </List.Content>
            </List.Item>
          </List>

        <div className="indicators-wrapper">
          <ul className="indicators">
            {Object.keys(this.store.rates).map((value, index) => {
              return (
                <li key={index} className={index+1 === this.state.activeIndex ? 'active-indicator' : ''} value={value} onClick={(e) => this.clickIndicator(e, value, this.props.panelID)} >{index+1}</li>
              )
            },this)}
          </ul>
        </div>
      </div>
      </Swipe>
      
    );
  }
}

export default SliderPanel;

