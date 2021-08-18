import axios from 'axios';
import { API_BASE_URL } from '../config/main'
import {
  transformBestMatches,
  transformHistoricalPrices,
  transformSMA,
  removeLeadingIntegersFromKeys
} from '../utilities/transformations'
import alphaVantage from '../constants/alphaVantage';

export const alphaVantageGet = async (url, params) => {
  const response = await axios.get(url, { params });
  if (response.status >= 400) throw new Error(response.error);
  return response;
};

export const getSecurities = (keyword, apikey) => {
  const params = {
    function: alphaVantage.symbolSearch,
    keywords: keyword,
    apikey
  };
  return alphaVantageGet(API_BASE_URL, params)
    .then(response => {
      return transformBestMatches(response.data.bestMatches);
    });
};


export const getHistoricalPrices = (symbol, interval, apikey) => {
  const params = {
    function: alphaVantage.timeSeriesIntraday,
    symbol,
    interval,
    apikey
  };

  return alphaVantageGet(API_BASE_URL, params)
    .then(response => {
      const timeSeriesData = response.data[`Time Series (${interval})`];
      return transformHistoricalPrices(timeSeriesData)
    })
};


export const getSMA = (symbol, interval, apikey) => {
  const params = {
    function: alphaVantage.SMA,
    symbol,
    interval,
    time_period: 60,
    series_type: alphaVantage.open,
    apikey
  }

  return alphaVantageGet(API_BASE_URL, params)
    .then(response => {
      return transformSMA(response.data['Technical Analysis: SMA']);
    });
};

export const getGlobalQuote = (symbol, apikey) => {
  const params = {
    function: alphaVantage.globalQuote,
    symbol,
    apikey
  };

  return alphaVantageGet(API_BASE_URL, params)
    .then(response => {
      return removeLeadingIntegersFromKeys(response.data['Global Quote'])
    });
};