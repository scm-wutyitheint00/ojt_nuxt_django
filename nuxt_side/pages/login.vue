<template>
  <div>
    <h1>Login Form</h1>
    <v-container>
      <v-layout align-center justify-center>
        <v-flex sm7>
          <v-form v-model="isFormValid">
            <v-text-field v-model="loginInfo.email" label="Enter your e-mail address" counter
              :rules="[required('email'), emailFormat()]"></v-text-field>
            <v-text-field v-model="loginInfo.password" label="Enter your password"
              :rules="[required('password'), minLenght('password', 8)]" :append-icon="
              loginInfo.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="loginInfo.showPassword ? 'text' : 'password'"
              @click:append="loginInfo.showPassword = !loginInfo.showPassword"></v-text-field>
            <p class="red--text" v-if="!loginInfo.valid">Invalid Email and Password!</p>
            <v-btn style="margin : 30px" :disabled="!isFormValid" name="submit-btn" @click="loginUser(loginInfo)">Login
            </v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import validations from '@/utils/validations'
export default {
  data() {
    return {
      loginInfo: {
        email: '',
        password: '',
        valid: true,
        showPassword: false,
      },
      loginData: {
        logintime: '',
        token: ''
      },
      isFormValid: false,
      ...validations
    }
  },
  methods: {
    async isAdmin(mailData) {
      await this.$axios
        .$get(`/users?email=${mailData}`)
        .then((response) => {
          localStorage.setItem('responseData', JSON.stringify(response[0]));
          if (response && response[0].type === "1") {
            this.$store.commit('SET_MEMBER', false);
            localStorage.setItem("isMember", false);
          } else {
            this.$store.commit('SET_MEMBER', true);
            localStorage.setItem("isMember", true);
          }
        })
      this.$router.push('/post');
    },
    async loginUser(userData) {
      try {
        await this.$auth.loginWith('local', {
          data: userData,
        }).then(data => {
          localStorage.setItem('loginEmail', userData.email);
          localStorage.setItem("lastOperationDate", new Date().toString());
        });
        await this.isAdmin(userData.email);
      } catch (error) {
        this.loginInfo.valid = false;
      }
    },
  }
}
</script>

