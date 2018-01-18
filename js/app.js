(function IIFE(document, $) {
  'use strict';

  /** ****************************************** */
  const Helpers = {
    isRequestSuccessful: function checkIfRequestIsSuccessful(request) {
      return request.readyState === 4 && request.status === 200;
    },

    isPropImg: function checkIfStringEqualsImage(string) {
      return string === 'image';
    },

    validateFormEntries: function checkIfHasEmptyValue(obj) {
      return !Object.keys(obj).map(key => obj[key]).includes('');
    },

    isTagEqual: function checkIfStringsAreEqual(string, stringCompare) {
      return string.toLowerCase() === stringCompare.toLowerCase();
    },
  };

  /** ****************************************** */
  const setupUI = function UIFactory() {
    const $btnRemoveTemplate = '<a href="#" class="button button-accent" data-js="btnRemove">Remover</a>';
    const $title = $('title');
    const $companyName = $('[data-js="companyName"]');
    const $companyDescription = $('[data-js="companyDescription"]');
    const $companyPhone = $('[data-js="companyPhone"]');
    const $formRegisterCar = $('[data-js="formRegisterCar"]');
    const $tableRecords = $('[data-js="recordsTable"]');
    const $imgInput = $('[data-js="imgInput"]');
    const $modeloInput = $('[data-js="modeloInput"]');
    const $anoInput = $('[data-js="anoInput"]');
    const $placaInput = $('[data-js="placaInput"]');
    const $corInput = $('[data-js="corInput"]');

    const clearForm = function clearForm() {
      $imgInput.get().value = '';
      $modeloInput.get().value = '';
      $anoInput.get().value = '';
      $placaInput.get().value = '';
      $corInput.get().value = '';
    };

    const handleSubmitForm = function handleSubmitForm(e) {
      e.preventDefault();

      const data = {
        img: $imgInput.get().value,
        modelo: $modeloInput.get().value,
        ano: $anoInput.get().value,
        placa: $placaInput.get().value,
        cor: $corInput.get().value,
      };

      if (!Helpers.validateFormEntries(data)) return false;

      clearForm();
      App.addCar(data);
    };

    const initEvents = function initUIEvents() {
      $formRegisterCar.on('submit', handleSubmitForm, false);
    };

    const init = function initUI() {
      initEvents();
    };

    const fillCompanyInfo = function fillCompanyInfo(data) {
      $title.get().textContent = data.title;
      $companyDescription.get().textContent = data.description;
      $companyPhone.get().textContent = data.phone;

      $companyName.forEach((item) => {
        const $nameEl = item;
        $nameEl.textContent = data.name;
      });
    };

    const handleRemoveCarFromTable = function handleRemoveCarFromTable(e) {
      e.preventDefault();

      if (!Helpers.isTagEqual(e.target.tagName, 'a')) return;
      App.removeCar(this.getAttribute('data-js'));
    };

    const addCarToTable = function addCarToTable(data) {
      const $docFragment = document.createDocumentFragment();
      const $newRow = document.createElement('tr');
      const $btnRemoveColumn = document.createElement('td');

      const keys = Object.keys(data);
      keys.forEach((prop) => {
        const $newColumn = document.createElement('td');
        if (Helpers.isPropImg(prop)) {
          const $tdImg = document.createElement('img');
          $tdImg.setAttribute('src', data[prop]);
          $newColumn.appendChild($tdImg);
        } else {
          $newColumn.textContent = data[prop];
        }
        $newRow.appendChild($newColumn);
      });

      $btnRemoveColumn.setAttribute('data-js', data.plate);
      $btnRemoveColumn.innerHTML = $btnRemoveTemplate;
      $btnRemoveColumn.addEventListener('click', handleRemoveCarFromTable, false);
      $newRow.appendChild($btnRemoveColumn);
      $docFragment.appendChild($newRow);
      $tableRecords.get().children[1].appendChild($docFragment);
    };

    const clearRecordsTable = function clearRecordsTable() {
      const $tableBody = $tableRecords.get().children[1];
      while ($tableBody.firstChild) {
        $tableBody.removeChild($tableBody.firstChild);
      }
    };

    const populateTable = function populateTable(arr) {
      clearRecordsTable();

      arr.forEach((car) => {
        addCarToTable(car);
      });
    };

    const publicAPI = {
      init: init,
      addCarToTable: addCarToTable,
      fillCompanyInfo: fillCompanyInfo,
      populateTable: populateTable
    };

    return publicAPI;
  };

  /** ****************************************** */
  const setupApp = function AppFactory(UI) {
    const handleAjaxCompanyInfo = function handleAjaxCompanyInfo() {
      if (!Helpers.isRequestSuccessful(this)) return;

      try {
        const data = JSON.parse(this.response);
        UI.fillCompanyInfo(data);
      } catch (err) {
        throw new Error('Aconteceu um probleminha:' + err);
      }
    };

    const getCompanyInfo = function getCompanyInfo() {
      const ajax = new XMLHttpRequest();
      ajax.open('GET', 'js/company.json');
      ajax.send();
      ajax.addEventListener('readystatechange', handleAjaxCompanyInfo, true);
    };

    const handleGetCars = function handleGetCars() {
      if (!Helpers.isRequestSuccessful(this)) return;

      try {
        const data = JSON.parse(this.response);
        UI.populateTable(data);
      } catch (err) {
        throw new Error('Aconteceu um probleminha:' + err);
      }
    };

    const getCars = function getCars() {
      const ajax = new XMLHttpRequest();
      ajax.open('GET', 'http://localhost:3000/car');
      ajax.send();
      ajax.addEventListener('readystatechange', handleGetCars, true);
    };

    const handleAddCar = function handleAddCar() {
      if (!Helpers.isRequestSuccessful(this)) return;
      getCars();
    };

    const init = function initApp() {
      getCompanyInfo();
      getCars();
    };

    const handleRemoveCar = function handleRemoveCar(e) {
      if (!Helpers.isRequestSuccessful(this)) return;
      getCars();
    };

    const addCar = function addCar(data) {
      const ajax = new XMLHttpRequest();
      ajax.open('POST', 'http://localhost:3000/car');
      ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      ajax.send('image=' + data.img + '&brandModel=' + data.modelo + '&year=' + data.ano + '&plate=' + data.placa + '&color=' + data.cor);
      ajax.addEventListener('readystatechange', handleAddCar, true);
    };

    const removeCar = function removeCar(plate) {
      const ajax = new XMLHttpRequest();
      ajax.open('DELETE', 'http://localhost:3000/car');
      ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      ajax.send('plate=' + plate);
      ajax.addEventListener('readystatechange', handleRemoveCar, true);
    };

    const publicAPI = {
      init: init,
      getCompanyInfo: getCompanyInfo,
      addCar: addCar,
      getCars: getCars,
      removeCar: removeCar
    };

    return publicAPI;
  };

  // Initialize UI
  const UI = setupUI();
  UI.init();

  // Initialize App
  const App = setupApp(UI);
  App.init();
}(document, window.DOM));
