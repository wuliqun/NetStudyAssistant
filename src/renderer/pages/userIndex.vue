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
        <p
          class="label"
          :class="{red:Number(userInfo.ywcbxxs) >= Number(userInfo.yqbxxs) && Number(userInfo.ywczxs) >= Number(userInfo.yqzxs)}"
        >完成学时:</p>
        <p class="txt">{{ userInfo.ywczxs }}</p>
      </div>
      <div class="line">
        <p class="label">要求必修学时:</p>
        <p class="txt">{{ userInfo.yqbxxs }}</p>
      </div>
      <div class="line">
        <p class="label" :class="{red:Number(userInfo.ywcbxxs) >= Number(userInfo.yqbxxs)}">完成必修学时:</p>
        <p class="txt">{{ userInfo.ywcbxxs }}</p>
      </div>
      <div class="btns">
        <a href="javascript:void(0);" class="btn">自动学习</a>
        <a href="javascript:void(0);" class="btn">一键选课</a>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.user-index {
  display: flex;
  height: 608px;
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
    margin-top: 150px;
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
</style>