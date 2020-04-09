import cheerio from 'cheerio';
import request from 'request';

import { serializeParams } from './utils';
import { fetchHtml } from './api';
const url = 'http://www.jxgbwlxy.gov.cn/portal/study_seek.do'

// vars
let params = null;
let referer = '';
let config = null;
function learnCourse(id, cookie) {
  console.log('API-- learnCourse', id);
  return fetchHtml(`http://www.jxgbwlxy.gov.cn/portal/study_play.do?id=${id}`, cookie, true).then(res => {
    let $ = cheerio.load(res);
    params = JSON.parse(decodeURIComponent($('#course_frm').attr('src')).split('=')[1]);
    referer = $('#course_frm').attr('src');
    console.log(params);
    getConfig(params, cookie);
    return $('body').attr('onbeforeunload').match(/(\d+)/)[1];
  }, err => {
    console.log('learn error------', err);
  });
}

function getConfig(param, cookie) {
  console.log('getConfig');
  let coursePath = param.folder ? param.folder + '/' : 'course/';
  // courseware_type 
  if (param.courseware_type == "0" || !param.courseware_type) {
    if (!param.courseware_url) {
      param.courseware_url = coursePath + param.course_no + "/index.htm";
    }
    let urls = param.courseware_url.split("\r\n");
    config = {
      scoId: 0,
      playUrl: urls[0]
    }
  } else if (param.courseware_type == "1") {
    request({
      url: 'http://www.jxgbwlxy.gov.cn:10088/' + coursePath + param.course_no + "/imsmanifest.xml",
      method: "GET"
    }, function (error, response, body) {
      console.log(body);
      let $ = cheerio.load(body);
      console.log($('resources resource').eq(0).attr('identifier'));
      config = {
        scoId:$('resources resource').eq(0).attr('identifier'),
        playUrl:coursePath + param.course_no + '/' + $('resources resource').eq(0).attr('href')
      }
    })
  } else if (param.courseware_type == "2"){

  }
}
// 保持学习进度 TODO:  unfinish
function seekCourse(cookie) {
  let serializeSco = params.serialize_sco;
  if(!serializeSco){
    if(typeof config.scoId !== 'undefined'){
      serializeSco = JSON.stringify({
        [config.scoId]:{}
      })
    }else{
      serializeSco = JSON.stringify({
        0:{}
      })
    }
  }
  let learnParams = {
    callback: 'showData',
    uuid: params.uuid,
    id: params.ucid,
    serializeSco: encodeURIComponent(serializeSco),
    duration: 30000,
    a: true,
    token: encodeURIComponent(params.token),
    uct_id: params.uct_id,
    _: Date.now()
  }
  return new Promise((resolve, reject) => {
    console.log(url + '?' + serializeParams(learnParams));
    request({
      url: url + '?' + serializeParams(learnParams),
      method: "GET",
      headers: {
        Accept: '*/*',
        Host: 'www.jxgbwlxy.gov.cn',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        Cookie: cookie,
        Referer: referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'
      },
      gzip: true
    }, function (error, response, body) {
      console.log('error,',error);
      console.log('response,',response.statusCode);
      console.log('body,',body);
      if(!error && response.statusCode === 200){
        resolve();
      }else{
        reject('学习失败,请更换课程尝试 ~');
      }  
    })
  })
}



export {
  seekCourse,
  learnCourse
}