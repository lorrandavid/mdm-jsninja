export default function setupCar() {
  const apiURL = 'http://localhost:3000/car';

  const list = function listCars() {
    return fetch(apiURL);
  };

  const add = function addCar(data) {
    return fetch(apiURL, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: `image=${data.img}&brandModel=${data.modelo}&year=${data.ano}&plate=${data.placa}&color=${data.cor}`,
    });
  };

  const remove = function removeCar(plate) {
    return fetch(apiURL, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: `plate=${plate}`,
    });
  };

  const init = function initApp() {
    list();
  };

  const publicAPI = {
    init,
    list,
    add,
    remove,
  };

  return publicAPI;
}
