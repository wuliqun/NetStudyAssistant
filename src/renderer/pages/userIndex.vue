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
    <div class="right"></div>
  </div>
</template>
<script>
export default {
  computed: {
    completedTotal() {
      return (
        this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0 &&
        this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0
      );
    },
    completedMust() {
      return this.userInfo.ywcbxxs - this.userInfo.yqbxxs >= 0;
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
</style>