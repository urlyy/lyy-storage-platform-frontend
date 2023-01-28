<template>
  <router-view class="main" />
</template>

<script setup>
// import Dashboard from './views/dashboard/Dashboard.vue'
// components: { Dashboard }

</script>

<style lang="less">
#app {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 auto !important;
}

.main {
  /* main 高度填充flex剩余高 */
  flex: 1;
}

a {
  text-decoration: none;
}

// #my-footer{
//   position: fixed;
//   bottom: 0;
//   width:100%;
// }
.overflow-hide-one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.in-two-line {
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical;
  /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2;
  /** 显示的行数 **/
  overflow: hidden;
  /** 隐藏超出的内容 **/
}
</style>
