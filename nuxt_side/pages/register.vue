<template>
  <div class="register-page">
    <h1>Registration Form</h1>
    <v-container>
      <v-layout align-center justify-center>
        <v-flex sm7>
          <v-form v-model="isFormValid" ref="form">
            <v-text-field v-model="name" label="Enter your name" counter :rules="[required('name')]"></v-text-field>
            <v-text-field v-model="userData.email" label="Enter your e-mail address" counter
              :rules="[required('email'), emailFormat()]"></v-text-field>
            <v-text-field v-model="userData.password" label="Enter your password"
              :rules="[required('password'), minLenght('password', 8)]" :append-icon="
                userData.showPassword ? 'mdi-eye' : 'mdi-eye-off'
              " :type="userData.showPassword ? 'text' : 'password'"
              @click:append="userData.showPassword = !userData.showPassword"></v-text-field>
            <v-select :items="items" label="User Type" v-model="userData.type" :rules="[required('user type')]">
            </v-select>
            <p class="red--text" v-if="!userData.valid">{{ userData.error }}</p>
            <v-btn style="margin : 30px" :disabled="!isFormValid" @click="signUp(userData)">
              Register
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
  data: () => ({
    userData: {
      email: '',
      password: '',
      password2: '',
      showPassword: false,
      showPassword2: false,
      valid: true,
      error: null,
      type: ''
    },
    name: '',
    items: ['Admin', 'User'],
    isFormValid: false,
    ...validations
  }),
  methods: {
    async createUser(userData) {
      userData.name = this.name;
      userData.type = userData.type === 'Admin' ? 1 : 2;
      userData.created_at = new Date().toISOString();
      userData.updated_at = new Date().toISOString();
      const config = {
        headers: { "content-type": "multipart/form-data" }
      };
      let formData = new FormData();
      for (let data in userData) {
        formData.append(data, userData[data]);
      }
      await this.$axios.$post(`/users/`, formData, config);
    },
    async signUp(registrationInfo) {
      registrationInfo =
        await this.$axios
          .$post('/customuser/', registrationInfo)
          .then(async (response) => {
            await this.$auth.loginWith('local', {
              data: registrationInfo,
            }).then(async () => {
              await this.createUser(registrationInfo);
              this.$router.push('/');
              this.$auth.logout();
            }
            )
          })
          .catch((error) => {
            if (error.response.data.email) {
              this.userData.valid = false;
              this.userData.error = error.response.data.email[0];
            }
          })
    },
  },
}
</script>