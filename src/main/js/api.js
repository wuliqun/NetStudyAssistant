const request = require('request');
const baseUrl = 'http://www.jxgbwlxy.gov.cn';
const apiUrl = {
  LOGIN: '/portal/login_ajax.do',
  USERINFO: '/portal/checkIsLogin.do'
}

function login(arg) {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + apiUrl.LOGIN,
      method: "POST",
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        Host: 'www.jxgbwlxy.gov.cn',
        Origin: 'http://www.jxgbwlxy.gov.cn',
        'Content-Length': arg.length,
        Pragma: 'no-cache',
        Referer: 'http://www.jxgbwlxy.gov.cn/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: arg
    }, function (error, response, body) {
      if (!error && response.statusCode == 200 && /^\d+$/.test(body.trim())) {
        resolve(response);
      } else {
        reject(body || error || response.statusCode);
      }
    })
  });
}

function fetchHtml(url, cookie) {
  return new Promise((resolve, reject) => {
    request({
      url,
      method: "GET",
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Cookie: cookie,
        Host: 'www.jxgbwlxy.gov.cn',
        Pragma: 'no-cache',
        Referer: 'http://www.jxgbwlxy.gov.cn/',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error || response.statusCode);
      }
    })
  });
}

function getUserInfo(cookie) {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + apiUrl.USERINFO,
      method: "POST",
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Length': 0,
        Cookie: cookie,
        Host: 'www.jxgbwlxy.gov.cn',
        Origin: 'http://www.jxgbwlxy.gov.cn',
        Pragma: 'no-cache',
        Referer: 'http://www.jxgbwlxy.gov.cn/index.html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error || response.statusCode);
      }
    })
  });
}

export {
  login,
  fetchHtml,
  getUserInfo
}