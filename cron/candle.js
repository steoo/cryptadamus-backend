const BFX = require('bitfinex-api-node');
const Candle = require('../orm/candle');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const {key} = argv;

//const key = 'trade:1h:tBTCUSD';
const timeFrames = ['1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1D', '7D', '14D', '1M'];
const keys = timeFrames.map((tf) => {
  return `trade:${tf}:${key}`
});

console.log(keys);

Candle.sync();

const bfx = new BFX({
  ws: {
    autoReconnect: false,
    seqAudit: true,
    packetWDDelay: 10 * 1000
  }
});

const ws = bfx.ws(2, {
  transform: true
});

ws.on('error', (err) => console.log(err));
ws.on('open', () => {

  keys.map((_key) => {
    ws.subscribeCandles(_key);
    
    const tf = _key.split(":")[1];
    ws.onCandle({key: _key}, (candles) => handleOnCandle(candles, tf));
  })

});


function handleOnCandle(candles, tf) {
  console.log('candle received: ', candles.length);
  
  for (let i = candles.length - 1; i >= 0; i--) {
    
    // setTimeout(() => {
    // console.log('candle: ', candles[i]);
    
    const candle = candles[i];
    
    const data = {
      mts: candle.mts,
      timeFrame: tf,
      open: candle.open,
      close: candle.close,
      volume: candle.volume,
      high: candle.high,
      low: candle.low
    };
    
    const dataToInsert = {
      ...data,
      symbol: 'tBTCUSD',
      timestamp: new Date(data.mts)
    };
    
    
    Candle
      .create(dataToInsert)
      .then((candle) => console.log('candle inserted with id: ', candle.id))
      .error((err) => console.error(err));
  }
}

ws.open();