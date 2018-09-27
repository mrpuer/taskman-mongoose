$(document).ready(function() {
  $('#alert').hide();
  $('#new-user').hide();
  $('#new-task').hide();

  $('#tasks-tab').click(function() {
    $('#users-tab').toggleClass('active');
    $('#tasks-tab').toggleClass('active');
    $('#tasks').toggleClass('show active');
    $('#users').toggleClass('show active');
  });

  $('#users-tab').click(function() {
    $('#tasks-tab').toggleClass('active');
    $('#users-tab').toggleClass('active');
    $('#users').toggleClass('show active');
    $('#tasks').toggleClass('show active');
  });

  // события кнопки нового юзера
  $('#add-user-button').click(function() {
    $('#add-user-button').hide();
    $('#add-task-button').hide();
    $('#new-user').show('slow');
    $('#search-form').hide();
  });

  //события кнопки нового таска
  $('#add-task-button').click(function() {
    $('#add-user-button').hide();
    $('#add-task-button').hide();
    $('#new-task').show('slow');
    $('#search-form').hide();
    makeFormValues();
  });

  // кнопка закрытия формы нового юзера
  $("body").on('click', '#close-user-form', function() {
    $('#new-user').hide('slow');
    $('#add-user-button').show();
    $('#add-task-button').show();
    $('#search-form').show();
  });

  //кнопка закрытия формы нового таска
  $("body").on('click', '#close-task-form', function() {
    $('#new-task').hide('slow');
    $('#add-user-button').show();
    $('#add-task-button').show();
    $('#search-form').show();
  });

  // нажатие кнопки добавления юзера
  $('#add-user-form').click(function() {
    addUser();
  });

    // нажатие кнопки добавления таска
  $('#add-task-form').click(function() {
    addTask();
  });

  // кнопка удаления контакта
  $("body").on('click', '#user-delete', function() {
    const id = $(this).data('id');
    delUser(id);
  });

  // кнопка редактирования контакта
  $("body").on('click', '#user-edit', function() {
    const id = $(this).data('id');
    editUser(id);
  });

   // кнопка редактирования таска
   $("body").on('click', '#task-edit', function() {
    const id = $(this).data('id');
    editTask(id);
  });

  // кнопка удаления таска
  $("body").on('click', '#task-delete', function() {
    const id = $(this).data('id');
    delTask(id);
  });

  // жмем на кнопку поиска
  $("#search-button").on('click', function() {
    const what = $('#search-query').val();
    const where = $('#search-select').val();
    searchUser(what, where);
  });

  //жмем на кнопку ресет поиск
  $('#reset-search').click(function() {
    $('#search-query').val('');
    $('#search-select').val('name');
    makeTasksList();
  });

  makeUsersList();
  makeTasksList();
});

// отправка запроса серверу
const sendReq = function (reqUrl, method, reqData, callback) {
  $.ajax({
    url: reqUrl,
    type: method,
    data: reqData,
    success: function (data) {
      callback(data);
    },
  });
};

 // показывает алерт о выполненной операции
const getAlert = function (alertType) {
  const alertAction = (alertClass, h4Message, pMessage) => {
    $('#alert').addClass(`alert alert-dismissible ${alertClass}`)
    .html(`<button type="button" class="close" data-dismiss="alert">&times;</button>
    <h4 class="alert-heading">${h4Message}</h4>
    <p class="mb-0"> ${pMessage}</p>`)
    .show('slow');
    setTimeout(function() {
      $('#alert').fadeOut('slow');
    }, 3000);
  };
  switch (alertType) {
    case 'add':
      alertAction('alert-success', 'Well done!', 'You successfully add new item.');
      break;
    case 'del':
      alertAction('alert-success', 'Well done!', 'Item has been deleted');
      break;
    case 'edit':
      alertAction('alert-success', 'Well done!', 'Item has been edited');
      break;
    default:
      alertAction('alert-danger', 'Error!', 'Sorry, application error.');
  }
};

// получаем всех юзеров
const getAllUsers = function(callback) {
  sendReq('/api/users', 'GET', {}, function (users) {
    callback(users);
  });
};

// формируем таблицу юзеров
const makeUsersList = function() {
  $('#users-list').empty();
  getAllUsers(function(users) {
    console.log(users);
    $.each(users, function (index, user) {
      const content = `<tr id='tr-user${user.id}'>
                        <td>${index + 1}</td>
                        <td id="username">${user.name}</td>
                        <td id="user-tasks">${user.tasks}</td>
                        <td><span class="badge badge-warning" id="user-delete" data-id="${user.id}">
                        Delete</span>
                        <span class="badge badge-info" id="user-edit" data-id="${user.id}">Edit</span></td>
                        </tr>`;
      $('#users-list').append(content);
    });
  });
};

// формируем таблицу тасков
const makeTasksList = function() {
  $('#tasks-list').empty();
  sendReq('/api/tasks', 'GET', {}, function (tasks) {
    $.each(tasks, function (index, task) {
      const trClass = task.status ? 'table-success' : 'table-danger';
      const statusText = task.status ? 'Active' : 'Disabled' ;
      const content = `<tr class="${trClass}" id="tr${task.id}" data-id="${task.userId}">
                        <td>${index + 1}</td>
                        <th id="task-name" scope="row">${task.name}</td>
                        <td id="task-desc">${task.desc}</td>
                        <td id="task-stat">${statusText}</td>
                        <td>${task.userName}</td>
                        <td><span class="badge badge-warning" id="task-delete" data-id="${task.id}">
                        Delete</span>
                        <span class="badge badge-info" id="task-edit" data-id="${task.id}">Edit</span></td>
                        </tr>`;
      $('#tasks-list').append(content);
    });
  });
};

