(function(document, $) {
  'use strict';

  /*********************************************/
  var Helpers = {
    isRequestSuccessful:  function isRequestSuccessful (request) {
      return request.readyState === 4 && request.status === 200;
    },

    isPropImg: function isPropImg (string) {
      return string === 'image';
    },

    validateFormEntries: function (obj) {
      for (let prop in obj) {
        if (obj[prop] === '') return false
      }

      return true;
    },

    isTagEqual: function (string, stringCompare) {
      return string.toLowerCase() === stringCompare.toLowerCase();
    }
  };

  /*********************************************/
  var setupUI = function () {
    const $btnRemoveTemplate = '<a href="#" class="button button-accent" data-js="btnRemove">Remover</a>';
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

    var init = function () {
      initEvents();
    };

    var initEvents = function () {
      $formRegisterCar.on('submit', handleSubmitForm, false);
    };

    var handleSubmitForm = function (e) {
      e.preventDefault();

      var data = {
        img: $imgInput.get().value,
        modelo: $modeloInput.get().value,
        ano: $anoInput.get().value,
        placa: $placaInput.get().value,
        cor: $corInput.get().value
      };

      if(!Helpers.validateFormEntries(data))
        return;

      clearForm();
      App.addCar(data);
    };

    var clearForm = function () {
      $imgInput.get().value = '';
      $modeloInput.get().value = '';
      $anoInput.get().value = '';
      $placaInput.get().value = '';
      $corInput.get().value = '';
    };

    var fillCompanyInfo = function (data) {
      $title.get().textContent = data.title;
      $companyDescription.get().textContent = data.description;
      $companyPhone.get().textContent = data.phone;

      $companyName.forEach(function(item) {
        item.textContent = data.name;
      });
    };

    var addCarToTable = function (data) {
      var $docFragment = document.createDocumentFragment();
      var $newRow = document.createElement('tr');

      for(let prop in data) {
        var $newColumn = document.createElement('td');
        if(Helpers.isPropImg(prop)) {
          {
            let $tdImg = document.createElement('img');
            $tdImg.setAttribute('src', data[prop]);
            $newColumn.appendChild($tdImg);
          }
        } else {
          $newColumn.textContent = data[prop];
        }
        $newRow.appendChild($newColumn);
      }

      {
        let $btnRemoveColumn = document.createElement('td');
        $btnRemoveColumn.setAttribute('data-js', data.plate);
        $btnRemoveColumn.innerHTML = $btnRemoveTemplate;
        $btnRemoveColumn.addEventListener('click', handleRemoveCarFromTable, false);
        $newRow.appendChild($btnRemoveColumn);
      }

      $docFragment.appendChild($newRow);
      $tableRecords.get().children[1].appendChild($docFragment);
    };

    var handleRemoveCarFromTable = function (e) {
      e.preventDefault();

      if(!Helpers.isTagEqual(e.target.tagName, 'a')) return;
      App.removeCar(this.getAttribute('data-js'));
    };

    var populateTable = function (arr) {
      clearRecordsTable();

      arr.forEach(function(car){
        addCarToTable(car);
      });
    };

    var clearRecordsTable = function () {
      {
        let $tableBody = $tableRecords.get().children[1];
        while($tableBody.firstChild) {
          $tableBody.removeChild($tableBody.firstChild);
        }
      }
    };

    var publicAPI = {
      init: init,
      addCarToTable: addCarToTable,
      fillCompanyInfo: fillCompanyInfo,
      populateTable: populateTable
    };

    return publicAPI;
  };

  /*********************************************/
  var setupApp = function (UI) {
    var init = function () {
      getCompanyInfo();
      getCars();
    };

    var getCompanyInfo = function () {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', 'js/company.json');
      ajax.send();
      ajax.addEventListener('readystatechange', handleAjaxCompanyInfo, true);
    };

    var handleAjaxCompanyInfo = function () {
      if(!Helpers.isRequestSuccessful(this))
        return;

      try {
        {
          let data = JSON.parse(this.response);
          UI.fillCompanyInfo(data);
        }
      } catch (err) {
        throw new Error('Aconteceu um probleminha:' + err);
      }
    };

    var addCar = function (data) {
      var ajax = new XMLHttpRequest();
      ajax.open('POST', 'http://localhost:3000/car');
      ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      ajax.send('image=' + data.img + '&brandModel=' + data.modelo + '&year=' + data.ano + '&plate=' + data.placa + '&color=' + data.cor);
      ajax.addEventListener('readystatechange', handleAddCar, true);
    };

    var handleAddCar = function () {
      if(!Helpers.isRequestSuccessful(this)) return;
      getCars();
    };

    var getCars = function () {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', 'http://localhost:3000/car');
      ajax.send();
      ajax.addEventListener('readystatechange', handleGetCars, true);
    };

    var handleGetCars = function () {
      if(!Helpers.isRequestSuccessful(this)) return;

      try {
        {
          let data = JSON.parse(this.response);
          UI.populateTable(data);
        }
      } catch (err) {
        throw new Error('Aconteceu um probleminha:' + err);
      }
    };

    var removeCar = function (plate) {
      var ajax = new XMLHttpRequest();
      ajax.open('DELETE', 'http://localhost:3000/car');
      ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      ajax.send('plate=' + plate);
      ajax.addEventListener('readystatechange', handleRemoveCar, true);
    };

    var handleRemoveCar = function (e) {
      if(!Helpers.isRequestSuccessful(this)) return;
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
  };

  // Initialize UI
  var UI = setupUI();
  UI.init();

  // Initialize App
  var App = setupApp(UI);
  App.init();
})(document, window.DOM);
