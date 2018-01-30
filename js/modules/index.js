import UIFactory from './ui';
import AppFactory from './app';

const UI = UIFactory();
const App = AppFactory();

const index = function index() {
  const fillCompanyInfo = function fillCompanyInfo() {
    App.getCompanyInfo()
      .then((data) => {
        UI.setCompanyInfo(data);
      });
  };

  const initEvents = function initEvents() {

  };

  const init = function init() {
    initEvents();
    fillCompanyInfo();
  };

  const publicAPI = {
    init,
  };

  return publicAPI;
};

// Initialize App
App.init();

// Initialize Index
const Index = index();
Index.init();
