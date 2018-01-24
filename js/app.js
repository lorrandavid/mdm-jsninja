import "babel-polyfill";
import Helpers from './helpers';
import UI from './ui';

(function IIFE(document, $) {
  /** ****************************************** */
  const setupApp = function AppFactory(UI) {
    const getCompanyInfo = function getCompanyInfo() {
      fetch('js/company.json')
        .then(res => res.json()
          .then((data) => {
            UI.fillCompanyInfo(data);
          })
        )
        .catch((err) => {
          throw new Error(`Aconteceu um probleminha: ${err}`);
        });
    };

    const getCars = function getCars() {
      fetch('http://localhost:3000/car')
        .then(res => res.json()
          .then((data) => {
            UI.populateTable(data);
          })
        )
        .catch(err => {
          throw new Error(`Aconteceu um probleminha: ${err}`);
        });
    };

    const init = function initApp() {
      getCompanyInfo();
      getCars();
    };

    const addCar = function addCar(data) {
      fetch('http://localhost:3000/car', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: `image=${data.img}&brandModel=${data.modelo}&year=${data.ano}&plate=${data.placa}&color=${data.cor}`
      })
      .then(res => res.json()
        .then((data) => {
          getCars();
        })
      )
      .catch((err) => {
        throw new Error(`Aconteceu um probleminha: ${err}`);
      });
    };

    const removeCar = function removeCar(plate) {
      fetch('http://localhost:3000/car', {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: `plate=${plate}`
      })
      .then(res => res.json()
        .then((data) => {
          getCars();
        })
      )
      .catch((err) => {
        throw new Error(`Aconteceu um probleminha: ${err}`);
      });
    };

    const publicAPI = {
      init,
      getCompanyInfo,
      addCar,
      getCars,
      removeCar
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
