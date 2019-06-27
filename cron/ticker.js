const BFX = require('bitfinex-api-node');
const Ticker = require('../orm/ticker');
const minimist = require('minimist');

Ticker.sync();

const argv = minimist(process.argv.slice(2));
const {symbol} = argv;
const tSymbol = `t${symbol}`;

console.log('collecting for symbol: ', symbol);


const bfx = new BFX({
  ws: {
    autoReconnect: false,
    seqAudit: true,
    packetWDDelay: 10 * 1000
  }
});

const ws = bfx.ws(2, {
  transform: true // needed to have a JSON result instead of an Array result as data returned from the onTicker
});

ws.on('error', (err) => console.log(err));
ws.on('open', () => {
  ws.unsubscribeTicker(symbol);
  console.log('starting to listen on', symbol);
  ws.subscribeTicker(symbol);
});
// subscribe to a ticker

// listen to the event
ws.onTicker({symbol: tSymbol}, (ticker) => {
  const data = {
    bid: ticker.bid,
    bidSize: ticker.bidSize,
    ask: ticker.ask,
    askSize: ticker.askSize,
    dailyChange: ticker.dailyChange,
    dailyChangePerc: ticker.dailyChangePerc,
    lastPrice: ticker.lastPrice,
    volume: ticker.volume,
    high: ticker.high,
    low: ticker.low,
  };
  
  const tickerToInsert = {
    ...data,
    symbol: tSymbol,
    timestamp: new Date()
  };
  
  console.log('ticker received', tickerToInsert);
  // console.log('ticker received', ticker);
  Ticker
    .create(tickerToInsert)
    .then((ticker) => console.log('ticker inserted with id: ', ticker.id))
    .error((err) => console.error(err));
});

ws.open();

// setInterval(() => (console.log('')), 1000);