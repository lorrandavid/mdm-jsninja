const setupUI = function UIFactory() {
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

    if (!Helpers.validateFormEntries(data)) return false;

    clearForm();
    App.addCar(data);
  };

  const initEvents = function initUIEvents() {
    $formRegisterCar.on('submit', handleSubmitForm, false);
  };

  const init = function initUI() {
    initEvents();
  };

  const fillCompanyInfo = function fillCompanyInfo(data) {
    $title.get().textContent = data.title;
    $companyDescription.get().textContent = data.description;
    $companyPhone.get().textContent = data.phone;

    $companyName.forEach((item) => {
      const $nameEl = item;
      $nameEl.textContent = data.name;
    });
  };

  const handleRemoveCarFromTable = function handleRemoveCarFromTable(e) {
    e.preventDefault();

    if (!Helpers.isTagEqual(e.target.tagName, 'a')) return;
    App.removeCar(this.lastElementChild.getAttribute('data-js'));
  };

  const renderCarColumns = function renderCarColumns(data) {
    const { image, brandModel, year, plate, color } = data;

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

  const addCarToTable = function addCarToTable(data) {
    const $docFragment = document.createDocumentFragment();
    const $newRow = document.createElement('tr');
    $newRow.innerHTML = renderCarColumns(data);
    $docFragment.appendChild($newRow);
    $tableRecords.get().children[1].appendChild($docFragment);

    $newRow.addEventListener('click', handleRemoveCarFromTable, false);
  };

  const clearRecordsTable = function clearRecordsTable() {
    const $tableBody = $tableRecords.get().children[1];
    while ($tableBody.firstChild) {
      $tableBody.removeChild($tableBody.firstChild);
    }
  };

  const populateTable = function populateTable(arr) {
    clearRecordsTable();

    arr.forEach((car) => {
      addCarToTable(car);
    });
  };

  const publicAPI = {
    init,
    addCarToTable,
    fillCompanyInfo,
    populateTable
  };

  return publicAPI;
};

export default setupUI;
