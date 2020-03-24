<template>
  <div>
    <el-button @click="signOut">退出</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component 
export default class Home extends Vue {
  // 退出登录
  private signOut () {
    sessionStorage.clear()
    this.$router.push('/login')
  }
}
</script>
