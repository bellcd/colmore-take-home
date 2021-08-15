import './App.css';
import MUIDataTable from "mui-datatables";
import messages from './constants/messages';
import {
  removeLeadingIntegersFromKeys,
  transformBestMatches,
  transformHistoricalPrices,
  transformSMA,
  replaceSpacesWithDashes
} from './utilities/transformations'
import { useState, useEffect } from 'react';

const App = () => {
  const { keywordText, search } = messages;
  const [keyword, setKeyword] = useState('');
  const [securitiesData, setSecuritiesData] = useState([]);
  const [selectedSecuritySymbol, setSelectedSecuritySymbol] = useState(null);
  const [selectedSecuritySymbol5MinuteData, setSelectedSecuritySymbol5MinuteData] = useState([]);
  const [selectedSecuritySymbol60MinuteData, setSelectedSecuritySymbol60MinuteData] = useState([]);
  const [selectedSecuritySymbolIndicatorSMAData, setSelectedSecuritySymbolIndicatorSMAData] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [globalQuoteInfo, setGlobalQuoteInfo] = useState({});

  // TODO: finish this logic
  useEffect(() => {
    const apiKey = localStorage.getItem('API_KEY')
    setApiKey(apiKey);
  }, []);

  const getSecurities = (event) => {
    event.preventDefault();
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setSecuritiesData(transformBestMatches(data.bestMatches));
      })
      // TODO: proper error handling
      .catch(console.log)
  };

  const getHistoricalPrices = (symbol, interval, setterFn) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const timeSeriesData = data[`Time Series (${interval})`];
        const transformedData = transformHistoricalPrices(timeSeriesData);
        setterFn(transformedData);
      })
      // TODO: proper error handling
      .catch(console.log)
  };

  const getSMA = (symbol, interval) => {
    const url = `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=${interval}&time_period=60&series_type=open&apikey=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // debugger;
        const transformed = transformSMA(data['Technical Analysis: SMA']);
        setSelectedSecuritySymbolIndicatorSMAData(transformed);
      })
      // TODO: proper error handling
      .catch(console.log)
  };

  const getGlobalQuote = symbol => {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const transformedGlobalQuote = removeLeadingIntegersFromKeys(data['Global Quote'])
        setGlobalQuoteInfo(transformedGlobalQuote);
      })
      .catch(console.log)
  };


  const securitiesColumns = [
    {
      name: "symbol",
      label: "Symbol",
    },
    {
      name: "name",
      label: "Name",
    },
    {
      name: "type",
      label: "Type",
    },
    {
      name: "region",
      label: "Region",
    },
    {
      name: "marketOpen",
      label: "Market Open",
    },
    {
      name: "marketClose",
      label: "Market Close",
    },
    {
      name: "timezone",
      label: "Timezone",
    },
    {
      name: "currency",
      label: "Currency",
    },
    {
      name: "matchScore",
      label: "Match Score",
    },
  ];

  const securitiesOptions = {
    filterType: 'checkbox',
    selectableRows: 'single',
    onRowSelectionChange: newRow => {
      const symbol = securitiesData[newRow[0].index].symbol;
      setSelectedSecuritySymbol(symbol);
      getHistoricalPrices(symbol, '5min', setSelectedSecuritySymbol5MinuteData);
      getHistoricalPrices(symbol, '60min', setSelectedSecuritySymbol60MinuteData);
      getSMA(symbol, '5min');
      getGlobalQuote(symbol);
    }
  };

  const selectedSecuritySymbolHistoricalPricesColumns = [
    {
      name: "timeStamp",
      label: "Time Stamp",
    },
    {
      name: "close",
      label: "Close",
    },
    {
      name: "high",
      label: "High",
    },
    {
      name: "low",
      label: "Low",
    },
    {
      name: "open",
      label: "Open",
    },
    {
      name: "volume",
      label: "Volume",
    },
  ];
  const selectedSecuritySymbolHistoricalPricesOptions = {};

  const selectedSecuritySymbolIndicatorSMAColumns = [
    {
      name: "timeStamp",
      label: "Time Stamp",
    },
    {
      name: "SMA",
      label: "Simple Moving Average",
    },
  ];
  const selectedSecuritySymbolIndicatorSMAOptions = {};



  return (
    <>
      <form>
        <label htmlFor="keyword">{keywordText}</label>
        <input
          type="text"
          id="keyword"
          onChange={event => setKeyword(event.target.value)}
        ></input>
        <button
          onClick={getSecurities}
        >{search}</button>
      </form>
      <MUIDataTable
        title="Securities"
        data={securitiesData}
        columns={securitiesColumns}
        options={securitiesOptions}
      />
      {Object.entries(globalQuoteInfo).map(([key, value], index) => {
        const keyWithoutWhitespace = replaceSpacesWithDashes(key);
        return (
          <div key={index} className="global-quote-info__container">
            <div className={`global-quote-info__${keyWithoutWhitespace}`}>
              <span className={`global-quote-info__${keyWithoutWhitespace}-label`}>{key}</span>
              <span className={`global-quote-info__${keyWithoutWhitespace}-value`}>{value}</span>
            </div>
          </div>
        );
      })}
      <MUIDataTable
        title={`5 Minute Prices for ${selectedSecuritySymbol} with SMA`}
        data={selectedSecuritySymbol5MinuteData}
        columns={selectedSecuritySymbolHistoricalPricesColumns}
        options={selectedSecuritySymbolHistoricalPricesOptions}
      />
      <MUIDataTable
        title={`60 Minute Prices for ${selectedSecuritySymbol} with SMA`}
        data={selectedSecuritySymbol60MinuteData}
        columns={selectedSecuritySymbolHistoricalPricesColumns}
        options={selectedSecuritySymbolHistoricalPricesOptions}
      />
      <MUIDataTable
        title="Indicators"
        data={selectedSecuritySymbolIndicatorSMAData}
        columns={selectedSecuritySymbolIndicatorSMAColumns}
        options={selectedSecuritySymbolIndicatorSMAOptions}
      />
    </>
  );
}

export default App;


// IMPROVEMENTS
  // choose styling approach, either CSS-in-JS (as with material ui), or as separate stylesheets (as with BEM styling, SASS)
  // polish styling
  // loading states
