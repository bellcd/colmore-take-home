import './App.css';
import MUIDataTable from "mui-datatables";
import messages from './constants/messages';
import {
  replaceSpacesWithDashes
} from './utilities/transformations'
import {
  getSecurities,
  getHistoricalPrices,
  getSMA,
  getGlobalQuote
} from './services/securitiesService';
import { useState } from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import LandingPage from './LandingPage';
import {
  securitiesColumns,
  selectedSecuritySymbolHistoricalPricesColumns,
  selectedSecuritySymbolIndicatorSMAColumns
} from './constants/tableColumns';
import { useApikey } from './services/apikey';

const App = () => {
  const {
    KEYWORD_TEXT,
    SEARCH,
    IBM,
    INDICATORS,
    SECURITIES
  } = messages;

  // TODO: improvement, implement better state management, for easier extension
  const [keyword, setKeyword] = useState('');
  const [securitiesData, setSecuritiesData] = useState([]);
  const [selectedSecuritySymbol, setSelectedSecuritySymbol] = useState(null);
  const [selectedSecuritySymbol5MinuteData, setSelectedSecuritySymbol5MinuteData] = useState([]);
  const [selectedSecuritySymbol60MinuteData, setSelectedSecuritySymbol60MinuteData] = useState([]);
  const [selectedSecuritySymbolIndicatorSMAData, setSelectedSecuritySymbolIndicatorSMAData] = useState([]);
  const [hasApikey, setHasApikey] = useState(false);
  const [apikey, setApikey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [globalQuoteInfo, setGlobalQuoteInfo] = useState({});
  const [hasError, setHasError] = useState(null);

  useApikey({
    setApikey,
    setHasApikey,
    setIsLoading
  });

  // TODO: improvement, individual error messages, ideally with an error logging service
  const fetchData = (apiCall, setter, ...rest) => {
    apiCall(...rest)
      .then(response => {
        setter(response);
        setIsLoading(false);
      })
      .catch(error => {
        setHasError(error);
        console.log(error);
      })
  }

  const securitiesOptions = {
    filterType: 'checkbox',
    selectableRows: 'single',
    onRowSelectionChange: newRow => {
      setIsLoading(true);
      const symbol = securitiesData[newRow[0].index].symbol;
      setSelectedSecuritySymbol(symbol);
      fetchData(getHistoricalPrices, setSelectedSecuritySymbol5MinuteData, symbol, '5min', apikey);
      fetchData(getHistoricalPrices, setSelectedSecuritySymbol60MinuteData, symbol, '60min', apikey);
      fetchData(getSMA, setSelectedSecuritySymbolIndicatorSMAData, symbol, '5min', apikey);
      fetchData(getGlobalQuote, setGlobalQuoteInfo, symbol, apikey);
    }
  };
  const selectedSecuritySymbolHistoricalPricesOptions = {};
  const selectedSecuritySymbolIndicatorSMAOptions = {};

  const securitiesInterface = (
    <>
      <form>
        <label htmlFor="keyword">{KEYWORD_TEXT}</label>
        <input
          type="text"
          id="keyword"
          onChange={event => setKeyword(event.target.value)}
          placeholder={IBM}
          value={keyword}
        ></input>
        <button
          onClick={event => {
            event.preventDefault();
            setIsLoading(true);
            fetchData(getSecurities, setSecuritiesData, keyword, apikey);
          }}
        >{SEARCH}</button>
      </form>
      <MUIDataTable
        title={SECURITIES}
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
        title={`5 Minute Prices for ${selectedSecuritySymbol}`}
        data={selectedSecuritySymbol5MinuteData}
        columns={selectedSecuritySymbolHistoricalPricesColumns}
        options={selectedSecuritySymbolHistoricalPricesOptions}
      />
      <MUIDataTable
        title={`60 Minute Prices for ${selectedSecuritySymbol}`}
        data={selectedSecuritySymbol60MinuteData}
        columns={selectedSecuritySymbolHistoricalPricesColumns}
        options={selectedSecuritySymbolHistoricalPricesOptions}
      />
      <MUIDataTable
        title={INDICATORS}
        data={selectedSecuritySymbolIndicatorSMAData}
        columns={selectedSecuritySymbolIndicatorSMAColumns}
        options={selectedSecuritySymbolIndicatorSMAOptions}
      />
    </>
  );

  let view;
  if (isLoading) {
    // TODO: improvement, better loading states, ideally component loaders
    view = 'loading...';
  } else if (hasError) {
    view = <div>{messages.ERROR_MESSAGE}</div>
  } else if (hasApikey) {
    view = securitiesInterface;
  }

  return (
    <div>
      <Switch>
        <Route path="/home">
          {view}
        </Route>
        <Route path="/">
          <LandingPage
            setApikey={setApikey}
            hasApikey={hasApikey}
            setHasApikey={setHasApikey}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

// IMPROVEMENTS
  // choose styling approach, either CSS-in-JS (as with material ui), or as separate stylesheets (as with BEM styling, SASS)
  // polish styling
  // debouncing?
