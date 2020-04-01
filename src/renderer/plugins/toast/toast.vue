<template>
  <transition v-if="showToast" name="fade">
    <div class="miz-toast" :style="computedStyle">
      <img :src="config.icon" v-show="config.icon" :style="imgStyle" class="icon" />
      {{ msg }}
    </div>
  </transition>
</template>
<script>
// toast 默认参数
const defaultConfig = {
  backgroundColor: "rgba(0,0,0,.8)", // 背景色
  position: "center", // 位置,值举例 'center' 'top' 'bottom' 'top:200' 'bottom:200px'
  fontSize: 32, // 字体大小
  icon: "", // 'success' 'error' 'warning' 或者 图片路径,默认'' 没有图标
  color: "#fff", // 字体颜色
  lineHeight: 2, // 文字行高
  horizontalPadding: 30, // 水平padding
  borderRadius: 10, // 圆角
  width: "auto", // 宽度
  duration: 2000 // 显示时间
};

export default {
  data() {
    return {
      showToast: false,
      msg: "",
      toastConfig: {}
    };
  },
  methods: {
    show(message, toastOptions = {}) {
      this.msg = message;
      this.showToast = true;
      this.toastConfig = toastOptions;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showToast = false;
      }, this.config.duration);
    }
  },
  computed: {
    positionStyle() {
      let pos = this.config.position;
      if (/^bottom|^top/i.test(pos)) {
        //顶 底
        let kv = pos.split(":");
        if (!kv[1]) {
          // 默认值
          kv[1] = (180 / 7.5).toFixed(4) + "vw;";
        } else {
          // 纯数字或者px结尾的px值需转换
          if (/^\d+$/.test(kv[1]) || /px$/i.test(kv[1])) {
            kv[1] = (parseInt(kv[1]) / 7.5).toFixed(4) + "vw;";
          }
        }
        return `${kv[0]}:${kv[1]}`;
      } else {
        return "top:50%;";
      }
    },
    fontStyle() {
      return `font-size:${(this.config.fontSize / 7.5).toFixed(4)}vw;color:${
        this.config.color
      };line-height:${this.config.lineHeight};`;
    },
    boxStyle() {
      return `width:${this.config.width};padding:0 ${(
        this.config.horizontalPadding / 7.5
      ).toFixed(4)}vw;border-radius:${(this.config.borderRadius / 7.5).toFixed(
        4
      )}vw;`;
    },
    bgStyle() {
      return `background-color:${this.config.backgroundColor};`;
    },
    imgStyle() {
      return `height:${((this.config.fontSize / 7.5) * 1.2).toFixed(4)}vw;`;
    },
    transformStyle() {
      // top | bottom 不为0 需要translateY
      if (/(^bottom|^top)\:0/i.test(this.config.position)) {
        return "transform:translateX(-50%);";
      } else {
        return "transform:translate(-50%,-50%);";
      }
    },
    computedStyle() {
      return (
        this.positionStyle +
        this.fontStyle +
        this.boxStyle +
        this.bgStyle +
        this.transformStyle
      );
    },
    config() {
      return Object.assign({}, defaultConfig, this.toastConfig);
    }
  }
};
</script>  
<style lang="scss" scoped>
.miz-toast {
  position: fixed;
  z-index: 9999;
  display: flex;
  align-items: center;
  left: 50%;
  box-sizing: border-box;  
  white-space: nowrap;
  .icon {
    height: 50%;
    margin-right: 20px;
  }
}
.fade-leave-active {
  transition: opacity .8s;
}
.fade-leave-to{
  opacity: 0;
}
</style>