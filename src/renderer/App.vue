<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "net_study_assistant",
  // 监听统一放到APP.vue  防止监听不到
  created(){
    ipcRenderer.on('updated-learn',(e,data)=>{
      this.setCurrentCourse(data);
    });
    ipcRenderer.on('user-data',(e,data)=>{
      this.setUserData(JSON.parse(data));
    });
    ipcRenderer.on('login-err',(e,err)=>{
      this.$toast(err);
    });
    ipcRenderer.on('user-info',(e,userInfo)=>{
      this.setUserInfo(JSON.parse(userInfo));
      this.$router.replace({
        name:'index'
      })
    });
    ipcRenderer.on('categories',(e,categories)=>{
      console.log('categories',JSON.parse(categories));
      this.setCategories(JSON.parse(categories));
    });
    ipcRenderer.on('categories-courses',(e,data)=>{
      console.log('categories-courses',JSON.parse(data));
      this.setCategoriesCourses(JSON.parse(data));
    });
  }
};
</script>

<style>
/* CSS */
</style>
