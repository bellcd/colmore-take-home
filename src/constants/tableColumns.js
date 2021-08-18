import messages from './messages';

export const securitiesColumns = [
  {
    name: "symbol",
    label: messages.SYMBOL
  },
  {
    name: "name",
    label: messages.NAME
  },
  {
    name: "type",
    label: messages.TYPE
  },
  {
    name: "region",
    label: messages.REGION
  },
  {
    name: "marketOpen",
    label: messages.MARKET_OPEN
  },
  {
    name: "marketClose",
    label: messages.MARKET_CLOSE
  },
  {
    name: "timezone",
    label: messages.TIMEZONE
  },
  {
    name: "currency",
    label: messages.CURRENCY
  },
  {
    name: "matchScore",
    label: messages.MATCH_SCORE
  },
];

export const selectedSecuritySymbolHistoricalPricesColumns = [
  {
    name: "timeStamp",
    label: messages.TIME_STAMP
  },
  {
    name: "close",
    label: messages.CLOSE
  },
  {
    name: "high",
    label: messages.HIGH
  },
  {
    name: "low",
    label: messages.LOW
  },
  {
    name: "open",
    label: messages.OPEN
  },
  {
    name: "volume",
    label: messages.VOLUME
  },
];

export const selectedSecuritySymbolIndicatorSMAColumns = [
  {
    name: "timeStamp",
    label: messages.TIME_STAMP
  },
  {
    name: "SMA",
    label: messages.SMA
  },
];