// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var selectedArtwork = document.getElementById('selected-artwork');
var signingProgress = document.getElementById('signing-progress');
var artworkTitle = document.getElementById('artwork-title');
var artworkDescription = document.getElementById('artwork-description');
var artworkType = document.getElementById('artwork-type');

var modalClose = document.getElementById('modal-close');

signingProgress.style.visibility = 'hidden';

var dataSet = [];

var contentTable = $('#content-table').DataTable({
    order: [[3, "desc"]],
    data: dataSet,
    columns: [
        { title: 'Title' },
        { title: 'Description' },
        { title: 'Type' },
        { title: 'Date created' },
        { title: 'Date updated' }
    ],
});

document.querySelector('#select-artwork').addEventListener('click', () => {
    window.electronAPI.select_artwork();
})

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

document.querySelector('#sign-artwork').addEventListener('click', () => {
    if(!isBlank(selectedArtwork.innerHTML)) {
        signingProgress.style.visibility = 'visible';

        var title = artworkTitle.value
        var description = artworkDescription.value
        var type = artworkType.value

        if(!isBlank(title) && !isBlank(description) && !isBlank(type)) {

            var payload = {}
            payload.title = title;
            payload.description = description;
            payload.type = type;
            payload.date_created = null;
            payload.date_updated = null;
            payload.signature = null;
            payload.meta_signature = null;

            window.electronAPI.sign_artwork(payload);
        }
    }
})

window.electronAPI.artwork_selected((artwork) => {
    selectedArtwork.innerHTML = artwork;
});

window.electronAPI.artwork_signed((payload) => {
    signingProgress.style.visibility = 'hidden';

    console.log("Artwork signed!");
    console.log(payload)

    contentTable.row.add([payload.title, payload.description, payload.type, payload.date_created, payload.date_updated]).draw()

    modalClose.click();
});

window.electronAPI.load_registry();

window.electronAPI.registry_loaded((synced, userRegistry) => {
    contentTable.clear();

    userRegistry.artist.content.forEach((artwork) => {
        var title = artwork.title;
        var description = artwork.description;
        var type = artwork.type;
        var date_created = artwork.date_created;
        var date_updated = artwork.date_updated;

        contentTable.row.add([title, description, type, date_created, date_updated])
    });

    contentTable.draw();
});
