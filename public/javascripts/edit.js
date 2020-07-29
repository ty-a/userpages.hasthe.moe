function addLanguage(lang) {
// check inputs
  // only allow letters and dashes
  let re = /[\w-]{1,10}/;
  if(!re.test(lang)) {
    alert("invalid language code");
    return;
  }

  // create elements
  var holder = document.createElement('div');
  holder.setAttribute('class', 'form-group')
  holder.setAttribute('id', 'div-' + lang);

  var label = document.createElement('label');
  label.textContent = lang;
  label.setAttribute('for', lang);

  var inputgroup = document.createElement('div');
  inputgroup.setAttribute('class', 'input-group');

  var textbox = document.createElement('input');
  textbox.setAttribute('type', 'text');
  textbox.setAttribute('id', lang);
  textbox.setAttribute('name', lang);
  textbox.setAttribute('class', 'form-control');

  var deletethis = document.createElement('button');
  deletethis.setAttribute('type', 'button');
  deletethis.setAttribute('class', 'btn btn-danger');
  deletethis.setAttribute('onClick', 'deleteLanguage(\'' + lang + '\');');
  deletethis.textContent = 'Delete';

  // add them to form
  var form = document.getElementById('userpages');

  inputgroup.appendChild(textbox);
  inputgroup.appendChild(deletethis);

  holder.appendChild(label);
  holder.appendChild(inputgroup);

  form.appendChild(holder);

  // clean up
  document.getElementById('newlang').value = "";
}

function deleteLanguage(lang) {
  var divToRemove = document.getElementById('div-' + lang);
  divToRemove.remove();


}
