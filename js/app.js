// Precisar receber um parâmetro UI
export default function setupApp() {
  const getCompanyInfo = function getCompanyInfo() {
    return fetch('js/company.json')
      .then(res => res.json())
      .catch((err) => {
        throw new Error(`Aconteceu um probleminha: ${err}`);
      });
  };

  const getCars = function getCars() {
    return fetch('http://localhost:3000/car')
      .then(res => res.json()
        .then(data => data))
      .catch((err) => {
        throw new Error(`Aconteceu um probleminha: ${err}`);
      });
  };

  const addCar = function addCar(data) {
    fetch('http://localhost:3000/car', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: `image=${data.img}&brandModel=${data.modelo}&year=${data.ano}&plate=${data.placa}&color=${data.cor}`,
    })
      .then(res => res.json()
        .then(() => {
          getCars();
        }))
      .catch((err) => {
        throw new Error(`Aconteceu um probleminha: ${err}`);
      });
  };

  const removeCar = function removeCar(plate) {
    return fetch('http://localhost:3000/car', {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: `plate=${plate}`,
    });
  };

  const init = function initApp() {
    getCars();
  };

  const publicAPI = {
    init,
    getCompanyInfo,
    addCar,
    getCars,
    removeCar,
  };

  return publicAPI;
}
