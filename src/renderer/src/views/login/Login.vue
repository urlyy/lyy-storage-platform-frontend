<template>
  <div class="login">

    <p class="title">登录界面</p>
    <div class="form">
      <div class="link-group">

        <span @click="toForgetPassword">忘记密码？</span>

        <span @click="toRegister">注册账号</span>
      </div>
      <span class="form-item-header">账号</span>
      <input class="my-input" v-model="loginForm.account" type="text" placeholder="账号" />
      <span class="form-item-header">密码</span>
      <input class="my-input" v-model="loginForm.password" type="password" placeholder="密码" />
      <div class="btn-group">
        <button @click="login" type="button" class="submit-btn">登录</button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { loginReq } from './api'
import { userStore } from '@/store/user'
import { bucketStore } from '@/store/bucket'
import { useRouter } from 'vue-router';

const router = useRouter()
const uStore = userStore()
const bStore = bucketStore()

const loginForm = reactive({
  account: "1234",
  password: "1234"
})

const login = () => {
  loginReq(loginForm).then(res => {
    let data = res.data;
    let user = {
      "id": data.id,
      "account": data.account,
      "token": data.token,
      "bucketId": data.bucket_id
    }
    uStore.setUser(user)
    bStore.setId(data.bucket_id)
    bStore.setUserId(data.id)
    bStore.setName(data.bucket_name)
    router.push("/objects")
  })
}

const toRegister = () => {
  router.push("/register")
}

const toForgetPassword = () => {
  router.push("/forget-pass")
}

</script>
<style lang='less' scoped>
.login {
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
