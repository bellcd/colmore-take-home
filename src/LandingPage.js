import React, { useEffect, useRef } from 'react';
import messages from './constants/messages';
import {
  Redirect
} from "react-router-dom";

const LandingPage = ({
  setApikey,
  hasApikey,
  setHasApikey,
  isLoading,
  setIsLoading
}) => {
  const {
    API_KEY_LANDING_PAGE,
    ALPHA_VANTAGE,
  } = messages;

  const getApikeyRef = useRef();

  useEffect(() => {
    const maybeApikey = retrieveApikey();
    if (maybeApikey) {
      setApikey(maybeApikey);
      setHasApikey(true);
    }
  }, []);

  useEffect(() => setIsLoading(false), []);

  const saveApikey = apikey => {
    sessionStorage.setItem('API_KEY', apikey);
  };
  const retrieveApikey = () => sessionStorage.getItem('API_KEY');

  const landing = (
    <>
      <form>
        <label htmlFor="get-api-key"></label>
        <input
          type="text"
          id="get-api-key"
          ref={getApikeyRef}
        />
        <button
          onClick={event => {
            event.preventDefault();
            const apikey = getApikeyRef.current.value;
            setHasApikey(true);
            setApikey(apikey);
            saveApikey(apikey);
          }}
        >Continue</button>
      </form>
      <div>
        {API_KEY_LANDING_PAGE}
        <a href="https://www.alphavantage.co/support/#api-key">{ALPHA_VANTAGE}</a>
      </div>
    </>
  );

  let view;
  if (isLoading) {
    view = 'loading...'
  } else if (hasApikey) {
    view = <Redirect to="/home" />
  } else {
    view = landing;
  }
  return view;
};

export default LandingPage;