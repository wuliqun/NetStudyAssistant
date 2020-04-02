import { app, BrowserWindow,Menu,ipcMain } from 'electron'
import  {
  login,
  getUserInfo,
  getUserData
} from './js/api';
import  { formatCookie,serializeParams } from './js/utils';
let COOKIE = null;
// courseList[] , currentCourse{}
let userData = null;

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

// 登录
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
      getUserData(serializeParams(COOKIE,';')).then(res=>{
        userData = res;
        mainWindow.webContents.send('user-data', JSON.stringify(res));
      }).catch(err=>{
        console.log('-------------index.js 73  ERROR -----------------');
        console.log(err);
      })
    }else{
      throw '登陆失败';
    }    
  }).catch(err=>{
    // 获取信息失败 登录失败信息
    console.log('index.js',err);   
    mainWindow.webContents.send('login-err', err.message || err.descrption || err);
  });
});
// 更改窗体大小
ipcMain.on('resize', (e, arg) => {
  let size = JSON.parse(arg);
  mainWindow.setSize(size.width,size.height);
  mainWindow.center();
});
// 更新学习状态
ipcMain.on('update-learn', (e, arg) => {
  let size = JSON.parse(arg);
  mainWindow.setSize(size.width,size.height);
  mainWindow.center();
});