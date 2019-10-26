import axios from 'axios'
const {REACT_APP_APP_ID} = process.env

export const getRates = async (currencyCode) => {
	const requestUrl = `http://data.fixer.io/api/latest?access_key=${REACT_APP_APP_ID}&format=1&symbols=GBP,EUR,USD`;
    const response = await axios.get(requestUrl);
    console.log("response", response.data.rates);
    return response;
}
