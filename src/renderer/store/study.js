export default {
  namespaced: true,
  state: {
    userInfo: {
      realname: '登录状态丢失,请重启',
      year: '2020',
      yqzxs: 100,
      ywczxs: 0,
      yqbxxs: 50,
      ywcbxxs: 0
    },
    forcedCourses:{
      fetched:false,
      courses:[]
    },
    optionalCourses:{
      fetched:false,
      courses:[]
    },
    completedCourses:{
      fetched:false,
      courses:[]
    },
    categories:[],
    learning: false,
    currentCourse: {}
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setCurrentCourse(state, data) {
      state.learning = true;
      state.currentCourse = data;
    },
    stopLearn(state) {
      state.learning = false;
    },
    setMyCourses(state, data) {
      let { type, courses } = data;
      state[type].fetched = true;
      state[type].courses = courses;
    },
    setCategories(state,categories){
      state.categories = categories;
    },
    setCategoriesCourses(state,data){
      console.log('setCategoriesCourses',data);
      let { subjectId,unitId,courses } = data;
      for(let i = 0;i<state.categories.length;i++){        
        if(state.categories[i].subjectId === subjectId){
          for(let j = 0;j<state.categories[i].units.length;j++){
            if(state.categories[i].units[j].unitId === unitId){
              state.categories[i].units[j].courses = courses;
              return ;
            }  
          }
        }
      }
    },
    setChooseCourse(state,data){
      let { subjectIndex,unitIndex,id,courseId } = data;
      let courses = state.categories[subjectIndex].units[unitIndex].courses;
      let course;
      for(let i = 0;i<courses.length;i++){
        if(courses[i].id == id){
          course = courses.splice(i,1)[0];
          break;
        }
      }
      state.optionalCourses.courses.push({
        img: `http://www.jxgbwlxy.gov.cn:10088/course_image/${course.cover_image}`,
        courseName: course.course_name,
        time: course.duration,
        studyHours: course.learning_hour,
        percent: '0.0%',
        courseId: courseId,
        courseLinkId: course.id
      })
    },
    setCurrentCoursePercent(state,percent){
      state.currentCourse.percent = percent;
    },
    finishCourse(state,data){
      let {attr,index} = data;
      let c = state[attr].splice(index,1)[0];
      c.percent = '100.0%';
      state.completedCourses.unshift(c);
    }
  },
  actions: {}
};