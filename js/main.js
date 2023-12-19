document.addEventListener('DOMContentLoaded', async () => {

// работа с сервером

  const SERVER_URL = 'http://localhost:3000';

  // добавляем данные нового клиента
  async function serverAddClient(obj) {
    let response = await fetch(SERVER_URL + '/api/clients', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })
    let data = await response.json();
    return data
  }
  
  // загружаем сохранённые данные клиентов
  async function serverGetClients() {
    let response = await fetch(SERVER_URL + '/api/clients', {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    })
    let data = await response.json();
    return data
  }

  // загружаем данные одного клиента
  async function serverGetClient(id) {
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    })
    let data = await response.json();
    return data
  }

  // изменить данные клиента
  async function serverChangeClients(obj, id) {
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    })
        const data = await response.json();
        return data;
  }
  
  // удаление студента
  async function serverDeleteClient(id) {
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
      method: "DELETE",
    })
    let data = await response.json();
    return data
  }

// массив данных о клиентах
  let clientsList = [];

  let sortColFlag = null;
  let sortDirFlag = true;

// спиннер загрузки 
  const spinner = document.getElementById('tbody__spinner');
  function hideSpinner() {
    spinner.style.display = 'none';
  }

  // загружаем данные о клиентах с сервера, если они есть
  let serverData = await serverGetClients();
  hideSpinner();
   if (serverData !== null) {
    clientsList = serverData;
  } 

  // таблица клиентов

  // определяем элементы формы добавления нового клиента
  const formSurname = document.getElementById('form__surname');
  const formName = document.getElementById('form__name');
  const formLastName = document.getElementById('form__lastname');

  // открыть модальное окно "Добавить клиента"
  const addBtn = document.getElementById('btn__add');
  addBtn.addEventListener("click", function() {
    document.querySelector('.modal-add__btn-add').classList.remove("invis");
    document.getElementById("errors__create").innerHTML = '';
    document.getElementById("modal__add").classList.add("open");
  });

