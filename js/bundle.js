(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupApp;
// Precisar receber um parâmetro UI
function setupApp() {
  var getCompanyInfo = function getCompanyInfo() {
    return fetch('js/company.json').then(function (res) {
      return res.json();
    }).catch(function (err) {
      throw new Error(err);
    });
  };

  var getCars = function getCars() {
    return fetch('http://localhost:3000/car').then(function (res) {
      return res.json().then(function (data) {
        return data;
      });
    }).catch(function (err) {
      throw new Error(err);
    });
  };

  var addCar = function addCar(data) {
    fetch('http://localhost:3000/car', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: 'image=' + data.img + '&brandModel=' + data.modelo + '&year=' + data.ano + '&plate=' + data.placa + '&color=' + data.cor
    }).then(function (res) {
      return res.json().then(function () {
        getCars();
      });
    }).catch(function (err) {
      throw new Error(err);
    });
  };

  var removeCar = function removeCar(plate) {
    return fetch('http://localhost:3000/car', {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: 'plate=' + plate
    });
  };

  var init = function initApp() {
    getCars();
  };

  var publicAPI = {
    init: init,
    getCompanyInfo: getCompanyInfo,
    addCar: addCar,
    getCars: getCars,
    removeCar: removeCar
  };

  return publicAPI;
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  isPropImg: function isPropImg(string) {
    return string === 'image';
  },
  validateFormEntries: function validateFormEntries(obj) {
    return !Object.keys(obj).some(function (key) {
      return obj[key] === '';
    });
  },
  isTagEqual: function isTagEqual(string, stringCompare) {
    return string.toLowerCase() === stringCompare.toLowerCase();
  }
};

},{}],3:[function(require,module,exports){
'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = (0, _app2.default)();
var UI = (0, _ui2.default)(App);

App.init();
UI.init();

},{"./app":1,"./ui":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UIFactory;

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Missing remove car method
function UIFactory(App) {
  var $ = window.DOM;
  var $btnRemoveTemplate = '<a href="#" class="button button-accent" data-js="btnRemove">Remover</a>';
  var $title = $('title');
  var $companyName = $('[data-js="companyName"]');
  var $companyDescription = $('[data-js="companyDescription"]');
  var $companyPhone = $('[data-js="companyPhone"]');
  var $formRegisterCar = $('[data-js="formRegisterCar"]');
  var $tableRecords = $('[data-js="recordsTable"]');
  var $imgInput = $('[data-js="imgInput"]');
  var $modeloInput = $('[data-js="modeloInput"]');
  var $anoInput = $('[data-js="anoInput"]');
  var $placaInput = $('[data-js="placaInput"]');
  var $corInput = $('[data-js="corInput"]');

  var clearForm = function clearForm() {
    $imgInput.get().value = '';
    $modeloInput.get().value = '';
    $anoInput.get().value = '';
    $placaInput.get().value = '';
    $corInput.get().value = '';
  };

  var renderCarColumns = function renderCarColumns(data) {
    var image = data.image,
        brandModel = data.brandModel,
        year = data.year,
        plate = data.plate,
        color = data.color;


    return '\n      <td>\n        <img src="' + image + '" alt="' + brandModel + '">\n      </td>\n      <td>' + brandModel + '</td>\n      <td>' + year + '</td>\n      <td>' + plate + '</td>\n      <td>' + color + '</td>\n      <td data-js="' + plate + '">\n        ' + $btnRemoveTemplate + '\n      </td>\n    ';
  };

  var clearRecordsTable = function clearRecordsTable() {
    var $tableBody = $tableRecords.get().children[1];
    while ($tableBody.firstChild) {
      $tableBody.removeChild($tableBody.firstChild);
    }
  };

  var handleRemoveCarFromTable = function handleRemoveCarFromTable(e) {
    var _this = this;

    e.preventDefault();
    if (!_helpers2.default.isTagEqual(e.target.tagName, 'a')) return;
    App.removeCar(this.lastElementChild.getAttribute('data-js')).then(function () {
      _this.parentNode.removeChild(_this);
    }).catch(function (err) {
      throw new Error(err);
    });
  };

  var addCarToTable = function addCarToTable(data) {
    var $docFragment = document.createDocumentFragment();
    var $newRow = document.createElement('tr');
    $newRow.innerHTML = renderCarColumns(data);
    $docFragment.appendChild($newRow);
    $tableRecords.get().children[1].appendChild($docFragment);
    $newRow.addEventListener('click', handleRemoveCarFromTable, false);
  };

  var populateTable = function populateTable(arr) {
    clearRecordsTable();
    arr.forEach(function (car) {
      addCarToTable(car);
    });
  };

  var getCars = function getCarsTable() {
    App.getCars().then(function (cars) {
      populateTable(cars);
    }).catch(function (err) {
      throw new Error(err);
    });
  };

  var handleSubmitForm = function handleSubmitForm(e) {
    e.preventDefault();

    var data = {
      img: $imgInput.get().value,
      modelo: $modeloInput.get().value,
      ano: $anoInput.get().value,
      placa: $placaInput.get().value,
      cor: $corInput.get().value
    };

    if (!_helpers2.default.validateFormEntries(data)) return;
    clearForm();
    App.addCar(data);
    getCars();
  };

  var initEvents = function initEvents() {
    $formRegisterCar.on('submit', handleSubmitForm, false);
  };

  var setCompanyInfo = function displayCompanyInfoIntoView() {
    App.getCompanyInfo().then(function (data) {
      $title.get().textContent = data.title;
      $companyDescription.get().textContent = data.description;
      $companyPhone.get().textContent = data.phone;

      $companyName.forEach(function (item) {
        var $nameEl = item;
        $nameEl.textContent = data.name;
      });
    }).catch(function (err) {
      throw new Error(err);
    });
  };

  var init = function init() {
    initEvents();
    setCompanyInfo();
    getCars();
  };

  var publicAPI = {
    init: init,
    setCompanyInfo: setCompanyInfo,
    getCars: getCars,
    renderCarColumns: renderCarColumns,
    clearRecordsTable: clearRecordsTable,
    clearForm: clearForm
  };

  return publicAPI;
}

},{"./helpers":2}]},{},[3]);
