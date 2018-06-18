(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _car = require('./car');

var _car2 = _interopRequireDefault(_car);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Car = (0, _car2.default)();
var UI = (0, _ui2.default)();

var AppFactory = function setupApp() {
  var $ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.DOM;

  var formRegister = $('[data-js="formRegisterCar"]');

  var getCompanyInfo = function getCompanyInfo() {
    fetch('./js/company.json').then(function (data) {
      return data.json();
    }).then(function (data) {
      UI.setCompanyInfo(data);
    }).catch(function (err) {
      throw new Error('Aconteceu um probleminha: ' + err);
    });
  };

  var getCars = function getCars() {
    Car.list().then(function (data) {
      return data.json();
    }).then(function (data) {
      UI.populateTable(data);
    }).catch(function (err) {
      throw new Error('Aconteceu um probleminha: ' + err);
    });
  };

  var handleFormSubmit = function handleFormSubmit(e) {
    e.preventDefault();

    var data = UI.getFormData();
    if (!_helpers2.default.validateFormEntries(data)) return;
    Car.add(data).then(function () {
      UI.clearForm();
      getCars();
    }).catch(function (err) {
      throw new Error('Aconteceu um probleminha: ' + err);
    });
  };

  var initEvents = function initializeEvents() {
    formRegister.on('submit', handleFormSubmit, false);
  };

  var init = function init() {
    getCompanyInfo();
    getCars();
    initEvents();
  };

  var publicAPI = {
    init: init
  };

  return publicAPI;
};

var App = AppFactory();
App.init();

},{"./car":2,"./helpers":3,"./ui":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupCar;
function setupCar() {
  var apiURL = 'http://localhost:3000/car';

  var list = function listCars() {
    return fetch(apiURL);
  };

  var add = function addCar(data) {
    return fetch(apiURL, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: 'image=' + data.img + '&brandModel=' + data.modelo + '&year=' + data.ano + '&plate=' + data.placa + '&color=' + data.cor
    });
  };

  var remove = function removeCar(plate) {
    return fetch(apiURL, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: 'plate=' + plate
    });
  };

  var init = function initApp() {
    list();
  };

  var publicAPI = {
    init: init,
    list: list,
    add: add,
    remove: remove
  };

  return publicAPI;
}

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UIFactory;
function UIFactory() {
  var $ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.DOM;

  var $title = $('title');
  var $companyName = $('[data-js="companyName"]');
  var $companyDescription = $('[data-js="companyDescription"]');
  var $companyPhone = $('[data-js="companyPhone"]');
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

  var clearTable = function clearRecordsTable() {
    var $tableBody = $tableRecords.get().children[1];
    while ($tableBody.firstChild) {
      $tableBody.removeChild($tableBody.firstChild);
    }
  };

  var getFormData = function getFormData() {
    return {
      img: $imgInput.get().value,
      modelo: $modeloInput.get().value,
      ano: $anoInput.get().value,
      placa: $placaInput.get().value,
      cor: $corInput.get().value
    };
  };

  var renderRemoveBtn = function renderRemoveButton() {
    return '\n      <a href="#" class="button button-accent" data-js="btnRemove">\n        Remover\n      </a>\n    ';
  };

  var renderCar = function renderCarColumn(data) {
    var image = data.image,
        brandModel = data.brandModel,
        year = data.year,
        plate = data.plate,
        color = data.color;


    return '\n      <td>\n        <img src="' + image + '" alt="' + brandModel + '">\n      </td>\n      <td>' + brandModel + '</td>\n      <td>' + year + '</td>\n      <td>' + plate + '</td>\n      <td>' + color + '</td>\n      <td data-js="' + plate + '">\n        ' + renderRemoveBtn() + '\n      </td>\n    ';
  };

  var addCarToTable = function addCarToTable(data) {
    var $docFragment = document.createDocumentFragment();
    var $newRow = document.createElement('tr');
    $newRow.innerHTML = renderCar(data);
    $docFragment.appendChild($newRow);
    $tableRecords.get().children[1].appendChild($docFragment);
  };

  var populateTable = function populateTable(cars) {
    clearTable();
    cars.forEach(function (car) {
      addCarToTable(car);
    });
  };

  var setCompanyInfo = function displayCompanyInfoIntoView(data) {
    $title.get().textContent = data.title;
    $companyDescription.get().textContent = data.description;
    $companyPhone.get().textContent = data.phone;

    $companyName.forEach(function (item) {
      var $nameEl = item;
      $nameEl.textContent = data.name;
    });
  };

  var publicAPI = {
    setCompanyInfo: setCompanyInfo,
    populateTable: populateTable,
    addCarToTable: addCarToTable,
    renderCar: renderCar,
    clearTable: clearTable,
    clearForm: clearForm,
    getFormData: getFormData
  };

  return publicAPI;
}

},{}]},{},[1]);
