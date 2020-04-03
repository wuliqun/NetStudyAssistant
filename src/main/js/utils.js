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

// 创建一个sco对象
function creatObj() {
	var scoObj = new Object();
	// 定义sco对象 get set方法
	// datas用于保存数据，当scoObj为sco时datas保存的是单片的sco
	// 当scoObj为单片的sco时，datas中保存的是参数集。
	scoObj.datas = new Array();
	scoObj.setParam = function(key, value) {
		var isAdd = false;
		for (var i = 0; i < scoObj.datas.length; i++)
			if (scoObj.datas[i][0] == key) {
				scoObj.datas[i][1] = value;
				isAdd = true;
			}
		if (!isAdd)
			scoObj.datas[scoObj.datas.length] = [ key, value ];
	}
	scoObj.getParam = function(key) {
		for (var i = 0; i < scoObj.datas.length; i++)
			if (scoObj.datas[i][0] == key)
				return scoObj.datas[i][1];
		return "";
	}
	scoObj.getData = function() {
		return scoObj.datas;
	}
	scoObj.setData = function(data) {
		scoObj.datas = data;
	}
	return scoObj;
}

// 反序列化一个sco对象,
// 如非必要请不要尝试阅读这段奇葩，我自己都头疼。。。
function unSerializeObj(str) {
	var jsonCourse = {};
	if (str != "" && str != null) {
		var scos = str.split("┛");
		// 还原sco数据（包含param）
		var scoObj = creatObj();
		for (var i = 0; i < scos.length; i++) {
			var sco = scos[i];
			if (sco != "") {
				var jsonSCO = {};
				var scoTemp = sco.split("━");
				jsonCourse[scoTemp[0]] = jsonSCO;
				var scoValue = scoTemp[1];
				var scoParams = scoValue.split("┗");
				for (var j = 0; j < scoParams.length; j++) {
					var param = scoParams[j];
					if (param != "") {
						var paramTemp = param.split("┃");
						jsonSCO[paramTemp[0]] = paramTemp[1];
					}
				}
			}
		}
		return jsonCourse;
	}
}
export  {
  toast,
  formatCookie,
  serializeParams,
  unSerializeObj
}