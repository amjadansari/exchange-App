// This component shows Error & Success message once user click on the Exchange Link on the top
import React from "react";
import {observer} from 'mobx-react';
import { toCurrencyString } from "../utils/utils";

import {
  Message,
  Icon
} from "semantic-ui-react";

@observer
class MsgBox extends React.Component {  

  constructor(props) {
    super(props);
    this.store = props.store;
  }
  
  componentDidMount() {
  }

  renderIfError() {
    return (
      <React.Fragment>
        <Message negative floating>
          <p>{this.store.state.conversionMsg}</p>
        </Message>
      </React.Fragment>
    );
  }

  renderIfSuccess() {
    var timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return (
      <React.Fragment>
        <Message icon floating>
            <Icon name='sync' size='small'/>
            <Message.Content>
              <Message.Header> {this.store.state.conversionMsg} <span className='right'>+{toCurrencyString(this.props.store.state.toValue, this.props.store.state.toCurrencyCode)}</span> </Message.Header>
              {timestamp} <span className='right'> - {toCurrencyString(this.props.store.state.fromValue, this.props.store.state.fromCurrencyCode)}</span>
            </Message.Content>
          </Message>
      </React.Fragment>
    );
  }
  

  render () { 
    return (
        <div className="msgBox">
          {(this.store.state.conversionSuccess) ? (this.renderIfSuccess()) : ((this.store.state.conversionError) ? (this.renderIfError()) : "")}
        </div>
    );
  }
}

export default MsgBox;

