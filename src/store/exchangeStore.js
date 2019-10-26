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
    toValue: 1
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
  convertCurrency(fromValue, fromWallet, toValue, toWallet) {
    this.wallets[fromWallet] -= fromValue;
    this.wallets[toWallet] += toValue;
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
   * When User update in from Field
   */
  @computed
  get exchangeToRate() {
    const value = this.state.fromValue;
    const fromCurrencyCode = this.state.fromCurrencyCode;
    const toCurrencyCode = this.state.toCurrencyCode;
    // console.log("toCurrencyCode", toCurrencyCode);
    let result;
    if (toCurrencyCode === "USD" && fromCurrencyCode === "USD") {
      // console.log("to if 1");
      return value;
    } else if (toCurrencyCode === "USD") {
      // console.log("to if 2");
      result = value * this.rates[toCurrencyCode];
      // console.log("to USD result", this.rates[toCurrencyCode])
      return result.toFixed(2);
    } else if (fromCurrencyCode === "USD") {
      // console.log("to if 3");
      result = value * this.rates[fromCurrencyCode];
      return result.toFixed(2);
    } else {
      // console.log("to if 4");
      result =
        value / this.rates[fromCurrencyCode] * this.rates[toCurrencyCode];
      return result.toFixed(2);
    }
  }
  /**
   * When User update in To Field
   */
  @computed
  get exchangeFromRate() {
    const value = this.state.toValue;
    const toCurrencyCode = this.state.toCurrencyCode;
    const fromCurrencyCode = this.state.fromCurrencyCode;
    // console.log("fromCurrencyCode", fromCurrencyCode);
    let result;
    if (fromCurrencyCode === "USD" && toCurrencyCode === "USD") {
      // console.log("from if 1");
      return value;
    } else if (toCurrencyCode === "USD") {
      // console.log("from if 2");
      result = value * this.rates[toCurrencyCode];
      return result.toFixed(2);
    } else if (fromCurrencyCode === "USD") {
      // console.log("from if 3", this.rates[fromCurrencyCode]);
      result = value * this.rates[fromCurrencyCode];
      return result.toFixed(2);
    } else {
      // console.log("from if 4");
      result =
        value / this.rates[toCurrencyCode] * this.rates[fromCurrencyCode];
      return result.toFixed(2);
    }
  }
} 
const hydrate = create({
  storage: localForage,
  jsonify: false,
});

const store = new Store();

export default store;
hydrate('wallets', store);
