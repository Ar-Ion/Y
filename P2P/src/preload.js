const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    select_artwork: () => ipcRenderer.send('select_artwork'),
    sign_artwork: (payload) => ipcRenderer.send('sign_artwork', payload),
    load_registry: () => ipcRenderer.send('load_registry'),
    load_followers: () => ipcRenderer.send('load_followers'),
    load_latest_content: () => ipcRenderer.send('load_latest_content'),
    add_follower: (payload) => ipcRenderer.send('add_follower', payload),
    get_user_uid: () => ipcRenderer.send('get_user_uid'),
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
    },
    latest_content_loaded: (func) => {
        ipcRenderer.on('latest_content_loaded', (event, followers) => func(followers));
    },
    follower_added: (func) => {
        ipcRenderer.on('follower_added', (event, payload) => func(payload));
    },
    got_user_uid: (func) => {
        ipcRenderer.on('got_user_uid', (event, uid) => func(uid));
    },
})
