import React, { useRef } from 'react';
import {
  Redirect
} from "react-router-dom";
import {
  saveApikey,
  useApikey
} from './services/apikeyService';
import messages from './constants/messages';

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
    CONTINUE
  } = messages;

  const getApikeyRef = useRef();

  useApikey({
    setApikey,
    setHasApikey,
    setIsLoading
  });

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
        >{CONTINUE}</button>
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