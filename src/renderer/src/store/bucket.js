import { defineStore } from 'pinia'
export const bucketStore = defineStore({
  id: 'bucket',
  state: () => {
    return {
      id: '',
      name: '',
      userId: ''
    }
  },
  getters: {},
  actions: {
    setId(id) {
      this.id = id
    },
    setName(name) {
      this.name = name
    },
    setUserId(id) {
      this.userId = id
    },
    removeBucket() {
      this.id = ''
      this.name = ''
      this.userId = ''
    }
  },
  persist: {
    enabled: true
  }
})
