import { useReducer } from 'react';
import MUIDataTable from "mui-datatables";
import {
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import {
  getSecurities,
  getHistoricalPrices,
  getSMA,
  getGlobalQuote
} from './services/securitiesService';
import { useApikey } from './services/apikeyService';
import {
  securitiesColumns,
  selectedSecuritySymbolHistoricalPricesColumns,
  selectedSecuritySymbolIndicatorSMAColumns
} from './constants/tableColumns';
import messages from './constants/messages';
import LandingPage from './LandingPage';
import QuoteInfo from './QuoteInfo';
import { rootReducer } from './redux/reducers';
import { actions } from './redux/actions';
import { initialState } from './redux/state';

const App = () => {
  const {
    KEYWORD_TEXT,
    SEARCH,
    IBM,
    INDICATORS,
    SECURITIES
  } = messages;

  const [state, dispatch] = useReducer(rootReducer, initialState);
  const {
    keyword,
    securitiesData,
    selectedSecuritySymbol,
    selectedSecuritySymbol5MinuteData,
    selectedSecuritySymbol60MinuteData,
    selectedSecuritySymbolIndicatorSMAData,
    hasApikey,
    apikey,
    isLoading,
    globalQuoteInfo,
    hasError
  } = state;

  useApikey({
    setApikey: payload => dispatch({ type: actions.setApikey, payload }),
    setHasApikey: payload => dispatch({ type: actions.setHasApikey, payload }),
    setIsLoading: payload => dispatch({ type: actions.setIsLoading, payload })
  });

  // TODO: improvement, individual error messages, ideally with an error logging service
  const fetchData = (apiCall, setter, ...rest) => {
    apiCall(...rest)
      .then(response => {
        setter(response);
        dispatch({ type: actions.setIsLoading, payload: false });
      })
      .catch(error => {
        dispatch({ type: actions.setHasError, payload: error })
        console.log(error);
      })
  }

  const securitiesOptions = {
    filterType: 'checkbox',
    selectableRows: 'single',
    onRowSelectionChange: newRow => {
      dispatch({ type: actions.setIsLoading, payload: true });
      const symbol = securitiesData[newRow[0].index].symbol;
      dispatch({
        type: actions.setSelectedSecuritySymbol,
        payload: symbol
      });
      fetchData(getHistoricalPrices, payload => dispatch({ type: actions.setSelectedSecuritySymbol5MinuteData, payload }), symbol, '5min', apikey);
      fetchData(getHistoricalPrices, payload => dispatch({ type: actions.setSelectedSecuritySymbol60MinuteData, payload }), symbol, '60min', apikey);
      fetchData(getSMA, payload => dispatch({ type: actions.setSelectedSecuritySymbolIndicatorSMAData, payload }), symbol, '5min', apikey);
      fetchData(getGlobalQuote, payload => dispatch({ type: actions.setGlobalQuoteInfo, payload }), symbol, apikey);
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
          onChange={event => {
            dispatch({
              type: actions.setKeyword,
              payload: event.target.value
            });
          }}
          placeholder={IBM}
          value={keyword}
        ></input>
        <button
          onClick={event => {
            event.preventDefault();
            dispatch({ type: actions.setIsLoading, payload: true });
            fetchData(getSecurities, payload => dispatch({ type: actions.setSecuritiesData, payload }), keyword, apikey);
          }}
        >{SEARCH}</button>
      </form>
      <MUIDataTable
        title={SECURITIES}
        data={securitiesData}
        columns={securitiesColumns}
        options={securitiesOptions}
      />
      <QuoteInfo
        quoteInfo={globalQuoteInfo}
      />
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
            setApikey={payload => dispatch({ type: actions.setApikey, payload })}
            hasApikey={hasApikey}
            setHasApikey={payload => dispatch({ type: actions.setHasApikey, payload })}
            isLoading={isLoading}
            setIsLoading={payload => dispatch({ type: actions.setIsLoading, payload })}
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
