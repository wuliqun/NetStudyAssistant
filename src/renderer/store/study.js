export default {
  namespaced: true,
  state: {
    userInfo: {
      realname:'登录状态丢失,请重启',
      year:'2020',
      yqzxs:100,
      ywczxs:0,
      yqbxxs:50,
      ywcbxxs:0
    },
    learning:false,
    currentCourse:{}
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setCurrentCourse(state,data){
      state.learning = true;
      state.currentCourse = data;
    },
    stopLearn(state){
      state.learning = false;
    }
  },
  actions: {
  }
};
