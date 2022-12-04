const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    select_artwork: () => ipcRenderer.send('select_artwork'),
    sign_artwork: (payload) => ipcRenderer.send('sign_artwork', payload),
    load_registry: () => ipcRenderer.send('load_registry'),
    load_followers: () => ipcRenderer.send('load_followers'),
    artwork_selected: (func) => {
        ipcRenderer.on('artwork_selected', (event, artwork) => func(artwork));
    },
    artwork_signed: (func) => {
        ipcRenderer.on('artwork_signed', (event, payload) => func(payload));
    },
    registry_loaded: (func) => {
        ipcRenderer.on('registry_loaded', (event, synced, userRegistry) => func(synced, userRegistry));
    },
    followers_loaded: (func) => {
        ipcRenderer.on('followers_loaded', (event, followers) => func(followers));
    }
})
