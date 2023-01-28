<template>
  <div class="register">

    <p class="title">注册界面</p>
    <div class="form">
      <div class="link-group">
        <span @click="toForgetPassword">忘记密码？</span>
        <span @click="toLogin">前往登录</span>
      </div>
      <span class="form-item-header">账号</span>
      <input class="my-input" v-model="registerForm.account" type="text" placeholder="账号" />
      <span class="form-item-header">密码</span>
      <input class="my-input" v-model="registerForm.password" type="password" placeholder="密码" />
      <div class="btn-group">
        <button @click="register" type="button" class="submit-btn">注册</button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { registerReq } from './api'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router';

const router = useRouter()
const uStore = userStore()

const registerForm = reactive({
  account: "1234",
  password: "1234"
})

const register = () => {
  registerReq(registerForm).then(res => {
    let data = res.data;
    router.push("/login")
  })
}

const toLogin = () => {
  router.push("/login")
}

const toForgetPassword = () => {
  router.push("/forget-pass")
}

</script>
<style lang='less' scoped>
.register {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-image: url("./wallhaven-e7z5qo.png");
  background-repeat: no-repeat;
  background-size: cover;


  .title {
    font-size: 42px;
    font-weight: 600;
    margin-bottom: 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    border: 1px solid whitesmoke;
    padding: 60px;
    border-radius: 12%;
    background-color: whitesmoke;

    .link-group {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1em;

      span {
        cursor: pointer;
        color: black;
      }

      span:hover {

        color: goldenrod;
      }
    }

    .form-item-header {}

    .my-input {
      background-color: whitesmoke;
      width: 13em;
      height: 48px;
      border: none;
      border-bottom: 2px solid silver;
      outline: none;
      font-size: 22px;
    }

    .my-input:hover {
      border-bottom: 2px solid skyblue;
    }

    .btn-group {
      margin-top: 1em;
      display: flex;
      justify-content: space-around;

      .submit-btn {
        width: 10em;
        height: 3em;
        border: 1px solid gray;
        border-radius: 5%;
        cursor: pointer;
        background-color: white;
      }

      .submit-btn:hover {
        background-color: goldenrod;
      }
    }


  }


}
</style>
