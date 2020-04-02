<template>
  <div class="login">
    <div class="header">
      <p class="log-txt">登录</p>
      <div class="logo">
        <img src="../img/logo.png" alt />
      </div>
    </div>
    <form action="#" class="form" @submit.prevent="submit">
      <div class="line">
        <div class="label">账号:</div>
        <input type="text" class="input" name="username" v-model="username" />
      </div>
      <div class="line">
        <div class="label">密码:</div>
        <input type="password" class="input" name="password" v-model="password" />
      </div>
      <input type="submit" value="登录" class="sub" />
    </form>
    <div class="tip">测试软件,仅限内部交流使用</div>
    <div class="copy">&copy;Copyright None, 版权没有, 就说是你做的</div>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron');
export default {
  beforeRouteEnter (to, from, next) {
    ipcRenderer.send('resize',JSON.stringify({
      width:400,
      height:750
    }));
    if(from && from.path.indexOf('user') >= 0){
      ipcRenderer.send('logout');      
      next(vm=>{
        vm.stopLearn();
        vm.setUserInfo({});
        vm.setUserData({});
      });
      return ;
    }
    next();
  },
  data(){
    return{
      username:'362203197702021945',
      password:'Ww770202'
    }
  },
  created(){
    
  },
  methods:{
    submit(){
      const idReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      let username = this.username.trim(),
          password = this.password.trim();
      if(!idReg.test(username) || !password){
        this.$toast('账号或密码格式有误 ~~');
        return ;
      }
      ipcRenderer.send('login',`username=${username}&passwd=${password}`);      
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  height: 180px;
  border-radius: 0 0 200px 200px/0 0 60px 60px;
  /* background:linear-gradient(141deg,rgba(255,171,27,1) 0%,rgba(255,114,0,1) 100%); */
  background: linear-gradient(
    141deg,
    rgba(43, 87, 154, 0.7) 0%,
    rgba(18, 64, 120, 0.8) 100%
  );
}
.log-txt {
  font-size: 18px;
  color: #171717;
  font-weight: 700;
  line-height: 36px;
  text-indent: 5px;
}
.logo {
  position: absolute;
  overflow: hidden;
  top: 130px;
  left: 50%;
  transform: translateX(-50%);
  height: 80px;
  width: 80px;
  background-color: #333;
  border-radius: 15px;
}
.logo img {
  height: 60px;
  width: 60px;
  margin: 10px;
}

.form {
  margin-top: 100px;
}
.form .sub {
  display: block;
  margin: 50px auto 0;
  border: none;
  outline: none;
  width: 300px;
  height: 44px;
  /* background:linear-gradient(90deg,rgba(255,171,27,1) 0%,rgba(255,114,0,1) 100%); */
  background: linear-gradient(
    90deg,
    rgba(43, 87, 154, 0.7) 0%,
    rgba(18, 64, 120, 0.8) 100%
  );
  border-radius: 22px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  &:hover{
    box-shadow: 0px 0px 10px #999;
  }
}
.line {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin: 0 20px;
  font-size: 16px;
  line-height: 30px;
  border-bottom: 1px solid #ccc;
}
.line .label {
  color: #171717;
  font-weight: 700;
}
.line .input {
  width: 220px;
  text-indent: 10px;
  font-size: 18px;
  border: none;
  outline: none;
  height: 30px;
  background-color: transparent;
}

.tip {
  margin-top: 80px;
  text-align: center;
  color: #ea0000;
  font-size: 14px;
}
.copy {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #666;
  text-align: center;
}
</style>