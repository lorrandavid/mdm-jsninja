'use strict';

require('babel-polyfill');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function IIFE(document, $) {
  /** ****************************************** */
  var setupApp = function AppFactory(UI) {
    var getCompanyInfo = function getCompanyInfo() {
      fetch('js/company.json').then(function (res) {
        return res.json().then(function (data) {
          UI.fillCompanyInfo(data);
        });
      }).catch(function (err) {
        throw new Error('Aconteceu um probleminha: ' + err);
      });
    };

    var getCars = function getCars() {
      fetch('http://localhost:3000/car').then(function (res) {
        return res.json().then(function (data) {
          UI.populateTable(data);
        });
      }).catch(function (err) {
        throw new Error('Aconteceu um probleminha: ' + err);
      });
    };

    var init = function initApp() {
      getCompanyInfo();
      getCars();
    };

    var addCar = function addCar(data) {
      fetch('http://localhost:3000/car', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: 'image=' + data.img + '&brandModel=' + data.modelo + '&year=' + data.ano + '&plate=' + data.placa + '&color=' + data.cor
      }).then(function (res) {
        return res.json().then(function (data) {
          getCars();
        });
      }).catch(function (err) {
        throw new Error('Aconteceu um probleminha: ' + err);
      });
    };

    var removeCar = function removeCar(plate) {
      fetch('http://localhost:3000/car', {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: 'plate=' + plate
      }).then(function (res) {
        return res.json().then(function (data) {
          getCars();
        });
      }).catch(function (err) {
        throw new Error('Aconteceu um probleminha: ' + err);
      });
    };

    var publicAPI = {
      init: init,
      getCompanyInfo: getCompanyInfo,
      addCar: addCar,
      getCars: getCars,
      removeCar: removeCar
    };

    return publicAPI;
  };

  // Initialize UI
  var UI = setupUI();
  UI.init();

  // Initialize App
  var App = setupApp(UI);
  App.init();
})(document, window.DOM);
