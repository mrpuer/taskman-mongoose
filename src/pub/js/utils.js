$(document).ready(function() {
  $('#alert').hide();
  $('#new-user').hide();
  $('#new-task').hide();

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

//   // кнопка добавления нового контакта
//   $('#add-user-form').click(function() {
//     addUser();
//   });

//   // кнопка удаления контакта
//   $("body").on('click', '#user-delete', function() {
//     const id = $(this).data('id');
//     delUser(id);
//   });

//   $("body").on('click', '#user-edit', function() {
//     const id = $(this).data('id');
//     editUser(id);
//   });

//   $("#search-button").on('click', function() {
//     const query = $('#search-form').val();
//     const where = $('#search-select').val();
//     searchUser(query, where);
//   });

//   $('#body').on('click', '#reset-button', function() {
//     alert('aaa');
//   });

//   getUsers();
// });

// // отправка запроса серверу
// const sendReq = function (reqUrl, method, reqData, callback) {
//   $.ajax({
//     url: reqUrl,
//     type: method,
//     data: reqData,
//     success: function (data) {
//       callback(data);
//     },
//   });
// };
//  // показывает алерт о выполненной операции
// const getAlert = function (alertType) {
//   const alertAction = (alertClass, h4Message, pMessage) => {
//     $('#alert').addClass(`alert alert-dismissible ${alertClass}`)
//     .html(`<button type="button" class="close" data-dismiss="alert">&times;</button>
//     <h4 class="alert-heading">${h4Message}</h4>
//     <p class="mb-0"> ${pMessage}</p>`)
//     .show('slow');
//     setTimeout(function() {
//       $('#alert').fadeOut('slow');
//     }, 3000);
//   };
//   switch (alertType) {
//     case 'add':
//       alertAction('alert-success', 'Well done!', 'You successfully add new contact.');
//       break;
//     case 'del':
//       alertAction('alert-success', 'Well done!', 'Contact has been deleted');
//       break;
//     case 'edit':
//       alertAction('alert-success', 'Well done!', 'Contact has been edited');
//       break;
//     default:
//       alertAction('alert-danger', 'Error!', 'Sorry, application error.');
//   }
// };

// // логика отображения таблицы контактов
// const getUsers = function() {
//   $('#contacts-list').empty();
//   sendReq('/api/contacts', 'GET', {}, function (users) {
//     $.each(users, function (index, user) {
//       const content = `<tr class="table-dark" id="contact${user.id}">
//                         <td>${index + 1}</td>
//                         <td id="fname${user.id}">${user.firstName}</td>
//                         <td id="lname${user.id}">${user.lastName}</td>
//                         <td id="phone${user.id}">${user.phone}</td>
//                         <td><span class="badge badge-danger" id="user-delete" data-id="${user.id}">
//                         Delete</span>
//                         <span class="badge badge-info" id="user-edit" data-id="${user.id}">Edit</span></td>
//                         </tr>`;
//       $('#contacts-list').append(content);
//     });
//   });
// };

// // логика добавления нового контакта
// const addUser = function() {
//   $('#new-contact').hide('slow');
//   $('#add-user-button').show();
//   $('#search-form').show();
//   const fname = $('#fname').val();
//   const lname = $('#lname').val();
//   const phone = $('#phone').val();
//   const contact = { fname, lname, phone };
//   sendReq('/api/contacts/', 'POST', contact, function (result) {
//     if (result.n !== 1) {
//       getAlert('err');
//     } else {
//       getAlert('add');
//       getUsers();
//     }
//   });
// };

// // логика удаления контакта
// const delUser = function (contactID) {
//   sendReq(`/api/contacts/${contactID}`, 'DELETE', {}, function (result) {
//     if (result.n !== 1) {
//       getAlert('err');
//     } else {
//       getAlert('del');
//       getUsers();
//     }
//   });
// };

// // логика редактироания контакта
// const editUser = function (contactID) {
//   $( "#edit-contact-save" ).unbind("click");
//   $(`#fname-edit`).val($(`#fname${contactID}`).text());
//   $(`#lname-edit`).val($(`#lname${contactID}`).text());
//   $(`#phone-edit`).val($(`#phone${contactID}`).text());
//   $("#modal-box").modal('show');
//   $('#edit-contact-save').click(() => {
//     $("#modal-box").modal('hide');
//     const fname = $('#fname-edit').val();
//     const lname = $('#lname-edit').val();
//     const phone = $('#phone-edit').val();
//     const contact = { fname, lname, phone };
//     sendReq(`/api/contacts/${contactID}`, 'PUT', { contact }, function (result) {
//       if (result.n !== 1) {
//         getAlert('err');
//       } else {
//         getAlert('edit');
//         getUsers();
//       }
//     });
//   });
// };

// // поиск
// const searchUser = function (what, where) {
//   sendReq(`/api/search/`, 'GET', { what, where }, function (result) {
//     $('#contacts-list').empty();
//     $.each(result, function (index, user) {
//       const content = `<tr class="table-dark" id="contact${user.id}">
//                         <td>${index + 1}</td>
//                         <td id="fname${user.id}">${user.firstName}</td>
//                         <td id="lname${user.id}">${user.lastName}</td>
//                         <td id="phone${user.id}">${user.phone}</td>
//                         <td><span class="badge badge-danger" id="user-delete" data-id="${user.id}">
//                         Delete</span>
//                         <span class="badge badge-info" id="user-edit" data-id="${user.id}">Edit</span></td>
//                         </tr>`;
//       $('#contacts-list').append(content);
//     });
//   });
// };