const Sequelize = require('sequelize');
// db connection
const sequelize = require('../orm/db');

const Model = Sequelize.Model;

class Candle extends Model {
}

Candle.init({
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.DATE(6),
    allowNull: false
  },
  mts: {
    type: Sequelize.BIGINT(255),
    allowNull: false
  },
  open: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  close: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  rsi: {
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
}, {
  sequelize,
  modelName: 'candle'
});

module.exports = Candle;