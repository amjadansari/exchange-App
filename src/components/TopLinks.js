// This component renders the top Links "Exchange" & "Cancel"
// if the user click on Exchange link, It takes from Input box and transfer into To Wallet
// if the user click on the cancel Link, It clear the input box 

import React from "react";
import {observer} from 'mobx-react';
import { List } from "semantic-ui-react";

@observer
class TopLinks extends React.Component {  

  constructor(props) {
    super(props);
    this.store = props.store;
  }
  
  componentDidMount() {
  }

  clearInput() {
    this.store.setFromValue(0);
    this.store.setToValue(0);
    this.store.setConversionError(false);
    this.store.setConversionSuccess(false);
  }

  render () { 
     const {
      fromValue,
      toValue,
      fromCurrencyCode,
      toCurrencyCode,
    } = this.props.store.state;

    return (
        <List key="topLinks" divided inverted verticalAlign='middle' className="topLink">
            <List.Item>
              <List.Content 
                as='a'
                floated='right'
                onClick={() =>
                  this.store.exchangeCurrency(
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
                onClick={() => this.clearInput()}
              >
                Cancel
              </List.Content>
            </List.Item>
          </List>
    );
  }
}

export default TopLinks;

