import Vue from 'vue';
import Vuex from 'vuex';
import {
  mapState,
  mapMutations
} from 'vuex';
import study from './study';
Vue.use(Vuex);
Vue.mixin({
  computed: {
    ...mapState('study', ['userInfo', 'currentCourse', 'learning', 'forcedCourses','optionalCourses','completedCourses', 'categories']),
  },
  methods: {
    ...mapMutations('study', ['setUserInfo', 'setCurrentCourse',
       'stopLearn', 'setMyCourses', 'setCategories', 'setCategoriesCourses',
       'setCurrentCoursePercent', 'setChooseCourse','finishCourse']),
  }
});
export default new Vuex.Store({
  modules: {
    study
  }
});