// модальные окна

  // закрыть модальное окно "Добавить клиента"
  function closeModalAdd() {
    formSurname.value = '';
    formName.value = '';
    formLastName.value = '';

    document.querySelector('.form-add__contacts-list').replaceChildren()

    document.getElementById("modal__add").classList.remove("open");
  };
    
  document.getElementById("modal__add-close").addEventListener("click", closeModalAdd) ;

  document.getElementById("modal__add-cancel").addEventListener("click", closeModalAdd);

  window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      closeModalAdd()
    }
  });

  document.querySelector("#modal__add .modal__box").addEventListener('click', event => {
    event._isClickWithInModal = true;
  });
  document.getElementById("modal__add").addEventListener('click', event => {
    if (event._isClickWithInModal) return;
    closeModalAdd()
  });

  // запуск отрисовки таблицы
  function renderClientsTable(clientsArray) {

    // очищаем табличную часть
    tbody.innerHTML = '';

    let copyClientsList = [...clientsArray]

    // cоздаём дополнительные элементы для массива
    for (const clientObj of copyClientsList) {
      clientObj.fullName = clientObj.surname + ' ' + clientObj.name + ' ' + clientObj.lastName;
    }

    // сортировка
    copyClientsList = copyClientsList.sort(function(a, b) {      
      let sort = a[sortColFlag] < b[sortColFlag]
        if (sortDirFlag == false) {
          sort = a[sortColFlag] > b[sortColFlag]
        }
      if(sort) return -1
    });

    // поиск
    const searchInput = document.getElementById('header__input');

    // функция поиска
   
    function filterString(arr, prop, value) {
      return arr.filter(function(clientObj) {
        if (clientObj[prop].includes(value.trim())) return true
      });
    }

    if (searchInput.value.trim() !== '') {  
        copyClientsList = filterString(copyClientsList, 'fullName', searchInput.value)
      
    }    
    
    // отрисовка
    for (const clientObj of copyClientsList) {
      const newRow = getClientItem(clientObj, copyClientsList)
      tbody.append(newRow);
    }
  }
  renderClientsTable(clientsList);

  // поиск
  let timeoutSearch = null;

  document.getElementById('header__input').addEventListener('input', function() {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(replSearch, 300);
    function replSearch() {
    renderClientsTable(clientsList)
  };
  })

  sortColFlag = 'id';
  document.getElementById('srm__thead-id').classList.add('srm__thead--color-active');
  document.getElementById('srm__thead-sort--id-svg').classList.add('srm__thead-dir');

  renderClientsTable(clientsList);

  // функция вывода одного клиента (заполения одной строки)
  function getClientItem(clientObj, clientsList) {
    console.log(clientObj)
    console.log(clientsList)
    const tbody = document.getElementById('tbody');

    const row = document.createElement('tr');
    const colId = document.createElement('td');
    const colFullName = document.createElement('td');
    const colCreatedAt = document.createElement('td');
    const colCreatedAtDate = document.createElement('span');
    const colCreatedAtTime = document.createElement('span');
    const colUpdatedAt = document.createElement('td');
    const colUpdatedAtDate = document.createElement('span');
    const colUpdatedAtTime = document.createElement('span');
    const colContacts = document.createElement('td');
    const colBtn = document.createElement('td'); 

    const updatedBtn = document.createElement('button');    
    const deleteBtn = document.createElement('button');

    row.append(colId);
    row.append(colFullName);
    row.append(colCreatedAt);
    colCreatedAt.append(colCreatedAtDate);
    colCreatedAt.append(colCreatedAtTime);
    row.append(colUpdatedAt);
    colUpdatedAt.append(colUpdatedAtDate);
    colUpdatedAt.append(colUpdatedAtTime);
    row.append(colContacts);
    row.append(colBtn);

    colBtn.append(updatedBtn);
    colBtn.append(deleteBtn);

    const clientIdData = clientObj.id;
    colId.textContent = clientObj.id;
    colFullName.textContent = clientObj.fullName;
    colCreatedAtDate.textContent = getDate(new Date(clientObj.createdAt));
    colCreatedAtTime.textContent = getTime(new Date(clientObj.createdAt));
    colUpdatedAtDate.textContent = getDate(new Date(clientObj.updatedAt));
    colUpdatedAtTime.textContent = getTime(new Date(clientObj.updatedAt));

    // форматированиe даты для колонок "Дата и время создания" и "Последние изменения"
    function getDate(date) {
      let result = '';
      if (date.getDate() < 10) {
        result = result + '0'
      }
  
      result = result + date.getDate() + '.'
  
      if (date.getMonth() < 9) {
        result = result + '0'
      }
  
      result = result + (date.getMonth() + 1) + '.' + date.getFullYear()
  
      return result
    };

    // форматированиe времени для колонок "Дата и время создания" и "Последние изменения"
    function getTime(date) {
      let result = '';
      if (date.getHours() < 10) {
        result = result + '0'
      }
      result = result + date.getHours() + ':'
      if (date.getMinutes() < 10) {
        result = result + '0'
      }
      result = result + date.getMinutes()
      return result
    }

    // добавление иконок контакта в таблицу
    let contactsArr = clientObj.contacts
    contactsArr.forEach(element => {
      const contact = document.createElement('span');
      const tooltipText = document.createElement('span');  
      const iconBtn = document.createElement('button');  
      const icon = document.createElement('img');
 
      colContacts.append(contact);  
      contact.append(iconBtn);
               
      contact.append(tooltipText);
      iconBtn.append(icon);   

      contact.classList.add('srm__contact')    
      iconBtn.classList.add('tooltip-btn', 'btn-reset')
      tooltipText.classList.add('tooltip__text')
      
      tooltipText.textContent = element.type + ": " + element.value;
      if (element.type == "Телефон") {
        icon.src = 'img/phone.svg'
      } else if (element.type == "Email") {
        icon.src = 'img/email.svg'
      } else if (element.type == "Facebook") {
        icon.src = 'img/fb.svg'
      } else if (element.type == "VK") {
        icon.src = 'img/vk.svg'
      } else if (element.type == "Другое") {
        icon.src = 'img/other.svg'
      }
    })

    updatedBtn.textContent = "Изменить";
    deleteBtn.textContent = "Удалить";

    row.classList.add('srm__tbody-tr', 'flex');
    colId.classList.add('srm__id');
    colFullName.classList.add('srm__name');
    colCreatedAt.classList.add('srm__createdat');
    colUpdatedAt.classList.add('srm__updateat');
    colContacts.classList.add('srm__contacts');
    colBtn.classList.add('srm__btn-wrap');
    updatedBtn.classList.add('srm__updatebtn', 'btn-reset');
    deleteBtn.classList.add('srm__deletebtn', 'btn-reset'); 
    colCreatedAtDate.classList.add('srm__date'); 
    colUpdatedAtDate.classList.add('srm__date'); 
    colCreatedAtTime.classList.add('srm__time'); 
    colUpdatedAtTime.classList.add('srm__time'); 
    
    let clientObjCopy = ''
    clientObjCopy = clientObj
  
    // открыть модальное окно "Изменить"
    updatedBtn.addEventListener("click", function() {
      document.getElementById("errors__change").innerHTML = '';
      document.getElementById("modal__change").classList.add("open")
      changeClientItem(clientObjCopy)
    });
     
    // открыть модальное окно "Удалить"
    deleteBtn.addEventListener("click", function() {
      openModalDel(clientObj.id)
    });

    return row
  }

  function openModalDel(id) {
    document.getElementById("modal__del").classList.add("open")
    document.getElementById("modal__btn-delete").addEventListener("click", function() {
      
        deleteClient(id, clientsList);
    })
  }

      // функция удаления клиента
      async function deleteClient(id, clientsList) {
        await serverDeleteClient(id)
        // row.remove()
        closeModalDel()
        console.log(clientsList)
        let serverData = await serverGetClients()
        renderClientsTable(serverData)
        return 
      };

          // закрыть модальное окно "Удалить"
    function closeModalDel() {
      document.getElementById("modal__del").classList.remove("open")
    };
    
    document.getElementById("modal__del-close").addEventListener("click", closeModalDel) ;

    document.getElementById("modal__del-cancel").addEventListener("click", closeModalDel);

    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        closeModalDel()
      }
    });

    document.querySelector("#modal__del .modal__box").addEventListener('click', event => {
      event._isClickWithInModal = true;
    });
    document.getElementById("modal__del").addEventListener('click', event => {
      if (event._isClickWithInModal) return;
      event.currentTarget.classList.remove("open")
    });

  // изменения данных клиента 
  async function changeClientItem(clientIdData) {
    console.log(clientIdData)
    let clientObj = await serverGetClient(clientIdData.id);
    console.log(clientObj)
    const clientId = document.getElementById('modal__change-id');
          
    const changeSurname = document.getElementById('change__surname');
    const changeName = document.getElementById('change__name');
    const changeLastname = document.getElementById('change__lastname');
      
    clientId.textContent = clientObj.id;
    changeSurname.value = clientObj.surname;
    changeName.value = clientObj.name;
    changeLastname.value = clientObj.lastName;

    btnAddContactVis(document.querySelector(".modal-change__btn-add"))
     
    // выводим сохранённые контакты в форму
    clientObj.contacts.map(contact => {
      addContacts(document.querySelector('.form-change__contacts-list'), contact)
      if (document.querySelectorAll('.form-add__contacts').length > 9) {
        document.querySelector(".modal-change__btn-add").classList.add('invis')
      } else {
        document.querySelector('.modal-change__btn-add').classList.remove("invis")
      }
    })
      
    document.getElementById("change__btn-save").addEventListener("submit", async function(event) {
      // event.preventDefault();
      document.getElementById("errors__change").innerHTML = '';
         
      let contactsArr = [];
      let contactBlock = document.querySelectorAll(".form-add__contacts");
          
      // цикл перебора и добавления контактов из формы
      contactBlock.forEach(function(item) {
        let contactObg = {};
        contactObg.type = item.querySelector(".form-add__select").value.trim();
        contactObg.value = item.querySelector(".form-add__inputs").value.trim();
        contactsArr.push(contactObg)
      }) 
            
      const idClient = Number(clientId.textContent)
      let changeClientObj = {
        name: changeName.value.trim(),
        surname: changeSurname.value.trim(),
        lastName: changeLastname.value.trim(),
        contacts: contactsArr
      };
      console.log(changeClientObj)
           
      const dataChange = await serverChangeClients(changeClientObj, idClient);

      if (dataChange.errors) {
        dataChange.errors.map(element => {
          const error = document.createElement('span');
          error.textContent = element.message + ' ';
          document.getElementById('errors__change').append(error);       
        })
      }
      
      if (dataChange.name) {
        let clients = await serverGetClients()
         
        changeSurname.value = '';
        changeName.value = '';
        changeLastname.value = '';
          
        renderClientsTable(clients);
  
        document.querySelector('.form-change__contacts-list').replaceChildren()
          
        document.getElementById("modal__change").classList.remove("open")
        // clientIdData = ''
      }

      if (!dataChange.errors && !dataChange.name) {
        const error = document.createElement('span');
        error.textContent = 'Что-то пошло не так...';
        document.getElementById('errors__change').append(error);      
      }

      // clientIdData = ''
      return
      });

    }

    function btnAddContactVis(btn){
      if (document.querySelectorAll('.form-add__contacts').length > 9) {
        btn.classList.add('invis')
    } 

          // обработчик кнопки "удалить"
          document.getElementById('change__btn-delete').addEventListener("click", function() {
            document.getElementById("modal__change").classList.remove("open");
            let clientId = ''
            clientId = Number(document.getElementById('modal__change-id').textContent)
            console.log(Number(document.getElementById('modal__change-id').textContent))
            console.log(clientId)
            openModalDel(clientId)
            // openModalDel(clientObj)
          
          });

             // закрыть модальное окно "Изменить"
    document.getElementById("modal__change-close").addEventListener("click", async function() {
      document.querySelector('.form-change__contacts-list').replaceChildren()
      document.getElementById("modal__change").classList.remove("open")
      document.querySelector('.modal-change__btn-add').classList.remove("invis")
return
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        document.querySelector('.form-change__contacts-list').replaceChildren()
        document.getElementById("modal__change").classList.remove("open")
        document.querySelector('.modal-change__btn-add').classList.remove("invis")
        return
      }
    });

    document.querySelector("#modal__change .modal__box").addEventListener('click', event => {
      event._isClickWithInModal = true;
      return
    });
    document.getElementById("modal__change").addEventListener('click', event => {
      if (event._isClickWithInModal) return;
      document.querySelector('.form-change__contacts-list').replaceChildren()
      event.currentTarget.classList.remove("open")
      document.querySelector('.modal-change__btn-add').classList.remove("invis")
      document.createElement('span').innerHTML = '';
      return
    });

  }

  // обработчик кнопки "добавить контакт"
  document.querySelector(".modal-change__btn-add").addEventListener("click", function(event) {
    event.preventDefault();
    addContacts(document.querySelector('.form-change__contacts-list'))
    btnAddContactVis(document.querySelector(".modal-change__btn-add"))  
  });
          
  // функция создания формы контактов
  function addContacts(contactsList, el) {
    const addContact = document.createElement('li');
    const contactContainer = document.createElement('div');
    const contactSelect = document.createElement('select');
    const optionPhone = document.createElement('option');
    const optionEmail = document.createElement('option');
    const optionFacebook = document.createElement('option');
    const optionVK = document.createElement('option');
    const optionOther = document.createElement('option');
    const contactValue = document.createElement('input');
    const btnDelContact = document.createElement('button');
    const imgDelContact = document.createElement('img');

    contactsList.append(addContact);
    addContact.append(contactContainer);
    contactContainer.append(contactSelect);
    contactSelect.append(optionPhone);
    contactSelect.append(optionEmail);
    contactSelect.append(optionFacebook);
    contactSelect.append(optionVK);
    contactSelect.append(optionOther);
    contactContainer.append(contactValue);
    contactContainer.append(btnDelContact); 
    btnDelContact.append(imgDelContact);

    addContact.classList.add('form-add__contacts');
    contactContainer.classList.add('contact-container');
    contactSelect.classList.add('form-add__select', 'choices');
    contactValue.classList.add('form-add__inputs');
    btnDelContact.classList.add('form-add__btn-del');

    contactSelect.id = 'choices';

    contactValue.placeholder = 'Введите данные контакта';

    optionPhone.value = "Телефон";
    optionEmail.value = "Email";
    optionFacebook.value = "Facebook";
    optionVK.value = "VK";
    optionOther.value = "Другое";

    contactSelect.setAttribute('style', 'background-image: url(img/arrow.svg);');

    if (el) {
      contactSelect.value = el.type;
      contactValue.value = el.value;
    }

    optionPhone.textContent = "Телефон";
    optionEmail.textContent = "Email";
    optionFacebook.textContent = "Facebook";
    optionVK.textContent = "VK";
    optionOther.textContent = "Другое"; 

    imgDelContact.src = 'img/del-contact.svg';

      contactSelect.addEventListener("click", function(event) {
        event.preventDefault();
        if (!contactSelect.classList.contains('open-option')) {
          contactSelect.setAttribute('style', 'background-image: url(img/arrow_back.svg);');
          contactSelect.classList.add('open-option');
        } else if (contactSelect.classList.contains('open-option')) {
          contactSelect.setAttribute('style', 'background-image: url(img/arrow.svg);');
          contactSelect.classList.remove('open-option');
        }
      });

    contactSelect.addEventListener("blur", function(event) {
      event.preventDefault();
      contactSelect.setAttribute('style', 'background-image: url(img/arrow.svg);');
      contactSelect.classList.remove('open-option');
    });

    btnDelContact.addEventListener("click", function(event) {
      event.preventDefault();
      addContact.remove();
      if (document.querySelectorAll("form-add__contacts-list").length < 10) {
        document.querySelector('.modal-add__btn-add').classList.remove("invis");
        document.querySelector('.modal-change__btn-add').classList.remove("invis");
      }
    })
  }

  const btnAddContact = document.querySelector(".modal-add__btn-add");
  btnAddContact.addEventListener("click", function(event) {
    event.preventDefault();
    if (document.querySelectorAll('.form-add__contacts').length > 8) {
      btnAddContact.classList.add('invis');
    } else {
      btnAddContact.classList.remove('invis');
    }
    addContacts(document.querySelector('.form-add__contacts-list'))
  });

  // функция добавления одного клиента через форму
  document.querySelector(".modal__btn-save").addEventListener('click', async function(event) {
    event.preventDefault();
    document.getElementById("errors__create").innerHTML = '';

    let contactsArr = [];
    let contactBlock = document.querySelectorAll(".form-add__contacts");

    // цикл перебора и добавления контактов из формы
    contactBlock.forEach(function(item) {
      let contactObg = {};
      contactObg.type = item.querySelector(".form-add__select").value.trim();
      contactObg.value = item.querySelector(".form-add__inputs").value.trim();
      contactsArr.push(contactObg)
    }) 

    let newClientObj = {
      surname: formSurname.value.trim(),
      name: formName.value.trim(),
      lastName: formLastName.value.trim(),
      contacts: contactsArr
    };

    const dataCreate = await serverAddClient(newClientObj);

    if (dataCreate.errors) {
      dataCreate.errors.map(element => {
        const error = document.createElement('span');
        error.textContent = element.message + ' ';
        document.getElementById('errors__create').append(error);       
      })
    }
    
    if (dataCreate.name) {
      let clients = await serverGetClients()
       
      formSurname.value = '';
      formName.value = '';
      formLastName.value = '';
      document.querySelector('.form-add__contacts-list').replaceChildren()

      renderClientsTable(clients);
      document.getElementById("modal__add").classList.remove("open");
    }

    if (!dataCreate.errors && !dataCreate.name) {
      const error = document.createElement('span');
      error.textContent = 'Что-то пошло не так...';
      document.getElementById('errors__create').append(error);      
    }
  })
    
    // сортировка
    document.getElementById('srm__thead-sort--id').addEventListener('click', async function(event) {
      event.preventDefault();
      let clients = await serverGetClients()
      renderClientsTable(clients);
      sortColFlag = 'id';
      sortDirFlag = !sortDirFlag;
      removeSort()
      document.getElementById('srm__thead-id').classList.add('srm__thead--color-active');
      if (sortDirFlag == true) {
        document.getElementById('srm__thead-sort--id-svg').classList.add('srm__thead-dir');
      } else {
        document.getElementById('srm__thead-sort--id-svg').classList.remove('srm__thead-dir');
      }
      renderClientsTable(clients);
    });

    document.getElementById('srm__thead-sort--name').addEventListener('click', async function(event) {
      event.preventDefault();
      let clients = await serverGetClients()
      renderClientsTable(clients);
      sortColFlag = 'fullName';
      sortDirFlag = !sortDirFlag;
      removeSort();
      document.getElementById('srm__thead-name').classList.add('srm__thead--color-active');
      if (sortDirFlag == true) {
        document.getElementById('srm__thead-sort--name-svg').classList.add('srm__thead-dir');
      } else {
        document.getElementById('srm__thead-sort--name-svg').classList.remove('srm__thead-dir');
      }
      renderClientsTable(clients);
    });

    document.getElementById('srm__thead-sort--create').addEventListener('click', async function() {
      let clients = await serverGetClients()
      renderClientsTable(clients);
      sortColFlag = 'createdAt';
      sortDirFlag = !sortDirFlag;
      removeSort()
      document.getElementById('srm__thead-create').classList.add('srm__thead--color-active');
      if (sortDirFlag == true) {
        document.getElementById('srm__thead-sort--create-svg').classList.add('srm__thead-dir');
      } else {
        document.getElementById('srm__thead-sort--create-svg').classList.remove('srm__thead-dir');
      }
      renderClientsTable(clients);
    });

    document.getElementById('srm__thead-sort--update').addEventListener('click', async function() {
      let clients = await serverGetClients()
      renderClientsTable(clients);
      sortColFlag = 'updatedAt';
      sortDirFlag = !sortDirFlag;
      removeSort()
      document.getElementById('srm__thead-update').classList.add('srm__thead--color-active');
      if (sortDirFlag == true) {
        document.getElementById('srm__thead-sort--update-svg').classList.add('srm__thead-dir');
      } else {
        document.getElementById('srm__thead-sort--update-svg').classList.remove('srm__thead-dir');
      }
      renderClientsTable(clients);
    });

    function removeSort() {
      document.getElementById('srm__thead-sort--id-svg').classList.remove('srm__thead-dir');
      document.getElementById('srm__thead-sort--name-svg').classList.remove('srm__thead-dir');
      document.getElementById('srm__thead-sort--create-svg').classList.remove('srm__thead-dir');
      document.getElementById('srm__thead-sort--update-svg').classList.remove('srm__thead-dir');
      document.getElementById('srm__thead-id').classList.remove('srm__thead--color-active');
      document.getElementById('srm__thead-name').classList.remove('srm__thead--color-active');
      document.getElementById('srm__thead-create').classList.remove('srm__thead--color-active');
      document.getElementById('srm__thead-update').classList.remove('srm__thead--color-active');
    }   

})
