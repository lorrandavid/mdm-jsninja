import Helpers from './helpers';

export default function UIFactory() {
  const $ = window.DOM;
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

  const setCompanyInfo = function displayCompanyInfoIntoView(data) {
    $title.get().textContent = data.title;
    $companyDescription.get().textContent = data.description;
    $companyPhone.get().textContent = data.phone;

    $companyName.forEach((item) => {
      const $nameEl = item;
      $nameEl.textContent = data.name;
    });
  };

  const renderCarColumns = function renderCarColumns(data) {
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
        ${$btnRemoveTemplate}
      </td>
    `;
  };

  const clearRecordsTable = function clearRecordsTable() {
    const $tableBody = $tableRecords.get().children[1];
    while ($tableBody.firstChild) {
      $tableBody.removeChild($tableBody.firstChild);
    }
  };

  const publicAPI = {
    setCompanyInfo,
  };

  return publicAPI;
}
