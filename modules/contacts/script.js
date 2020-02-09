if (!localStorage.getItem('contacts')) {
    localStorage.setItem('contacts', '[]');
}
var contacts = JSON.parse(localStorage.getItem('contacts'));
displayContacts();

function displayContacts() {
    const list = document.getElementById('contacts');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    contacts.forEach(function (contact) {
        var li = document.createElement('li');
        const del = document.createElement('span');
        del.id = 'del';
        del.innerHTML = '&times;';
        del.onclick = function(e) {
            const name = e.target.parentNode.innerText;
            removeContact(name.substr(0, name.length - 2));
            document.getElementById('contacts').removeChild(e.target.parentNode);
        }
        li.innerText = contact;
        li.appendChild(del);
        list.appendChild(li);
    });
}

function refresh() {
    contacts = JSON.parse(localStorage.getItem('contacts'));
    displayContacts();
}

function removeContact(name) {
    var index = contacts.indexOf(name);
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function addContact() {
    const name = document.getElementById('name').value;
    document.getElementById('name').value = '';
    contacts.push(name);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    refresh();
}
