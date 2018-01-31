import Helpers from './helpers';

// Missing remove car method
export default function UIFactory(App) {
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

  const handleSubmitForm = function handleSubmitForm(e) {
    e.preventDefault();

    const data = {
      img: $imgInput.get().value,
      modelo: $modeloInput.get().value,
      ano: $anoInput.get().value,
      placa: $placaInput.get().value,
      cor: $corInput.get().value,
    };

    if (!Helpers.validateFormEntries(data)) return;
    clearForm();
    App.addCar(data);
  };

  const initEvents = function initEvents() {
    $formRegisterCar.on('click', handleSubmitForm, false);
  };

  const setCompanyInfo = function displayCompanyInfoIntoView() {
    App.getCompanyInfo()
      .then((data) => {
        $title.get().textContent = data.title;
        $companyDescription.get().textContent = data.description;
        $companyPhone.get().textContent = data.phone;

        $companyName.forEach((item) => {
          const $nameEl = item;
          $nameEl.textContent = data.name;
        });
      })
      .catch((err) => {
        console.log('Aconteceu um probleminha:', err);
      });
  };

  const init = function init() {
    initEvents();
    setCompanyInfo();
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
    init,
    setCompanyInfo,
    renderCarColumns,
    clearRecordsTable,
    clearForm,
  };

  return publicAPI;
}
