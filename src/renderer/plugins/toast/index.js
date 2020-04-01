import Toast from './toast';

let VueToast;
let currentToast;
// 配置弹窗样式
let configedToast = {
  success:{
    icon: require('./img/success.png')
  },
  warning:{
    backgroundColor: "#f4c1ca",
    position: "top:0",
    icon: require('./img/warning.png'),
    color: "#333",
    borderRadius: 0,
    width:'100%',
  },
  error:{
    backgroundColor:'#fff',
    icon: require('./img/error.png'),
    color: "#f00"
  }
}

function install(Vue, options = {}) {
  if (VueToast) return;
  VueToast = Vue.extend(Toast);

  // use时可配置弹窗样式
  if(options.configedToast){
    Object.assign(configedToast,options.configedToast);
  }
  Vue.prototype.$toast = function (message, toastOptions = {}) {
    if(!currentToast){
      currentToast = new VueToast(options);
      currentToast.$mount();
      document.body.appendChild(currentToast.$el);
    }
    // 传入的参数为字符串,取已配置的options
    if(typeof toastOptions === 'string'){
      toastOptions = configedToast[toastOptions] || {};
    }
    currentToast.show(message,toastOptions);
  }
}

export default {
  install
}