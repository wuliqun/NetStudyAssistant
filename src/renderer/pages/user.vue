<template>
  <div class="user">
    <div class="header">
      <div class="logo">
        <img src="../img/logo.png" alt />
        <p class="txt">Electron TEST</p>
      </div>
      <ul class="menu">
        <router-link v-for="nav in navs" :key="nav.id" :to="{name:nav.routerName}" class="menu-item">{{ nav.name }}</router-link>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data(){
    return {
      navs:[
        {
          id:0,
          name:'首页',
          routerName:'index'
        },
        {
          id:1,
          name:'我的课程',
          routerName:'course'
        },
        {
          id:2,
          name:'选课',
          routerName:'selectCourse'
        }
      ]
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  height: 90px;
  padding-right: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #053173;
  background-color: #2b579a;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
}
.logo {
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.logo img {
  width: 55px;
  height: 55px;
}
.logo .txt {
  margin-left: 15px;
  font-size: 30px;
  color: #fff;
  font-weight: 700;
}

.menu {
  display: flex;
  line-height: 88px;
  font-size: 20px;  
  font-weight: 700;
}
.menu-item {
  cursor: pointer;
  margin: 0 5px;
  padding: 0 20px;
  color: #fff;
  text-decoration: none;
}
.menu-item.router-link-active,
.menu-item:hover {
  background-color: #124078;
}
</style>