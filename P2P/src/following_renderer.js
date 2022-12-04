// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var addingProgress = document.getElementById('adding-progress');
var artist = document.getElementById('artist');

var modalClose = document.getElementById('modal-close');

addingProgress.style.visibility = 'hidden';

var dataSet = [];

var contentTable = $('#following-table').DataTable({
    data: dataSet,
    columns: [
        { title: 'Name' },
        { title: 'Following since' }
    ],
});


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

document.querySelector('#add-follower').addEventListener('click', () => {
    addingProgress.style.visibility = 'visible';

    var artistUID = artist.value

    if(!isBlank(artistUID)) {

        var payload = {}
        payload.name = null;
        payload.uid = artistUID;

        window.electronAPI.add_follower(payload);
    } else {
        addingProgress.style.visibility = 'hidden';
    }
})


window.electronAPI.follower_added((payload) => {
    contentTable.row.add([payload.name, payload.date_added]).draw()

    modalClose.click();
});

window.electronAPI.load_registry();

window.electronAPI.registry_loaded((synced, userRegistry) => {
    contentTable.clear();

    userRegistry.user.following.forEach((followed) => {
        if(followed.name && followed.date_added) {
            var name = followed.name;
            var date_added = followed.date_added;

            contentTable.row.add([name, date_added])
        }
    });

    contentTable.draw();
});
