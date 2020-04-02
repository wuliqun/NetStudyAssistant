const request = require('request');
const baseUrl = 'http://www.jxgbwlxy.gov.cn';
const apiUrl = {
  LOGIN: '/portal/login_ajax.do',
  USERINFO: '/portal/checkIsLogin.do',
  OPTIONALCOURSE: '/student/course_myselect.do',
  COMPLETEDCOURSE: '/student/course_complete.do',
  FORCEDCOURSE: '/student/course_will_select.do',
  COURSELIST: '/student/course_list.do',
  COURSECATE: '/student/course_category_index.do',
  COURSESELECT: '/student/course_select.do',
  COURSEDETAIL: '/portal/course_detail.do',
  COURSELEARN: '/portal/study_play.do',
  COURSESEEK: '/portal/study_seek.do'
}
import {
  serializeParams
} from './utils';
import cheerio from 'cheerio';

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

function fetchHtml(url, cookie, gzip = false) {
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
      },
      gzip
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        console.log(`fetch URL:${url} failed: `, error || response);
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
// 获取选修课分类 
// [
//   {
//     subjectId,
//     subjectName,
//     units:[
//       {
//         unitId,
//         unitName
//       },
//       ...
//     ]
//   },
//   ...
// ]
function getOptionalCoursesCategories(cookie) {
  return fetchHtml(`${baseUrl}${apiUrl.COURSECATE}?${serializeParams({ menu: 'mall', categoryId: 2 })}`, cookie, true).then(res => {
    // 二级分类下的类目ID
    let subjectIds = [];
    let $ = cheerio.load(res);
    $('.lc_course_lists .hoz_accordion .zt-list-item-title').each(function () {
      subjectIds.push($(this).attr('id').match(/(\d+)$/)[1]);
    });
    return subjectIds;
  }).then(subjectIds => {
    let promises = [];
    subjectIds.forEach(id => {
      promises.push(fetchHtml(`${baseUrl}${apiUrl.COURSECATE}?${serializeParams({ menu: 'mall', categoryId: 2, subjectId: id })}`, cookie, true).then(body => {
        return {
          id,
          body
        }
      }));
    });
    return Promise.all(promises);
  }).then(maps => {
    let category = [];
    maps.forEach(map => {
      let $ = cheerio.load(map.body);
      let obj = {
        subjectId: map.id,
        subjectName: $(`#second${map.id} a`).text().trim(),
        units: []
      }
      $('.zt-list-item-son .lc_special_list .zt-list-item-icon+a').each(function () {
        obj.units.push({
          unitId: $(this).attr('onclick').match(/showCourse\((\d+),/)[1],
          unitName: $(this).text().trim(),
          courses: []
        });
      });
      category.push(obj);
    });
    return category;
  }).catch(err => {
    console.log('---------getOptionalCoursesCategories--------', err);
    return [];
  });
}
// {
//   menu: mall
// subjectId: 3
// unitId: 39
// showStyle: hengpai
// courseYear: 
// }
// 
function getOptionalCourseList(subjectId, unitId, cookie) {
  let body = serializeParams({
    menu: 'mall',
    subjectId,
    unitId,
    searchType: 'hengpai',
    courseYear: ''
  });
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + apiUrl.COURSELIST,
      method: "POST",
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Length': body.length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Cookie: cookie,
        Host: 'www.jxgbwlxy.gov.cn',
        Origin: 'http://www.jxgbwlxy.gov.cn',
        Pragma: 'no-cache',
        Referer: `http://www.jxgbwlxy.gov.cn/student/course_category_index.do?menu=mall&categoryId=2&subjectId=${subjectId}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(JSON.parse(body).courseStr));
      } else {
        reject(error || response.statusCode);
      }
    })
  })
}
// 选课
function chooseCourse(id, cookie) {
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + apiUrl.COURSESELECT,
      method: "POST",
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Origin: 'http://www.jxgbwlxy.gov.cn',
        Referer: 'http://www.jxgbwlxy.gov.cn/student/course_category_index.do?menu=mall&categoryId=2',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: serializeParams({ courseId: id })
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error || response);
      }
    })
  });
}
// 个人的课程详情
function courseDetail(id, cookie) {
  return fetchHtml(`${baseUrl}${apiUrl.COURSEDETAIL}?${serializeParams({
    menu: 'mall',
    courseId: id
  })}`).then(res => {
    let $ = cheerio.load(res);
    return $('.cse_dtl_pro_percent').text();
  }).catch(e => {
    throw e;
  })
}
function getCourse(url, params, cookie) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: "POST",
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Length': serializeParams(params).length,
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookie,
        Host: 'www.jxgbwlxy.gov.cn',
        Origin: 'http://www.jxgbwlxy.gov.cn',
        Pragma: 'no-cache',
        Referer: 'http://www.jxgbwlxy.gov.cn/student/course_myselect.do',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
        'Upgrade-Insecure-Requests': 1
      },
      gzip: true,
      body: serializeParams(params)
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error || response);
      }
    })
  }).then(body => {
    let $ = cheerio.load(body);
    let courses = [];
    $('.hoz_course_list .hoz_course_row').each(function () {
      let img = $(this).find('.hoz_c_lf img').attr('src');
      let courseName = $(this).find('.hoz_course_name a').text();
      let time = parseInt($(this).find('.hoz_four_info span:first-child').text());
      let studyHours = parseFloat($(this).find('.hoz_four_info span:nth-child(2)').text());
      let percent = $(this).find('.h_pro_percent').text();
      let courseLinkId = $(this).find('.hoz_course_name a').attr('href').match(/(\d+)$/)[1];
      let courseId = $(this).find('.btn_group input').attr('onclick').match(/(\d+)\)$/)[1];
      courses.push({
        img,
        courseName,
        time,
        studyHours,
        percent,
        courseId,
        courseLinkId
      });
    });
    return courses;
  }).catch(err => {
    console.log('getUserCourse --- ERROR',err);
    return [];
  })
}
let optionalCourseParams = {
  pageType: '${type}',
  searchType: 2,
  menu: 'course',
  pageSize: 200,
  currentPage: 1
}
let completedCourseParams = {
  pageType: '${type}',
  searchType: 3,
  menu: 'course',
  pageSize: 200,
  currentPage: 1
}
let forcedCourseParams = {
  pageType: '${type}',
  searchType: 0,
  menu: 'course',
  pageSize: 200,
  currentPage: 1
}

// 三种类型的课程
function getUserData(cookie) {
  return Promise.all([
    getCourse(baseUrl + apiUrl.OPTIONALCOURSE, optionalCourseParams, cookie),
    getCourse(baseUrl + apiUrl.COMPLETEDCOURSE, completedCourseParams, cookie),
    getCourse(baseUrl + apiUrl.FORCEDCOURSE, forcedCourseParams, cookie)
  ]).then(res => {
    let [optionalCourses, completedCourses, forcedCourses] = res;
    return {
      optionalCourses,
      completedCourses,
      forcedCourses
    }
  });
}
let learnParams = {
  callback: 'showData',
  'uuid': '781177e7-eadb-4cf3-a23f-9efeb093e9f3',
  'id': 74143405,
  serializeSco: '{"0":{"cmi.core.exit":"logout","cmi.core.lesson_location":"356.0","cmi.core.session_time":"00:01:00","cmi.core.entry":"resume","last_learn_time":"2020-04-02 22:20:19"}}',
  duration: 30000,
  a: '提交',
  token: "hLQi24jbf2VeaPQ+N84TjYY5hl2XiSpg+0y7Nt+ph3Y='",
  uct_id: 6586138,
  _: 1585836799126
}
// callbackUrl: "http://www.jxgbwlxy.gov.cn/portal/study_seek.do"
// course_name: "《1844年经济学哲学手稿》导读"
// course_no: "zm1955041"
// courseware_type: "0"
// courseware_url: ""
// serialize_sco: "{"0":{"cmi.core.exit":"logout","cmi.core.lesson_location":"NaN.0","cmi.core.session_time":"00:00:00","cmi.core.entry":"resume"}}"
// token: "hLQi24jbf2VeaPQ+N84TjYY5hl2XiSpg+0y7Nt+ph3Y="
// ucid: "74143405"
// uct_id: "6586138"
// uuid: "a1c6e9d0-dbe2-4337-87be-1760b2f64dc0"

// 保持学习进度
function seekCourse(params, cookie) {
  let learnParams = {
    callback: 'showData',
    uuid: params.uuid,
    id: params.ucid,
    serializeSco: params.serializeSco || '{"0":{}}',
    duration: 30000,
    a: '提交',
    token: params.token,
    uct_id: params.uct_id,
    _: Date.now()
  }
  return new Promise((resolve, reject) => {
    request({
      url: baseUrl + apiUrl.COURSESEEK + '?' + encodeURIComponent(serializeParams(learnParams)),
      method: "GET",
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        Connection: 'keep-alive',
        Cookie: cookie,
        Host: 'www.jxgbwlxy.gov.cn',
        Referer: 'www.jxgbwlxy.gov.cn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'
      },
      gzip: true,
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('seekCourse---',body);
        resolve(body);
      } else {
        console.log('seekCourse---ERROR',error);
        reject(error || response);
      }
    })
  })
}
function learnCourse(id, cookie) {
  return fetchHtml(`${baseUrl}${apiUrl.COURSELEARN}?id=${id}`, cookie).then(res => {
    let $ = cheerio.load(res);
    let params = JSON.parse(decodeURIComponent($('#course_frm').attr('src')).split('=')[1]);
    return params;
  });
}

export {
  login,
  fetchHtml,
  getUserInfo,
  getUserData,
  getOptionalCoursesCategories,
  getOptionalCourseList,
  chooseCourse,
  courseDetail,
  learnCourse,
  seekCourse
}