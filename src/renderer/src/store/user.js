import { defineStore } from 'pinia'
export const userStore = defineStore({
  id: 'user',
  state: () => {
    return {
      account: '',
      token: '',
      bucketId: '',
      id: ''
    }
  },
  getters: {},
  actions: {
    setUser(user) {
      this.account = user.account
      this.token = user.token
      this.bucketId = user.bucketId
      this.id = user.id
    },
    removeUser() {
      this.account = ''
      this.token = ''
      this.bucketId = ''
      this.id = ''
    }
  },
  persist: {
    enabled: true
  }
})
