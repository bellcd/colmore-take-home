import './App.css';
import MUIDataTable from "mui-datatables";
import messages from './constants/messages';
import { useState, useEffect } from 'react';

const App = () => {
  const { keywordText, search } = messages;
  const [keyword, setKeyword] = useState('');
  const [securitiesData, setSecuritiesData] = useState([]);
  const [selectedSecuritySymbol, setSelectedSecuritySymbol] = useState(null);
  const [selectedSecuritySymbolData, setSelectedSecuritySymbolData] = useState([]);
  const [apiKey, setApiKey] = useState('');

  // TODO: finish this logic
  useEffect(() => {
    const apiKey = localStorage.getItem('API_KEY')
    setApiKey(apiKey);
  }, []);

  // TODO: generalize to a helper function
  const transformSecuritiesData = bestMatches => {
    return bestMatches.map(item => {
      const obj = {};
      for (const keyWithNumber in item) {
        const [, key] = keyWithNumber.split(/\. /);
        obj[key] = item[keyWithNumber];
      }
      return obj;
    });
  }

  const getSymbols = (event) => {
    event.preventDefault();
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setSecuritiesData(transformSecuritiesData(data.bestMatches));
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
      setSelectedSecuritySymbol(securitiesData[newRow[0].index].symbol);
    }
  };

  const selectedSecuritySymbolColumns = [];
  const selectedSecuritySymbolOptions = {};

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
          onClick={getSymbols}
        >{search}</button>
      </form>
      <MUIDataTable
        title="Securities"
        data={securitiesData}
        columns={securitiesColumns}
        options={securitiesOptions}
      />
      <MUIDataTable
        title={selectedSecuritySymbol}
        data={selectedSecuritySymbolData}
        columns={selectedSecuritySymbolColumns}
        options={selectedSecuritySymbolOptions}
      />
    </>
  );
}

export default App;
