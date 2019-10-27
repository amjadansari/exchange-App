//This component contains all the sub components and renders based on the store states

import React, { Component } from "react";
import { observer } from "mobx-react";
import SliderPanel from "./components/SliderPanel";
import TopLinks from "./components/TopLinks";
import MsgBox from "./components/MsgBox";
import "./css/style.css";


@observer
class App extends Component {

  constructor(props) {
    super(props);
    this.store = props.store;
  }
  
  componentDidMount() {
    this.store.fetchRates();
    //change the value to Fetches rates every 10 seconds
    setInterval(function() {
      this.store.fetchRates();
      console.log("Rates are fetched", this.store.rates);
    }.bind(this), 10 * 100000);
  }

  clearMessage() {
    this.store.setConversionError(false);
    this.store.setConversionSuccess(false);
  }

  render() {
    return (
      <div className="currency-converter">
        <div className="converter-container">

          <TopLinks store={this.store}/>

          <div className="from-currency" onClick={() => this.clearMessage() }>
            <SliderPanel key="from" panelID="from" store={this.store}/>
          </div>

          <div className="triangle"></div>

          <div className="to-currency" onClick={() => this.clearMessage() }>
            <SliderPanel key="to" panelID="to" store={this.store}/>
          </div>

          <div className="convert-container-bottom"> 
            <MsgBox store={this.store}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
