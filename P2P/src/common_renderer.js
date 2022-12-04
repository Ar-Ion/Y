// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var syncingProgress = document.getElementById('syncing-progress');
var syncingText = document.getElementById('syncing-text');
var numArtworks = document.getElementById('num-artworks');

window.electronAPI.load_registry();

window.electronAPI.registry_loaded((synced, userRegistry) => {

    if(numArtworks) {
        numArtworks.innerHTML = userRegistry.artist.content.length;
    }

    if(synced) {
        syncingProgress.style.visibility = 'hidden';
        syncingText.innerHTML = 'Synchronisation complete'
    }
});
