import React from 'react';
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
  AreaSplineSeries, SplineSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';

const MyChart = () => {
  return (
    <HighchartsStockChart>
      <Title>example</Title>

      <RangeSelector selected={1}>
        <RangeSelector.Button count={1} type="day">1d</RangeSelector.Button>
        <RangeSelector.Button count={7} type="day">7d</RangeSelector.Button>
        <RangeSelector.Button count={1} type="month">1m</RangeSelector.Button>
        <RangeSelector.Button type="all">All</RangeSelector.Button>
        <RangeSelector.Input boxBorderColor="#7cb5ec" />
      </RangeSelector>
    </HighchartsStockChart>
  );
};

export default MyChart;