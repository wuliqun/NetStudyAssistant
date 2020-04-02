import Vue from 'vue';
import Vuex from 'vuex';
import {
  mapState,
  mapMutations
} from 'vuex';
import study from './study';
Vue.use(Vuex);
Vue.mixin({
  computed:{
    ...mapState('study', ['userInfo','currentCourse','learning','userData','categories']),
  },
  methods:{
    ...mapMutations('study', ['setUserInfo','setCurrentCourse','stopLearn','setUserData','setCategories','setCategoriesCourses']),
  }
});
export default new Vuex.Store({
  modules: {
    study
  }  
});
