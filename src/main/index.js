import { app, BrowserWindow,Menu,ipcMain } from 'electron'
import electron from 'electron';
import  {
  login,
  getUserInfo
} from './js/api';
import  { formatCookie,serializeParams } from './js/utils';
let COOKIE = null;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 750,
    useContentSize: true,
    width: 400
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

ipcMain.on('login', (e, arg) => {
  // 登录
  login(arg).then(res => {
    COOKIE = formatCookie(res.headers['set-cookie']);    
  }, err => {    
    throw err;
  }).then(()=>{
    // 获取用户信息
    return getUserInfo(serializeParams(COOKIE,';'));
  }).then(res=>{
    if(res !== '0'){
      mainWindow.webContents.send('user-info', res);
    }else{
      throw '登陆失败';
    }    
  }).catch(err=>{
    // 获取信息失败 登录失败信息
    console.log('index.js',err);   
    mainWindow.webContents.send('login-err', err.message || err.descrption || err);
  });
});