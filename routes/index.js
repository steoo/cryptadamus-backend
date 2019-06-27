const express = require('express');
const router = express.Router();
const BFX = require('bitfinex-api-node');

// const Ticker = require('../orm/ticker');
const Candle = require('../orm/candle');

// Ticker.sync();
// Candle.sync();

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


const candleKey = 'trade:1h:tBTCUSD';

/* GET home page. */
router.get('/', function (req, res, next) {
  /*const wss = new WebSocket('wss://api.bitfinex.com/ws/');
  
  wss.onmessage = (msg) => {
    const parseData = JSON.parse(msg.data);
    
    console.log('receiving message from ws: ', parseData, new Date());
    
    if (Array.isArray(parseData) && parseData.length > 2) {
      console.log('message length from ws: ', parseData.length);
      
      // Ticker.sync({}).then(() => {});
    }
    
  };
  wss.onopen = () => {
    
    wss.send(JSON.stringify({
      "event": "subscribe",
      "channel": "ticker",
      "pair": "BTCUSD"
    }));
  };*/
  
  ws.on('error', (err) => console.log(err));
  ws.on('open', () => {
    ws.subscribeTicker('BTCUSD');
    ws.unsubscribeTrades(candleKey);
    ws.subscribeCandles(candleKey);
  });
  
  ws.onTicker({symbol: 'tBTCUSD'}, (ticker) => {
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
      symbol: 'tBTCUSD',
      timestamp: new Date()
    };
    
    console.log('ticker received', tickerToInsert);
    // console.log('ticker received', ticker);
    Ticker
      .create(tickerToInsert)
      .then((ticker) => console.log('ticker inserted with id: ', ticker.id))
      .error((err) => console.error(err));
  });
  
  ws.onCandle({key: candleKey}, (candles) => {
    console.log('candle received: ', candles.length);
    
    for (let i = candles.length - 1; i >= 0; i--) {
      
      // setTimeout(() => {
      // console.log('candle: ', candles[i]);
      
      const candle = candles[i];
      
      const data = {
        mts: candle.mts,
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
        // .then((candle) => console.log('candle inserted with id: ', candle.id))
        .then(() => {
          // rsiV = null;
          // rsi.reset();
          ws.unsubscribeTrades(candleKey);
          console.log('unsibscribing');
        })
        .error((err) => console.error(err));
      // }, 1);
    }
    
  });
  
  ws.open();
  
  res.render('index', {title: 'Express'});
});

module.exports = router;
