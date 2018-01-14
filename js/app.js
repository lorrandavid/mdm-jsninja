(function(document, $) {
  'use strict';

  var Helpers = {
    isRequestSuccessful:  function isRequestSuccessful (request) {
      return request.readyState === 4 && request.status === 200;
    },

    isPropImg: function isPropImg (string) {
      return string === 'img';
    },

    validateFormEntries: function (obj) {
      for (let prop in obj) {
        if (obj[prop] === '') return false
      }

      return true;
    }
  };

  var setupUI = function () {
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

      $docFragment.appendChild($newRow);
      $tableRecords.get().children[1].appendChild($docFragment);
    };

    var publicAPI = {
      init: init,
      addCarToTable: addCarToTable,
      fillCompanyInfo: fillCompanyInfo
    };

    return publicAPI;
  };

  var setupApp = function (UI) {
    var init = function () {
      getCompanyInfo();
    };

    var getCompanyInfo = function () {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', 'js/company.json');
      ajax.send();
      ajax.addEventListener('readystatechange', handleAjaxCompanyInfo, false);
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
      UI.addCarToTable(data);
    };

    var publicAPI = {
      init: init,
      getCompanyInfo: getCompanyInfo,
      addCar: addCar
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
