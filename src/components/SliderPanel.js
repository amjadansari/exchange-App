import React from "react";
import {observer, inject} from 'mobx-react';
import { toCurrencyString, hasClass } from "../utils/utils";
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
     // this.prevSlide = this.prevSlide.bind(this);  
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

    // if (panel === "to") {
    //   this.store.setToCurrency(value);
    //   this.store.setToValue(this.store.exchangeToRate);
    // }
    // else {
    //   this.store.setFromCurrency(value);
    //   this.store.setFromValue(this.store.exchangeFromRate);
    // }
    this.setState({
      activeIndex: parseInt(e.target.textContent,10),
    })
  }

  updateOtherInput = (panel, value) => {
    // const { store } = this.props;
    if (panel === "from") {
      console.log("change in", panel);
      this.store.setFromValue(value);
      this.store.setToValue(this.store.exchangeToRate);
    }
    else {
      console.log("change in", panel);
      this.store.setToValue(value);
      this.store.setFromValue(this.store.exchangeFromRate);
    }
  }

   renderCurrentRate() {
    const toRate = this.props.data.toValue;
    const frmoate = this.props.data.fromValue;

    return (
      <React.Fragment>
        {toCurrencyString(1, this.props.data.fromCurrencyCode)}
          -
        {toCurrencyString(toRate/frmoate, this.props.data.toCurrencyCode)}
      </React.Fragment>
    );
  }
  
  render () { 
    return (
        <Swipe
            onSwipeMove={this.onSwipeMove}
            onSwipeEnd={this.onSwipeEnd}>
          <div >
        <div  className="slider-wrapper">
        <List divided inverted verticalAlign='middle' className="slider">
            {this.props.currencies.map(response =>  {
            return (
              <List.Item className={`${response.index+1 === this.state.activeIndex ? (`slider-item ${this.state.onSwipeDirection}`) : 'hide'}`}
                value={response.value} >
                {response.value}
              </List.Item>
            )
          },this)
          }
          </List>
          <Input
            fluid
            transparent
            size='big'
            placeholder="- -"
            type="number"
            value={this.props.panelID === "from" ? this.props.data.fromValue : this.props.data.toValue}
            onChange={event => this.updateOtherInput(this.props.panelID, event.target.value)}
          />
        </div>

            <List divided inverted verticalAlign='middle'>
            <List.Item>
              {this.props.panelID === "to" && 
                <List.Content 
                floated='right'
                className="white"
                >
                {this.renderCurrentRate()}
              
              </List.Content>
              }

              <List.Content
                floated='left'
              >
                {this.props.currencies.map(({ value }) => {
                  if ((this.props.panelID === "from" ? this.props.data.fromCurrencyCode : this.props.data.toCurrencyCode) === value){
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
            {this.props.currencies.map(response =>   {
              return (
                <li className={response.index+1 === this.state.activeIndex ? 'active-indicator' : ''} value={response.value} onClick={(e) => this.clickIndicator(e, response.value, this.props.panelID)} >{response.index+1}</li>
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

