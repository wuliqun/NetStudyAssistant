const toastConf = {};
// toast 方法
function toast(msg,duration=3000){
  if(!toastConf.ele){
    toastConf.ele = document.createElement('div');
    toastConf.ele.className = 'toast';
    toastConf.ele.style.display = 'none';
    document.body.appendChild(toastConf.ele);
  }
  clearTimeout(toastConf.timer);
  toastConf.ele.textContent = msg;
  toastConf.ele.style.display = 'block';
  toastConf.timer = setTimeout(() => {
    toastConf.ele.style.display = 'none';
  }, duration);
}

function formatCookie(arr){
  let res = {};
  arr.forEach(s=>{
    let index = s.indexOf(';');
    if(index !== -1){
      s = s.slice(0,index);
    }
    index = s.indexOf('=');
    res[s.slice(0,index)] = s.slice(index + 1);
  })
  return res;
}
function serializeParams(params,sep="&"){
  let res = '';
  Object.keys(params).forEach(key=>{
    res += `${key}=${params[key]}${sep}`
  });
  return res.slice(0,-1);
}
export  {
  toast,
  formatCookie,
  serializeParams
}