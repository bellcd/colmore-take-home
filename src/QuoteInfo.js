import React from 'react';
import {
  replaceSpacesWithDashes
} from './utilities/transformations'

const QuoteInfo = ({
  quoteInfo
}) => {
  return Object.entries(quoteInfo).map(([key, value], index) => {
    const keyWithoutWhitespace = replaceSpacesWithDashes(key);
    return (
      <div key={index} className="global-quote-info__container">
        <div className={`global-quote-info__${keyWithoutWhitespace}`}>
          <span className={`global-quote-info__${keyWithoutWhitespace}-label`}>{key}</span>
          <span className={`global-quote-info__${keyWithoutWhitespace}-value`}>{value}</span>
        </div>
      </div>
    );
  })
};

export default QuoteInfo;