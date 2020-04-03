<template>
  <div class="select">
    <div class="top-cate">
      <div
        class="cate"
        v-for="(cate,index) in cates"
        :key="cate.subjectId"
        :class="{active:index === currentIndex}"
        @click="chooseCate(index)"
      >
        <span
          v-for="i in Math.ceil(cate.subjectName.length / 2)"
          :key="i"
        >{{ cate.subjectName.slice(2*i-2,2*i) }}</span>
      </div>
    </div>
    <div class="content">
      <div class="side">
        <div
          class="unit f-thide"
          :class="{active:unitIndex === index}"
          v-for="(unit,index) in units"
          :key="index"
          :title="unit.unitName"
          @click="chooseUnit(index)"
        >{{ unit.unitName }}</div>
      </div>
      <div class="main">
        <div class="course-list">
        <div class="course-item" v-for="(item,index) in activeCourses" :key="index">
          <div class="img">
            <img :src="'http://www.jxgbwlxy.gov.cn:10088/course_image/' + item.cover_image" alt />
          </div>
          <div class="info">
            <p class="name f-thide">{{ item.course_name }}</p>
            <div class="time">
              <p>{{ item.duration }}分钟</p>
              <p>{{ item.learning_hour }}学时</p>
            </div>
          </div>
          <a href="javascript:void(0);" class="learn-btn" @click="chooseLesson(index)">选择课程</a>
        </div>
        <div class="loading" v-if="activeCourses.length === 0">
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
    </div>
  </div>
</template>
<script>
const { ipcRenderer } = require("electron");
export default {
  data() {
    return {
      currentIndex: 0, // 当前index
      unitIndex: 0,
      page: 0,
      pageSize: 5
    };
  },
  created() {
    if(!this.categories.length){
      ipcRenderer.send('get-category');
    }
  },
  methods: {
    chooseCate(index) {
      if (index === this.currentIndex) return;
      this.currentIndex = index;
      this.unitIndex = 0;
      this.page = 0;
    },
    chooseUnit(index) {
      if (index === this.unitIndex) return;
      this.unitIndex = index;
      this.page = 0;
    },
    // 当前分类课程列表  请求
    checkCourseList() {
      if (this.units[this.unitIndex].courses.length === 0) {
        ipcRenderer.send(
          "get-course-list",
          JSON.stringify({
            subjectId: this.cates[this.currentIndex].subjectId,
            unitId: this.units[this.unitIndex].unitId
          })
        );
      }
    },
    // 选课
    chooseLesson(index){
      let course = this.activeCourses[index];
      ipcRenderer.send('choose-course',JSON.stringify({
        id:course.id,
        subjectIndex:this.currentIndex,
        unitIndex:this.unitIndex
      }));
    },
    prevPage() {
      if (this.page === 0) {
        this.$toast("已是首页 ~~");
        return;
      }
      this.jumpPage(this.page - 1);
    },
    nextPage() {
      if (this.page >= this.totalPage - 1) {
        this.$toast("已是末页 ~~");
        return;
      }
      this.jumpPage(this.page + 1);
    },
    jumpPage(index) {
      this.page = index;
    },
  },
  computed: {
    cates() {
      return this.categories
    },
    units() {
      try{
        return this.cates[this.currentIndex].units;
      }catch(e){
        return [];
      }
    },
    courses() {
      try{
        return this.units[this.unitIndex].courses.filter(course=>{
          return course.usercourseid == 0
        });
      }catch(e){
        return [];
      }
    },
    activeCourses() {
      return this.courses.slice(
        this.page * this.pageSize,
        this.page * this.pageSize + this.pageSize
      );
    },
    totalPage() {
      return Math.ceil(this.courses.length / this.pageSize);
    }
  },
  watch: {
    currentIndex(val) {
      this.checkCourseList();
    },
    unitIndex(val){
      this.checkCourseList();
    },
    categories(val){
      this.checkCourseList();
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  position: absolute;
  top: 166px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
}
.top-cate {
  flex-shrink: 0;
  display: flex;
  border-bottom: 2px solid #409eff;
  .cate {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 76px;
    width: 76px;
    margin-right: 10px;
    font-size: 20px;
    color: #000;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
    &.active,
    &:hover {
      background-color: #12b7f5;
    }
  }
}
.side {
  height: 100%;
  width: 200px;
  overflow-y: auto;
  padding-top: 2px;
  overflow-y: auto;
  border-right: 2px solid #999;
  background-color: #d3dce6;
  .unit {
    line-height: 40px;
    font-size: 20px;
    color: #333;
    text-indent: 5px;
    cursor: pointer;
    &.active,
    &:hover {
      background-color: #b3c0d1;
    }
  }

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    background: #ededed;
  }
}
.main{
  flex:1;
  padding:10px 0 0 15px;
}
.course-list {
  height: 398px;
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
        width: 540px;
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