// сформировать юзеров для формы добавления таска
const makeFormValues = function() {
  $('#task-user').empty();
  getAllUsers(function(users) {
    if (users.length === 0) {
      $('#task-user').append('<option selected="">Add user first!</option>');
    } else {
      $.each(users, function (index, user) {
        $('#task-user').append(`<option value="${user.id}">${user.name}</option>`);
      });
    }
  });
};

// логика добавления нового контакта
const addUser = function() {
  $('#new-user').hide('slow');
  $('#add-user-button').show();
  $('#add-task-button').show();
  $('#search-form').show();
  const name = $('#user-name').val();
  $('#user-name').val('');
  sendReq('/api/contacts/', 'POST', { name }, function (result) {
    if (result !== 'ok') {
      getAlert('err');
    } else {
      getAlert('add');
      makeUsersList();
    }
  });
};

// логика добавления нового таска
const addTask = function() {
  $('#new-task').hide('slow');
  $('#add-user-button').show();
  $('#add-task-button').show();
  $('#search-form').show();
  const name = $('#task-name').val();
  const desc = $('#task-desc').val();
  const status = Number($('#task-status').val());
  const user = $('#task-user').val();
  $('#task-name').val('');
  $('#task-desc').val('');
  const content = { name, desc, status, user };
  sendReq('/api/tasks/', 'POST', { content }, function (result) {
    if (result !== 'ok') {
      getAlert('err');
    } else {
      getAlert('add');
      makeTasksList();
      makeUsersList();
    }
  });
};

// логика удаления контакта
const delUser = function (contactID) {
  sendReq(`/api/users/${contactID}`, 'DELETE', {}, function (result) {
    if (result !== 'ok') {
      getAlert('err');
    } else {
      getAlert('del');
      makeUsersList();
    }
  });
};

// логика удаления таска
const delTask = function (contactID) {
  sendReq(`/api/tasks/${contactID}`, 'DELETE', {}, function (result) {
    if (result !== 'ok') {
      getAlert('err');
    } else {
      getAlert('del');
      makeTasksList();
      makeUsersList();
    }
  });
};

// модальное окно редактирования контакта
const editUser = function (contactID) {
  $( "#edit-user-save" ).unbind("click");
  $(`#name-edit`).val($(`#tr-user${contactID} #username`).text());
  $("#modal-user").modal('show');
  $('#edit-user-save').click(() => {
    $("#modal-user").modal('hide');
    const name = $('#name-edit').val();
    sendReq(`/api/users/${contactID}`, 'PUT', { id: contactID, name }, function (result) {
      if (result.n !== 1) {
        getAlert('err');
      } else {
        getAlert('edit');
        makeUsersList();
        makeTasksList();
      }
    });
  });
};

// модальное окно редактироания таска
const editTask = function (taskID) {
  $( "#edit-task-save" ).unbind("click");
  $('#task-users-edit').empty();
  $('#tname-edit').val($(`#tr${taskID} #task-name`).text().trim());
  $('#desc-edit').val($(`#tr${taskID} #task-desc`).text());
  if ($(`#tr${taskID} #task-stat`).text() === 'Active') {
    $('#task-dis').removeAttr('selected');
    $('#task-act').attr('selected', 'selected');
  } else {
    $('#task-act').removeAttr('selected');
    $('#task-dis').attr('selected', 'selected');
  }
  const userId = $(`#tr${taskID}`).data('id');
  getAllUsers((users) => {
    $.each(users, (index, user) => {
      if (userId === user.id) {
        $('#task-users-edit').append(`<option value="${user.id}" selected="selected">${user.name}</option>`);
      } else {
        $('#task-users-edit').append(`<option value="${user.id}">${user.name}</option>`);
      }
    })
  });
  $('#modal-task').modal('show');
  $('#edit-task-save').click(() => {
    $('#modal-task').modal('hide');
    const name = $('#tname-edit').val();
    const desc = $('#desc-edit').val();
    const status = $('#task-status-edit').val();
    const user = $('#task-users-edit').val();
    sendReq(`/api/tasks/${taskID}`, 'PUT', { name, desc, status, user }, function (result) {
      if (result !== 'ok') {
        getAlert('err');
      } else {
        getAlert('edit');
        makeTasksList();
      }
    });
  });
};

// поиск
const searchUser = function (what, where) {
  sendReq(`/api/search/`, 'GET', { what, where }, function (tasks) {
    $('#tasks-list').empty();
    $.each(tasks, function (index, task) {
      const trClass = task.status ? 'table-success' : 'table-danger';
      const statusText = task.status ? 'Active' : 'Disabled' ;
      const content = `<tr class="${trClass}" id="tr${task.id}" data-id="${task.userId}">
                        <td>${index + 1}</td>
                        <th id="task-name" scope="row">${task.name}</td>
                        <td id="task-desc">${task.desc}</td>
                        <td id="task-stat">${statusText}</td>
                        <td>${task.userName}</td>
                        <td><span class="badge badge-warning" id="task-delete" data-id="${task.id}">
                        Delete</span>
                        <span class="badge badge-info" id="task-edit" data-id="${task.id}">Edit</span></td>
                        </tr>`;
      $('#tasks-list').append(content);
    });
  });
};