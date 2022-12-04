const { app, BrowserWindow, dialog, ipcMain } = require('electron')

const path = require('path')
const fs = require('fs')

const { update_blockchain, add_follower, count_followers } = require('./backend.js')

let mainWindow;
let selectedFile;
let globalNode;
let globalPeerID;

userRegistrySynced = false;
let userRegistry = {};
userRegistry.user = {};
userRegistry.user.following = [];
userRegistry.artist = {};
userRegistry.artist.content = [];
userRegistry.lastUpdate = 0;

let followers;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile("src/index.html");

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools()
}

ipcMain.on('select_artwork', (event) => {
  // If the platform is 'win32' or 'Linux'
  if (process.platform !== 'darwin') {
    dialog.showOpenDialog({
      title: 'Select the File to be uploaded',
      defaultPath: path.join(__dirname, '../assets/'),
      buttonLabel: 'Upload',
      properties: ['openFile']
    }).then(file => {
        selectedFile = null;
      if (!file.canceled) {
        const filepath = file.filePaths[0].toString();
        selectedFile = filepath;
        event.reply('artwork_selected', path.parse(filepath).base)
      }
    }).catch(err => {
        selectedFile = null;
      console.log(err)
    });
  }
  else {
    // If the platform is 'darwin' (macOS)
    dialog.showOpenDialog({
      title: 'Select the File to be uploaded',
      defaultPath: path.join(__dirname, '../assets/'),
      buttonLabel: 'Upload',
      properties: ['openFile']
    }).then(file => {
        selectedFile = null;
      if (!file.canceled) {
          const filepath = file.filePaths[0].toString();
          selectedFile = filepath;
          event.reply('artwork_selected', path.parse(filepath).base)
        }
  }).catch(err => {
      selectedFile = null;
      console.log(err)
    });
}
});

ipcMain.on('load_registry', (event) => {
    event.reply('registry_loaded', userRegistrySynced, userRegistry);
});

ipcMain.on('load_followers', async (event) => {
    await followers;
    event.reply('followers_loaded', followers);
});

async function update_user_registry() {
    userRegistry.lastUpdate = Date.now();

    try {
        fs.writeFileSync('user_registry.db', JSON.stringify(userRegistry), 'utf-8');
    } catch(e) {
        console.log(e)
    }

    const resultRegistry = await globalNode.add(JSON.stringify(userRegistry));

    const results = await globalNode.name.publish(resultRegistry.path);
    console.log(results)
}

async function sign_artwork(payload) {
    if(selectedFile != null) {
        console.log("Signing " + selectedFile + "...")

        const buffer_content = fs.readFileSync(selectedFile);
        const result_content = await globalNode.add(buffer_content);

        var date = new Date
        const result = date.toLocaleString("en-GB", {timeZone: 'CET'})

        payload.date_created = result;
        payload.date_updated = result;
        payload.signature = result_content.path;

        userRegistry.artist.content.push(payload)

        //await update_user_registry()

        await update_blockchain(Buffer.from(globalPeerID.id.publicKey).toString('hex'), payload.signature)

        selectedFile = null;
        mainWindow.webContents.send('artwork_signed', payload)
    }
}

ipcMain.on('sign_artwork', (event, payload) => {
    sign_artwork(payload)
})


async function all(source) {
  const arr = []

  for await (const entry of source) {
    arr.push(entry)
  }

  return arr
}

function asUint8Array (buf) {
  if (globalThis.Buffer != null) {
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  }

  return buf
}

function concat (arrays, length) {
  if (length == null) {
    length = arrays.reduce((acc, curr) => acc + curr.length, 0)
  }

  const output = Buffer.allocUnsafe(length)
  let offset = 0

  for (const arr of arrays) {
    output.set(arr, offset)
    offset += arr.length
  }

  return asUint8Array(output)
}

function toString (array) {
    return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString('utf8')
}



async function fetchRegistry(ipfsPath) {
    const data = concat(await all(globalNode.cat(ipfsPath)))
    const serializedRegistry = toString(data)
    return JSON.parse(serializedRegistry)
}

app.on("ready", async () => {
  createWindow();

  try {
      userRegistry = JSON.parse(fs.readFileSync('user_registry.db', 'utf-8'));
  } catch(e) {
      console.log(e)
  }

  try {

    const IPFS = await import('ipfs-core')
    const node = await IPFS.create();
    const id = await node.id();

    globalNode = node;
    globalPeerID = id;

    var mostRecentTime = 0;
    var mostRecentRegistry;

    for await (const name of node.name.resolve(id.id)) {
      candidate = await fetchRegistry(name)

      if(candidate.lastUpdate > mostRecentTime) {
          mostRecentTime = candidate.lastUpdate;
          mostRecentRegistry = candidate;
      }

      userRegistry = mostRecentRegistry;
      userRegistrySynced = true;

      mainWindow.webContents.send('registry_loaded', userRegistrySynced, userRegistry);
    }

    console.log("Latest registry: " + mostRecentTime)

    followers = count_followers(id.id.publicKey)
  } catch (err) {
    console.error(err);
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
