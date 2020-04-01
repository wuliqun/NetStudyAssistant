### 1.How to use
  ```javascript
  import MizToast from 'PLUGINS/mizToast';
  Vue.use(MizToast,{  
    configedToast:{
      /* 预定义弹窗样式 */
      success:{
        /* config here */
      }
    }
  });
  /**
   * vue实例上使用 
   * toastOptions String|Object
   *    -- String 预定义的弹窗样式,可以在use时配置,自带 'success' 'warning' 'error',样式需修改 
   *    -- 自定义弹窗样式,默认值为
   *        {
   *          backgroundColor: "rgba(0,0,0,.8)", // 背景色
   *          position: "center", // 位置,值举例 'center' 'top' 'bottom' 'top:200' 'bottom:200px'
   *          fontSize: 32, // 字体大小
   *          icon: "", // 'success' 'error' 'warning' 或者 图片路径,默认'' 没有图标
   *          color: "#fff", // 字体颜色
   *          lineHeight: 2, // 文字行高
   *           horizontalPadding: 30, // 水平padding
   *          borderRadius: 10, // 圆角
   *          width:'auto', // 宽度 
   *          duration: 2000 // 显示时间
   *        }
   */
  this.$toast(message[,toastOptions])
  ```


### 2.Examples
    ```javascript
    import MizToast from 'PLUGINS/mizToast';
    Vue.use(MizToast);
    // 默认样式
    this.$toast('message');
    // 使用预定义样式
    this.$toast('message','success');
    // 传样式参数
    this.$toast('message',{
      lineHeight:2.5,
      backgroundColor:'#fff',
      color:'#000',
      position:'top:200px'
    });

    // use 时可传入预定义弹窗样式
    Vue.use(MizToast,{
      configedToast:{
        custom1:{
          color:'#f00',
          icon:'error.png',          
          // ...
        },
        custom2:{
          color:'#f0f',
          icon:'xxx.png',
          fontSize:20          
          // ...
        }
      }
    });
    this.$toast('message','custom1');
    ```