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
      this.setCategories(JSON.parse(categories));
    });
    ipcRenderer.on('categories-courses',(e,data)=>{
      this.setCategoriesCourses(JSON.parse(data));
    });
    ipcRenderer.on('choose-course-success',(e,data)=>{
      console.log('choose-course-success',JSON.parse(data));
      this.setChooseCourse(JSON.parse(data));
    });
    ipcRenderer.on('choose-course-fail',(e,data)=>{
      this.$toast(`选课失败 ~`);
    });
    //
    ipcRenderer.on('learn-course-progress',(e,percent)=>{
      console.log('learn-course-progress',percent);
      this.setCurrentCoursePercent(percent);
    });
    ipcRenderer.on('learn-course-fail',(e,data)=>{
      this.$toast(`学习失败,请重启应用再试 ~`);
    });
    ipcRenderer.on('learn-course-finish',(e)=>{
      // TODO: 学习完课程
      let forcedCourses = this.userData.forcedCourses || [];
      let optionalCourses = this.userData.optionalCourses || [];
      let index = -1,i,attr = 'forcedCourses';
      for(i = 0;i<forcedCourses.length;i++){
        if(forcedCourses[i].courseId === this.currentCourse.courseId){
          index = i;
          if(i!== 0){
            i = 0;
          }else if(forcedCourses.length > 1){
            i = 1;
          }else{
            i = -1;
          }
          break;
        }
      }
      if(index === -1){
        for(i = 0;i<optionalCourses.length;i++){
          if(optionalCourses[i].courseId === this.currentCourse.courseId){
              index = i;
              if(i!== 0){
              i = 0;
            }else if(optionalCourses.length > 1){
              i = 1;
            }else{
              i = -1;
            }
            break;
          }
        }
        attr = 'optionalCourses'
      }
      if(i === -1){
        let course = this.userData[attr][i];
        this.setCurrentCourse(course);
        setTimeout(() => {
          ipcRenderer.send('learn-course',course.courseId);
        }, 500);
      }
      if(index !== -1){
        this.finishCourse({attr,index});
      }
    });
  }
};
</script>

<style>
/* CSS */
</style>
