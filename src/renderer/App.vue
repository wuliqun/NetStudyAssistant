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
    ipcRenderer.on('user-courses',(e,data)=>{
      this.setMyCourses(JSON.parse(data));
    });
    ipcRenderer.on('user-courses-error',(e,type)=>{
      this.$toast(`获取${ type }课程失败 ~`);
    });
    ipcRenderer.on('login-err',(e,err)=>{
      this.$toast(err);
    });
    ipcRenderer.on('login-wait',(e,userInfo)=>{
      this.$toast('登录成功,等待跳转...');
      let user = JSON.parse(userInfo);
      this.setUserInfo(user);
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      let index = -1,i;
      for(i=0;i<users.length;i++){
        if(users[i].username === user.username){
          index = i;
          break;
        }
      }
      if(index !== -1){
        users.splice(index,1);
      }
      users.unshift(user);

      localStorage.setItem('users',JSON.stringify(users));
    });
    ipcRenderer.on('user-info',(e)=>{
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
    // 更新进度
    ipcRenderer.on('learn-course-progress',(e,percent)=>{
      console.log('learn-course-progress',percent);
      this.setCurrentCoursePercent(percent);
    });
    ipcRenderer.on('learn-course-fail',(e,data)=>{
      this.$toast(data || `学习失败,请重启应用再试 ~`);
    });
    // 学习完一节课  更新分数
    ipcRenderer.on('update-user-info',(e,data)=>{
      let userinfo = JSON.parse(data);
      console.log(userinfo);
      this.setUserInfo(Object.assign({},this.userInfo,userinfo));
    });
    // 学习完一节课
    ipcRenderer.on('learn-course-finish',(e)=>{
      console.log('learn-course-finish');
      let forcedCourses = this.forcedCourses.courses;
      let optionalCourses = this.optionalCourses.courses;
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
      console.log(`course type:${attr},course index:${index},next course index:${i}`);
      if(i !== -1){
        let course = this[attr].courses[i];
        this.setCurrentCourse(course);
        setTimeout(() => {
          ipcRenderer.send('learn-course',course.courseId);
          console.log(`continue learn send! id:${course.courseId}`);
        }, 500);
      }else{
        this.stopLearn();
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
