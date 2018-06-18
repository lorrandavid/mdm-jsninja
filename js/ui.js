export default function UIFactory($ = window.DOM) {
  const $title = $('title');
  const $companyName = $('[data-js="companyName"]');
  const $companyDescription = $('[data-js="companyDescription"]');
  const $companyPhone = $('[data-js="companyPhone"]');
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

  const clearTable = function clearRecordsTable() {
    const $tableBody = $tableRecords.get().children[1];
    while ($tableBody.firstChild) {
      $tableBody.removeChild($tableBody.firstChild);
    }
  };

  const getFormData = function getFormData() {
    return {
      img: $imgInput.get().value,
      modelo: $modeloInput.get().value,
      ano: $anoInput.get().value,
      placa: $placaInput.get().value,
      cor: $corInput.get().value,
    };
  };

  const renderRemoveBtn = function renderRemoveButton() {
    return `
      <a href="#" class="button button-accent" data-js="btnRemove">
        Remover
      </a>
    `;
  };

  const renderCar = function renderCarColumn(data) {
    const {
      image, brandModel, year, plate, color,
    } = data;

    return `
      <td>
        <img src="${image}" alt="${brandModel}">
      </td>
      <td>${brandModel}</td>
      <td>${year}</td>
      <td>${plate}</td>
      <td>${color}</td>
      <td data-js="${plate}">
        ${renderRemoveBtn()}
      </td>
    `;
  };

  const addCarToTable = function addCarToTable(data) {
    const $docFragment = document.createDocumentFragment();
    const $newRow = document.createElement('tr');
    $newRow.innerHTML = renderCar(data);
    $docFragment.appendChild($newRow);
    $tableRecords.get().children[1].appendChild($docFragment);
  };

  const populateTable = function populateTable(cars) {
    clearTable();
    cars.forEach((car) => {
      addCarToTable(car);
    });
  };

  const setCompanyInfo = function displayCompanyInfoIntoView(data) {
    $title.get().textContent = data.title;
    $companyDescription.get().textContent = data.description;
    $companyPhone.get().textContent = data.phone;

    $companyName.forEach((item) => {
      const $nameEl = item;
      $nameEl.textContent = data.name;
    });
  };

  const publicAPI = {
    $,
    setCompanyInfo,
    populateTable,
    addCarToTable,
    renderCar,
    clearTable,
    clearForm,
    getFormData,
  };

  return publicAPI;
}
