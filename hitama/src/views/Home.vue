<template>
  <div class="view-wrapper home">
    <v-container class="red" fluid>
      <!-- <h1 v-if="$store.state.testmode">Offline</h1> -->
      <h2>Welcome to Hitama</h2>
      <h3>The Hierarchical TaskManager</h3>

      <div>
        <CustomButton
          :onclick="() => (showLogin = !showLogin)"
          tooltip="Login"
          icon="mdi-login-variant"
        ></CustomButton>
        <CustomButton
          :onclick="() => (showRegister = !showRegister)"
          tooltip="Register"
          icon="mdi-account-plus"
        ></CustomButton>
      </div>
    </v-container>

    <RegisterModal
      v-model="showRegister"
      :onSuccess="
        (data) => {
          showLogin = true;
          loginData = { name: data.name };
        }
      "
    />
    <LoginModal :defaultData="loginData" v-model="showLogin" />
  </div>
</template>

<script>
// @ is an alias to /src
import CustomButton from "../components/forms/CustomButton";
import RegisterModal from "../components/modals/RegisterModal";
import LoginModal from "../components/modals/LoginModal";
export default {
  name: "Home",
  components: {
    RegisterModal,
    LoginModal,
    CustomButton,
  },
  data() {
    return {
      showRegister: false,
      showLogin: false,
      loginData: undefined,
    };
  },
};
</script>
