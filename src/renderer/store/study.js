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
    userData: {
      // optionalCourses: [{
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/zz1713011logo.png',
      //     courseName: '习近平治国理政思想与中国之路',
      //     time: 161,
      //     studyHours: 4,
      //     percent: '10.0%',
      //     courseId: '35212391',
      //     courseLinkId: '2468'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/tl1606051logo.png',
      //     courseName: '政务公开的新发展',
      //     time: 119,
      //     studyHours: 3.5,
      //     percent: '100.0%',
      //     courseId: '53351825',
      //     courseLinkId: '1851'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/201514301logo.png',
      //     courseName: '政府与市场',
      //     time: 150,
      //     studyHours: 3,
      //     percent: '100.0%',
      //     courseId: '53351828',
      //     courseLinkId: '1031'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/p21935021logo.png',
      //     courseName: '中国共产党的初建与初心',
      //     time: 84,
      //     studyHours: 2,
      //     percent: '100.0%',
      //     courseId: '65195612',
      //     courseLinkId: '4388'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/zm1955011logo.png',
      //     courseName: '《实践论》《矛盾论》导读',
      //     time: 120,
      //     studyHours: 3,
      //     percent: '100.0%',
      //     courseId: '65195617',
      //     courseLinkId: '4158'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/zm1955021logo.png',
      //     courseName: '《资本论》导读',
      //     time: 180,
      //     studyHours: 4.5,
      //     percent: '100.0%',
      //     courseId: '65195626',
      //     courseLinkId: '4159'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/zq1911101logo.png',
      //     courseName: '深入学习贯彻党的十九届四中全会精神',
      //     time: 30,
      //     studyHours: 3,
      //     percent: '100.0%',
      //     courseId: '65195667',
      //     courseLinkId: '4607'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/zx1951121logo.png',
      //     courseName: '习近平新时代中国特色社会主义思想概论',
      //     time: 78,
      //     studyHours: 2,
      //     percent: '100.0%',
      //     courseId: '65195893',
      //     courseLinkId: '4175'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/zz1940011logo.png',
      //     courseName: '中国特色社会主义理论与实践的历史逻辑',
      //     time: 88,
      //     studyHours: 2,
      //     percent: '100.0%',
      //     courseId: '65195926',
      //     courseLinkId: '4463'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/tl1901051logo.png',
      //     courseName: '习近平总书记全面依法治国新理念新思想新战略',
      //     time: 81,
      //     studyHours: 2,
      //     percent: '100.0%',
      //     courseId: '65195941',
      //     courseLinkId: '4176'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/a11964121logo.png',
      //     courseName: '开创“中国之治”新境界的宣言书——党的十九届四中全会《决定》解读（下）',
      //     time: 40,
      //     studyHours: 1,
      //     percent: '100.0%',
      //     courseId: '65196073',
      //     courseLinkId: '4691'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/a11964111logo.png',
      //     courseName: '开创“中国之治”新境界的宣言书——党的十九届四中全会《决定》解读（中）',
      //     time: 22,
      //     studyHours: 0.5,
      //     percent: '100.0%',
      //     courseId: '65196126',
      //     courseLinkId: '4690'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/a11964101logo.png',
      //     courseName: '开创“中国之治”新境界的宣言书——党的十九届四中全会《决定》解读（上）',
      //     time: 40,
      //     studyHours: 1,
      //     percent: '100.0%',
      //     courseId: '65196151',
      //     courseLinkId: '4689'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/p31939041logo.png',
      //     courseName: '从党章细节看成功密码（一）',
      //     time: 5,
      //     studyHours: 0.5,
      //     percent: '100.0%',
      //     courseId: '65381059',
      //     courseLinkId: '4731'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/p31938051logo.png',
      //     courseName: '党支部成立及调整或撤销的程序是什么？',
      //     time: 4,
      //     studyHours: 0.5,
      //     percent: '100.0%',
      //     courseId: '65381836',
      //     courseLinkId: '4733'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/mx1743041logo.png',
      //     courseName: '科学社会主义的经典著作',
      //     time: 5,
      //     studyHours: 0.5,
      //     percent: '100.0%',
      //     courseId: '65406885',
      //     courseLinkId: '2054'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/mi1628141logo.png',
      //     courseName: '“共同价值”与“普世价值”的区别',
      //     time: 6,
      //     studyHours: 0.5,
      //     percent: '100.0%',
      //     courseId: '65408186',
      //     courseLinkId: '1482'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/mi1628071logo.png',
      //     courseName: '普世价值”之争是严肃的政治斗争',
      //     time: 6,
      //     studyHours: 0.5,
      //     percent: '100.0%',
      //     courseId: '65409608',
      //     courseLinkId: '1475'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/p21936021logo.png',
      //     courseName: '习近平新时代中国特色社会主义思想正定探源',
      //     time: 76,
      //     studyHours: 1.5,
      //     percent: '100.0%',
      //     courseId: '65569332',
      //     courseLinkId: '4383'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/jx2001019logo.png',
      //     courseName: '老子的治国智慧（上）',
      //     time: 50,
      //     studyHours: 1.5,
      //     percent: '100.0%',
      //     courseId: '65586916',
      //     courseLinkId: '4826'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/zj1806025logo.png',
      //     courseName: '周公“制礼作乐”与当今的道德建设',
      //     time: 110,
      //     studyHours: 3,
      //     percent: '100.0%',
      //     courseId: '65601630',
      //     courseLinkId: '3113'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/tl1930321logo.png',
      //     courseName: '我国湖泊生态环境保护初步思考',
      //     time: 124,
      //     studyHours: 3,
      //     percent: '100.0%',
      //     courseId: '65662034',
      //     courseLinkId: '4084'
      //   },
      //   {
      //     img: 'http://www.jxgbwlxy.gov.cn:10088/course_image/tl1730091logo.png',
      //     courseName: '“水十条”与治水的国际经验',
      //     time: 128,
      //     studyHours: 3,
      //     percent: '100.0%',
      //     courseId: '65713604',
      //     courseLinkId: '2389'
      //   },
      // ]
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
    setUserData(state, data) {
      console.log('setUserData',data);
      state.userData = data;
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
      state.optionalCourses.push({
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
      let c = state.userData[attr].splice(index,1)[0];
      c.percent = '100.0%';
      state.completedCourses.unshift(c);
    }
  },
  actions: {}
};