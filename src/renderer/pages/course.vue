<template>
  <div class="course">
    <div class="tabs">
      <a
        href="javascript:void(0);"
        :class="`tab${tabIndex === 0 ? ' active' :''}`"
        @click="tab(0)"
      >必修课</a>
      <a
        href="javascript:void(0);"
        :class="`tab${tabIndex === 1 ? ' active' :''}`"
        @click="tab(1)"
      >选修课</a>
      <a
        href="javascript:void(0);"
        :class="`tab${tabIndex === 2 ? ' active' :''}`"
        @click="tab(2)"
      >已完成</a>
    </div>
    <div class="course-list">
      <div class="course-item" v-for="(item,index) in list" :key="index">
        <div class="img">
          <img :src="item.img" alt />
        </div>
        <div class="info">
          <p class="name f-thide">{{ item.courseName }}</p>
          <div class="time">
            <p>{{ item.time }}分钟</p>
            <p>{{ item.studyHours }}学时</p>
          </div>
          <div class="percent">
            <p class="label">学习进度:</p>
            <div class="progress">
              <div class="inner" :style="{width:item.percent}">{{ item.percent }}</div>
            </div>
          </div>
        </div>
        <a href="javascript:void(0);" class="learn-btn" @click="startLearn(index)">开始学习</a>
      </div>
      <div class="empty" v-if="courses.fetched && list.length === 0">当前没有{{ ['必修','选修','已完成'][tabIndex] }}课程</div>
      <div class="loading" v-if="!courses.fetched">
        <i class="icon"></i>
        加载中...
      </div>
    </div>
    <div class="pagination" v-show="totalPage > 1">
      <a href="javascript:void(0);" class="page" @click="jumpPage(0)">首页</a>
      <a href="javascript:void(0);" class="page" @click="prevPage">上一页</a>
      <a href="javascript:void(0);" class="page" @click="nextPage">下一页</a>
    </div>
  </div>
</template>
<script>
const { ipcRenderer } = require("electron");
export default {
  data() {
    return {
      tabIndex: 0, // 默认必修课
      pageIndex: 0,
      pageSize: 5
    };
  },
  methods: {
    tab(index) {
      if (index === this.tabIndex) return; // 就是当前
      this.pageIndex = 0;
      this.tabIndex = index;
    },
    prevPage() {
      if (this.pageIndex === 0) {
        this.$toast("已是首页 ~~");
        return;
      }
      this.jumpPage(this.pageIndex - 1);
    },
    nextPage() {
      if (this.pageIndex >= this.totalPage - 1) {
        this.$toast("已是末页 ~~");
        return;
      }
      this.jumpPage(this.pageIndex + 1);
    },
    jumpPage(index) {
      this.pageIndex = index;
    },
    startLearn(index) {
      if(this.learning){
        return ;
      }
      let course = this.list[index];
      this.setCurrentCourse(course);
    }
  },
  computed: {
    courses(){
      try{
        return this[['forcedCourses','optionalCourses','completedCourses'][this.tabIndex]];
      }catch(e){
        return {fetched:false};
      }
    },
    completedTotal() {
      return (
        this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0 &&
        this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0
      );
    },
    completedMust() {
      return this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0;
    },
    totalPage() {
      return Math.ceil(this.courses.courses.length / this.pageSize);
    },
    list() {
      return this.courses.courses.slice(
        this.pageIndex * this.pageSize,
        this.pageIndex * this.pageSize + this.pageSize
      );
    }
  },
  watch: {
    courses:{
      handler(val){
        if(!val.fetched){
          ipcRenderer.send('get-my-course',['forcedCourses','optionalCourses','completedCourses'][this.tabIndex]);
        }
      },
      immediate:true
    }
  }
};
</script>
<style lang="scss" scoped>
.course {
  padding-left: 10px;
  .title {
    margin-top: 10px;
    font-size: 24px;
    color: #333;
    font-weight: 700;
  }
  .tabs {
    display: flex;
    height: 36px;
    align-items: center;
    margin-top: 15px;
  }
  .empty {
    text-align: center;
    line-height: 300px;
    font-size: 20px;
    font-weight: 700;
    color: #ff5c38;
  }
  .tab {
    padding: 0 20px;
    line-height: 40px;
    text-decoration: none;
    color: #333;
    font-size: 18px;
    font-weight: 700;
    &.active,
    &:hover {
      color: #ff5c38;
      background-color: #f8f8f8;
    }
    &.disabled {
      cursor: not-allowed;
      color: #ccc;
      background-color: transparent;
    }
  }
  .course-list{
    height:398px;
  }
  .course-item {
    position: relative;
    display: flex;
    margin: 8px 0;
    .img {
      width: 100px;
      height: 70px;
      margin-right: 15px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        transition: all 0.5s;
        cursor: pointer;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
    .info {
      flex: 1;
      margin-right: 30px;
      color: #333;
      .name {
        width:540px;
        color: #000;
        font-size: 18px;
        font-weight: 700;
        line-height: 30px;
      }
      .time {
        display: flex;
        font-size: 15px;
        p {
          margin-right: 20px;
        }
      }
      .percent {
        display: flex;
        height: 20px;
        align-items: center;
        .label {
          font-size: 15px;
        }
        .progress {
          flex: 1;
          margin-left: 10px;
          height: 18px;
          background-color: #ccc;
          border-radius: 8px;
        }
        .inner {
          height: 18px;
          line-height: 18px;
          text-indent: 8px;
          background-color: #88f2a1;
          border-radius: 8px;
        }
      }
    }
    .learn-btn {
      position: absolute;
      top: 5px;
      right: 50px;
      font-size: 15px;
      line-height: 32px;
      padding: 0 15px;
      background-color: #2062b9;
      color: #fff;
      border-radius: 15px;
      text-decoration: none;
    }
  }
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 150px 0 100px;
  .page {
    width: 120px;
    line-height: 30px;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    color: #764c1c;
    text-decoration: none;
  }
}
</style>