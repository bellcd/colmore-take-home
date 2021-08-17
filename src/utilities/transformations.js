// TODO: add tests
export const removeLeadingIntegersFromKeys = data => {
  const obj = {};
  for (const keyWithNumber in data) {
    const [, key] = keyWithNumber.split(/\. /);
    obj[key] = data[keyWithNumber];
  }
  return obj;
}

export const transformBestMatches = bestMatches =>
  bestMatches.map(item => removeLeadingIntegersFromKeys(item));

export const transformHistoricalPrices = prices => {
  const transformedPrices = [];
  for (const timeStamp in prices) {
    transformedPrices.push({
      ...removeLeadingIntegersFromKeys(prices[timeStamp]),
      timeStamp: timeStamp
    });
  }
  return transformedPrices;
};

export const transformSMA = technicalAnalysis => {
  const transformedTechnicalAnalysis = [];
  for (const timeStamp in technicalAnalysis) {
    transformedTechnicalAnalysis.push({
      SMA: technicalAnalysis[timeStamp].SMA,
      timeStamp: timeStamp
    });
  }
  return transformedTechnicalAnalysis;
}

export const replaceSpacesWithDashes = string => {
  return string.replace(/\s/, '-');
};
