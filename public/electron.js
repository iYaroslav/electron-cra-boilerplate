const electron = require('electron')
const { app, BrowserWindow, Menu } = electron
const debug = require('debug')('Electron')
const { ipcMain: ipc } = require('electron-better-ipc')

const path = require('path')
const isDev = require('electron-is-dev')
const test = require('./test')

let mainWindow

test()

/** INFO You can also use crash reporter like this: **/
// const { crashReporter } = electron
// crashReporter.start({
//   productName: 'YourName',
//   companyName: 'YourCompany',
//   submitURL: 'https://your-domain.com/url-to-submit',
//   uploadToServer: true
// })

ipc.answerRenderer('ping', async message => {
  return `PONG. Message: ${message}`
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
    },
  })

  mainWindow
    .loadURL(isDev ? 'http://localhost:3333' : `file://${path.join(__dirname, '../build/index.html')}`)
    .catch(debug)

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show()

    if (isDev) {
      mainWindow.webContents.on('context-menu', (e, props) => {
        Menu.buildFromTemplate([
          {
            label: 'Inspect element',
            click() {
              mainWindow.inspectElement(props.x, props.y)
            },
          },
        ]).popup(mainWindow)
      })
    }
  })

  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)

app.on('window-all-closed', app.quit)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

process.on('SIGINT', () => {
  debug('Bye bye!')
  app && app.quit()
  process.exit()
})
