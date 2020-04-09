import {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} from 'electron'
import {
  login,
  getUserInfo,
  getUserCourse,
  getOptionalCoursesCategories,
  getOptionalCourseList,
  chooseCourse,
  courseDetail,
  getWillCourse
} from './js/api';
import {
  seekCourse,
  learnCourse
} from './js/seekCourse';
import {
  formatCookie,
  serializeParams,
  unSerializeObj
} from './js/utils';
let COOKIE = null;
// courseList[] , currentCourse{}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 750,
    useContentSize: true,
    width: 400,
    resizable:false
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
  }).then(() => {
    // 获取用户信息
    return getUserInfo(serializeParams(COOKIE, ';'));
  }).then(res => {
    if (res !== '0') {
      let userinfo = JSON.parse(res);
      let p = arg.split('&');
      userinfo.username = p[0].split('=')[1];
      userinfo.password = p[1].split('=')[1];
      mainWindow.webContents.send('login-wait', JSON.stringify(userinfo));
      // 登录成功后   首先检查是否有必修课, 如果有 自动选择
      getWillCourse(serializeParams(COOKIE, ';')).finally(() => {
        // 选完必修课后, 在跳转登录
        mainWindow.webContents.send('user-info');
      })
    } else {
      throw '登陆失败';
    }
  }).catch(err => {
    // 获取信息失败 登录失败信息
    console.log('index.js', err);
    mainWindow.webContents.send('login-err', err.message || err.descrption || err);
  });
});
// 更改窗体大小
ipcMain.on('resize', (e, arg) => {
  let size = JSON.parse(arg);
  mainWindow.setSize(size.width, size.height);
  mainWindow.center();
});
// 更新学习状态
ipcMain.on('update-learn', (e, arg) => {
  let size = JSON.parse(arg);
  mainWindow.setSize(size.width, size.height);
  mainWindow.center();
});

// 获取课程分类
ipcMain.on('get-category', (e) => {
  console.log('get-category')
  getOptionalCoursesCategories(serializeParams(COOKIE, ';')).then(res => {
    mainWindow.webContents.send('categories', JSON.stringify(res));
  }).catch(err => {
    console.log('getOptionalCoursesCategories ERROR', err);
  })
});
// 根据 subjectId unitId 获取课程列表
ipcMain.on('get-course-list', (e, arg) => {
  console.log('get-course-list');
  let {
    subjectId,
    unitId
  } = JSON.parse(arg);
  getOptionalCourseList(subjectId, unitId, serializeParams(COOKIE, ';')).then(courses => {
    mainWindow.webContents.send('categories-courses', JSON.stringify({
      subjectId,
      unitId,
      courses
    }));
  }).catch(err => {
    console.log('getOptionalCourseList ERROR', err);
  });
});

// 选课
ipcMain.on('choose-course', (e, arg) => {
  console.log('choose-course');
  let {
    subjectIndex,
    unitIndex,
    id
  } = JSON.parse(arg);
  chooseCourse(id, serializeParams(COOKIE, ';')).then(res => {
    mainWindow.webContents.send('choose-course-success', JSON.stringify({
      subjectIndex,
      unitIndex,
      id,
      courseId: res
    }));
  }).catch(err => {
    mainWindow.webContents.send('choose-course-fail', err.description || err.message || err);
  });
});

// 更新分数
function updateUserInfo() {  
  getUserInfo(serializeParams(COOKIE, ';')).then(res => {
    if (res !== '0') {
      mainWindow.webContents.send('update-user-info',res);
    }
  })
}

let learnTimer = null,
  learnInterval = 29000;

function intervalLearn(id) {
  if (learnTimer) clearInterval(learnTimer);
  learnTimer = setInterval(() => {
    try {
      seekCourse(serializeParams(COOKIE, ';'));
      courseDetail(id, serializeParams(COOKIE, ';')).then(percent => {
        console.log('readCourseProgress,--', percent);
        if (percent.indexOf('100') !== -1) {
          mainWindow.webContents.send('learn-course-finish');
          clearInterval(learnTimer);
          setTimeout(() => {
            updateUserInfo();
          }, 2000);
        } else {
          mainWindow.webContents.send('learn-course-progress', percent);
        }
      });
    } catch (e) {
      console.log(e);
      clearInterval(learnTimer);
      mainWindow.webContents.send('learn-course-fail', e);
    }
  }, learnInterval);
}

// 上课
ipcMain.on('learn-course', (e, id) => {
  console.log(`learn-course:${id}`);
  learnCourse(id, serializeParams(COOKIE, ';')).then(courseId => {
    intervalLearn(courseId);
  }).catch(e => {
    console.log('index.js ---- 165 ERROR', e)
  });
});

ipcMain.on('stop-learn-course', (e) => {
  if (learnTimer) clearInterval(learnTimer);
});

// 个人课程
ipcMain.on('get-my-course', (e, type) => {
  console.log('get-my-course');
  getUserCourse(type, serializeParams(COOKIE, ';')).then(res => {
    mainWindow.webContents.send('user-courses', JSON.stringify({
      type,
      courses: res
    }));
  }, err => {
    mainWindow.webContents.send('user-courses-error', type);
  })
});

// 退出
ipcMain.on('logout', (e) => {
  COOKIE = null;
  clearInterval(learnTimer);
});