import Helpers from './helpers';
import CarFactory from './car';
import UIFactory from './ui';

const Car = CarFactory();
const UI = UIFactory();

const AppFactory = function setupApp() {
  const $formRegister = UI.$('[data-js="formRegisterCar"]');

  const getCompanyInfo = function getCompanyInfo() {
    fetch('./js/company.json')
      .then(data => data.json())
      .then((data) => {
        UI.setCompanyInfo(data);
      })
      .catch((err) => {
        throw new Error(`Aconteceu um probleminha: ${err}`);
      });
  };

  const getCars = function getCars() {
    Car.list()
      .then(data => data.json())
      .then((data) => {
        UI.populateTable(data);
      })
      .catch((err) => {
        throw new Error(`Aconteceu um probleminha: ${err}`);
      });
  };

  const handleFormSubmit = function handleFormSubmit(e) {
    e.preventDefault();

    const data = UI.getFormData();
    if (!Helpers.validateFormEntries(data)) return;
    Car.add(data)
      .then(() => {
        UI.clearForm();
        getCars();
      })
      .catch((err) => {
        throw new Error(`Aconteceu um probleminha: ${err}`);
      });
  };

  const initEvents = function initializeEvents() {
    $formRegister.on('submit', handleFormSubmit, false);
  };

  const init = function init() {
    getCompanyInfo();
    getCars();
    initEvents();
  };

  const publicAPI = {
    init,
  };

  return publicAPI;
};

const App = AppFactory();
App.init();
