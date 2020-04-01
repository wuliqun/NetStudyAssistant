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
    ...mapState('study', ['userInfo']),
  },
  methods:{
    ...mapMutations('study', ['setUserInfo']),
  }
});
export default new Vuex.Store({
  modules: {
    study
  }  
});
