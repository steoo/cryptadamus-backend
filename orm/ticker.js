const Sequelize = require('sequelize');
// db connection
const sequelize = require('../orm/db');

const Model = Sequelize.Model;

class Ticker extends Model {}

Ticker.init({
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.DATE(6),
    allowNull: false
  },
  lastPrice: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  dailyChange: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  dailyChangePerc: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  frr: {
    type: Sequelize.DOUBLE,
    allowNull: true
  },
  volume: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  high: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  low: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  bid: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  bidPeriod: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  bidSize: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  ask: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  askPeriod: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  askSize: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'ticker'
});

module.exports = Ticker;