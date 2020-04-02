<template>
  <div class="user-index">
    <div class="user-info">
      <div class="name">{{ userInfo.realname }}</div>
      <div class="line">
        <p class="label">当前学年:</p>
        <p class="txt">{{ userInfo.year }}</p>
      </div>
      <div class="line">
        <p class="label">要求学时:</p>
        <p class="txt">{{ userInfo.yqzxs }}</p>
      </div>
      <div class="line">
        <p class="label">完成学时:</p>
        <p class="txt" :class="{red:!completedTotal}">{{ userInfo.ywczxs }}</p>
      </div>
      <div class="line">
        <p class="label">要求必修学时:</p>
        <p class="txt">{{ userInfo.yqbxxs }}</p>
      </div>
      <div class="line">
        <p class="label">完成必修学时:</p>
        <p class="txt" :class="{red:!completedMust}">{{ userInfo.ywcbxxs }}</p>
      </div>
      <div class="btns">
        <a href="javascript:void(0);" class="btn">自动学习</a>
        <a href="javascript:void(0);" class="btn">一键选课</a>
      </div>
      <div class="tip" :class="{red:!completedTotal}">
        <i class="icon" :class="`icon-${completedTotal ? 'finish':'unfinish'}`"></i>
        <p>{{ completedTotal ? "任务达成 ~" : "革命尚未成功,同志仍需努力!" }}</p>
      </div>
    </div>
    <div class="right">
      <div v-if="learning">
        <div class="title">当前正在学习:</div>
        <div class="course">
          <div class="img"><img :src="currentCourse.img" alt=""></div>
          <div class="info">
            <p class="name">{{ currentCourse.courseName }}</p>
          </div>
        </div>
      </div>
      <div v-else class="list-content">
        <div class="title">选择课程开始学习吧 ~</div>
        <div class="tabs">
          <a href="javascript:void(0);" :class="`tab${tabIndex === 0 ? ' active' :''}${!hasForced ? ' disabled':''}`" @click="tab(0)">必修课</a>
          <a href="javascript:void(0);" :class="`tab${tabIndex === 1 ? ' active' :''}`" @click="tab(1)">选修课</a>
        </div>
        <div class="course-list">
          <div class="course-item" v-for="(item,index) in list" :key="index">
            <div class="img">
              <img :src="item.img" alt="">
            </div>
            <div class="info">
              <p class="name">{{ item.courseName }}</p>
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
            <a href="javascript:void(0);" class="learn-btn">开始学习</a>
          </div>
          <div class="empty" v-if="list.length === 0">当前没有已选择课程,可点击左边一键选课</div>
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
export default {
  data(){
    return {
      tabIndex:0, // 默认必修课
      pageIndex:0,
      pageSize:5
    }
  },
  methods:{
    tab(index){
      if(index === this.tabIndex) return ; // 就是当前
      if(index === 0 && !this.hasForced) return ; // 没有必修课
      this.tabIndex = index;
    },
    prevPage(){
      if(this.pageIndex === 0){
        this.$toast('已是首页 ~~');
        return ;
      }
      this.jumpPage(this.pageIndex - 1);
    },
    nextPage(){
      if(this.pageIndex >= this.totalPage - 1){
        this.$toast('已是末页 ~~');
        return ;
      }
      this.jumpPage(this.pageIndex + 1);
    },
    jumpPage(index){
      this.pageIndex = index;
    }
  },
  computed: {
    completedTotal() {
      return (
        this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0 &&
        this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0
      );
    },
    completedMust() {
      return this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0;
    },
    hasForced(){
      return this.userData.forcedCourses && this.userData.forcedCourses.length
    },
    totalPage(){
      try{
        let length = this.tabIndex === 0 ? this.userData.forcedCourses.length : this.userData.optionalCourses.length;
        return Math.ceil(length / this.pageSize);
      }catch(e){
        return 1;
      }
    },
    list(){
      try{
        let arr = this.tabIndex === 0 ? this.userData.forcedCourses : this.userData.optionalCourses;
        return arr.slice(this.pageIndex*this.pageSize,this.pageIndex*this.pageSize + this.pageSize);
      }catch(e){
        return [];
      }
    }
  },
  watch:{
    hasForced:{
      handler(val){
        if(!val){
          this.tabIndex = 1;
        }
      },
      immediate:true
    }
  }
};
</script>
<style lang="scss" scoped>
.user-index {
  display: flex;
  height: 100%;
}
.user-info {
  width: 300px;
  height: 100%;
  padding: 20px 10px;
  border-right: 2px solid #ccc;
  .name {
    margin-bottom: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    line-height: 40px;
    color: #333;
  }
  .line {
    display: flex;
    font-size: 16px;
    color: #666;
    font-weight: 700;
    line-height: 30px;
    .label {
      width: 120px;
      text-align: right;
      margin-right: 10px;
    }
    .txt {
      color: green;
      &.red {
        color: #ff0036;
      }
    }
  }

  .btns {
    margin-top: 80px;
  }
  .btn {
    display: block;
    width: 200px;
    line-height: 40px;
    margin: 30px auto 0;
    text-decoration: none;
    font-size: 20px;
    color: #fff;
    text-align: center;
    border-radius: 20px;
    background: linear-gradient(
      90deg,
      rgba(43, 87, 154, 0.7) 0%,
      rgba(18, 64, 120, 0.8) 100%
    );
    &:hover {
      box-shadow: 0px 0px 10px #999;
    }
  }
}
.tip{
  display: flex;
  justify-content: center;
  align-items: center;
  height:40px;
  margin-top: 40px;
  font-size: 18px;
  color:#43b51d;
  &.red{
    color:#f4ea2a;
  }
  .icon{
    width:25px;
    height:25px;
    margin-right: 5px;
    background-size: 100% 100%;
    &.icon-finish{
      background-image: url(../img/finish.png);
    }
    &.icon-unfinish{
      background-image: url(../img/unfinish.png);
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
    color: #764C1C; 
    text-decoration: none;
  }
}
.right{
  flex:1;
}
.list-content{
  padding-left: 10px;
  .title{
    margin-top:10px;
    font-size: 24px;
    color:#333;
    font-weight: 700;
  }
  .tabs{
    display: flex;
    height:36px;
    align-items: center;
    margin-top: 15px;
  }
  .tab{
    padding:0 20px;
    line-height: 40px;
    text-decoration: none;
    color:#333;
    font-size: 18px;
    font-weight: 700;
    &.active,&:hover{
      color:#ff5c38;
      background-color: #f8f8f8;
    }
    &.disabled{
      cursor:not-allowed;
      color:#ccc;
      background-color: transparent;
    }
  }
  .course-item{
    position: relative;
    display: flex;
    margin:8px 0;
    .img{
      width:100px;
      height:70px;
      margin-right: 15px;
      overflow: hidden;
      img{
        width:100%;
        height:100%;
        transition: all .5s;
        cursor: pointer;
        &:hover{
          transform: scale(1.2);          
        }
      }
    }
    .info{
      flex:1;
      margin-right: 30px;
      color:#333;
      .name{
        color:#000;
        font-size: 18px;
        font-weight: 700;
        line-height: 30px;
      }
      .time{
        display: flex;
        font-size: 15px;
        p{
          margin-right: 20px;
        }
      }
      .percent{
        display: flex;
        height:20px;
        align-items: center;
        .label{
          font-size: 15px;
        }
        .progress{
          flex:1;
          margin-left: 10px;
          height:18px;
          background-color: #ccc;
          border-radius: 8px;
        }
        .inner{
          height:18px;
          line-height: 18px;
          text-indent: 8px;
          background-color: #88f2a1;
          border-radius: 8px;
        }
      }
    }
    .learn-btn{
      position: absolute;
      top:5px;
      right:50px;
      font-size: 15px;
      line-height: 32px;
      padding:0 15px;
      background-color: #2062b9;
      color:#fff;
      border-radius: 15px;
      text-decoration: none;
    }
  }
}
</style>