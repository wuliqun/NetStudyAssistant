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
    ...mapState('study', ['userInfo','currentCourse','learning','userData']),
  },
  methods:{
    ...mapMutations('study', ['setUserInfo','setCurrentCourse','stopLearn','setUserData']),
  }
});
export default new Vuex.Store({
  modules: {
    study
  }  
});
