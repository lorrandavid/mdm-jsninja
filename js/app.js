(function(document, $) {
  'use strict';

  var app = (function IIFE () {
    var ajax = new XMLHttpRequest();

    var Car = function Car (img, modelo, ano, placa, cor) {
      this.img = img;
      this.modelo = modelo;
      this.ano = ano;
      this.placa = placa;
      this.cor = cor;

      return this;
    };

    var init = function init () {
      this.getCompanyInfo();
      this.initEvents();
    };

    var getCompanyInfo = function getCompanyInfo () {
      ajax.open('GET', 'js/company.json');
      ajax.send();
      ajax.addEventListener('readystatechange', this.ajaxHandle, false);
    };

    var fillCompanyInfo = function fillCompanyInfo (data) {
      var $title = $('title');
      var $companyName = $('[data-js="companyName"]');
      var $companyDescription = $('[data-js="companyDescription"]');
      var $companyPhone = $('[data-js="companyPhone"]');
      $title.get().textContent = data.title;
      $companyDescription.get().textContent = data.description;
      $companyPhone.get().textContent = data.phone;

      $companyName.forEach(function(item) {
        item.textContent = data.name;
      });
    }

    var initEvents = function initEvents () {
      $('[data-js="formRegisterCar"]').on('submit', this.handleSubmit, false);
    };

    var handleSubmit = function handleSubmit (event) {
      event.preventDefault();
      {
        let formData = app.getFormData();
        let car = new Car(formData.img, formData.modelo, formData.ano, formData.placa, formData.cor);
        app.addCarToRecords(car);
      }
    };

    var ajaxHandle = function ajaxHandle () {
      if(!app.isRequestSuccessful(ajax))
        return;

      try {
        app.fillCompanyInfo(JSON.parse(ajax.response));
      } catch (err) {
        throw new Error('Aconteceu um probleminha:' + err);
      }
    };

    var isRequestSuccessful = function isRequestSuccessful (request) {
      return request.readyState === 4 && request.status === 200;
    };

    var getFormData = function getFormData () {
      return {
        img: $('[data-js="imgInput"]').get().value,
        modelo: $('[data-js="modeloInput"]').get().value,
        ano: $('[data-js="anoInput"]').get().value,
        placa: $('[data-js="placaInput"]').get().value,
        cor: $('[data-js="corInput"]').get().value
      };
    };

    var addCarToRecords = function addCarToRecords (obj) {
      var docFragment = document.createDocumentFragment();
      var newRow = document.createElement('tr');

      for(let prop in obj) {
        var newColumn = document.createElement('td');
        if(isPropImg(prop)) {
          let $tdImg = document.createElement('img');
          $tdImg.setAttribute('src', obj[prop]);
          newColumn.appendChild($tdImg);
        } else {
          newColumn.textContent = obj[prop];
        }
        newRow.appendChild(newColumn);
      }

      docFragment.appendChild(newRow);
      $('[data-js="recordsTable"]').get().children[1].appendChild(docFragment);
    };

    var isPropImg = function isPropImg (string) {
      return string === 'img';
    };

    var publicAPI = {
      init: init,
      initEvents: initEvents,
      getCompanyInfo: getCompanyInfo,
      fillCompanyInfo: fillCompanyInfo,
      handleSubmit: handleSubmit,
      ajaxHandle: ajaxHandle,
      isRequestSuccessful: isRequestSuccessful,
      getFormData: getFormData,
      addCarToRecords: addCarToRecords
    };

    return publicAPI;
  })();

  app.init();
})(document, window.DOM);
