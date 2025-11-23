<template>
  <div class="admin-login">
    <button @click="showLoginForm = !showLoginForm" class="login-btn"><LogIn class="icon" /></button>
    <div v-if="showLoginForm" class="login-form">
      <input type="password" v-model="loginPassword" placeholder="输入管理员密码" class="password-input">
      <button @click="handleAdminLogin" class="submit-login">登录</button>
    </div>
  </div>
</template>

<script>
import { LogIn } from '@vicons/ionicons5';
export default {
  components: {
    LogIn
  },
  emits: ['login-success'],
  data() {
    return {
      loginPassword: '',
      showLoginForm: false
    };
  },
  methods: {
    handleAdminLogin() {
      const success = this.$emit('login', this.loginPassword);
      if (success) {
        this.showLoginForm = false;
      }
    }
  }
};
</script>