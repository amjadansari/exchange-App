import { observable, action, computed, runInAction } from "mobx";
import { create, persist } from "mobx-persist";
import localForage from 'localforage'
import { getRates } from "../api/apiCalls";

class Store {
  @observable
  state = {
    fromCurrencyCode: "EUR",
    toCurrencyCode: "EUR",
    fromValue: 1,
    toValue: 1,
    conversionError: false,
    conversionSuccess: false,
    conversionMsg: ""
  };

  @observable rates = [];

  @persist('object') 

  @observable
    wallets = {
      GBP: 10000,
      EUR: 10000,
      USD: 10000,    
    };

  async fetchRates() {
    this.rates = {};
    try {
      const rates = await getRates();
      runInAction(() => {
        this.rates = rates.data.rates;
        return this.rates;
      });
    } catch (error) {
      runInAction(() => {
        throw new Error(error);
      });
    }
  }

  @action
  setConversionError(flag) {
    this.state.conversionError = flag;
  }
  @action
  setConversionSuccess(flag) {
    this.state.conversionSuccess = flag;
  }
  @action
  setConversionMsg(msg) {
    this.state.conversionMsg = msg;
  }

  @action
  convertCurrency(fromValue, fromWallet, toValue, toWallet) {
    this.wallets[fromWallet] -= parseFloat(fromValue, 10);
    this.wallets[toWallet] += parseFloat(toValue, 10);
  }

  @action
  setFromCurrency(currencyCode) {
    this.state.fromCurrencyCode = currencyCode;
  }

  @action
  setToCurrency(currencyCode) {
    this.state.toCurrencyCode = currencyCode;
  }

  @action
  setFromValue(value) {
    this.state.fromValue = value ? parseFloat(value, 10) : '';
  }

  @action
  setToValue(value) {
    this.state.toValue = value ? parseFloat(value, 10) : '';
  }

  /**
   * This function is called once the user clicks on the top exchange link on the screen and display message
   * it validate if from Wallet have lesser amount then user have typed in input box
   * it validate if user havn't entered any amount in the inputbox
   * it validate if user have selected from & To wallet of same currency
   */

  @action
   exchangeCurrency (
    fromValue: number,
    fromWallet: string,
    toValue: number,
    toWallet: string
  ): void {
    this.setConversionError(false);
    this.setConversionSuccess(false); 

    if (this.wallets[fromWallet] - fromValue < 0) {
      this.setConversionError(true);
      this.state.conversionMsg = `You don't have enough balance in ${fromWallet} wallet!`;
    } 
    else if ((fromValue || toValue) && (fromWallet !== toWallet)){
      this.convertCurrency(fromValue, fromWallet, toValue, toWallet);
      this.setConversionSuccess(true);
      this.state.conversionMsg = `Exchange to ${toWallet}`;
    }
    else if ((fromValue || toValue) && (fromWallet === toWallet)) {
      this.setConversionError(true);
      this.state.conversionMsg = `You can't transfer to same Wallet`;
    }
    else {
      this.setConversionError(true);
      this.state.conversionMsg = `please enter your desired amount to convert to ${toWallet}`;
    }
  }

  /**
   * When User update from Field
   */

  @computed
  get exchangeToRate() {
    const value = this.state.fromValue;
    const fromCurrencyCode = this.state.fromCurrencyCode;
    const toCurrencyCode = this.state.toCurrencyCode;
    let result;
    result = value / this.rates[fromCurrencyCode] * this.rates[toCurrencyCode];
      return result.toFixed(2);
  }
  /**
   * When User update To Field
   */
  @computed
  get exchangeFromRate() {
    const value = this.state.toValue;
    const toCurrencyCode = this.state.toCurrencyCode;
    const fromCurrencyCode = this.state.fromCurrencyCode;
    let result;
    result = value / this.rates[fromCurrencyCode] * this.rates[toCurrencyCode];
    return result.toFixed(2);
  }
} 
const hydrate = create({
  storage: localForage,
  jsonify: false,
});

const store = new Store();

export default store;
hydrate('wallets', store);
