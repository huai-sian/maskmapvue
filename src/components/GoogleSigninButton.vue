<template>
  <div>
    <div id="google-sign-in-button"></div>
    <!-- <div id="g_id_onload"
         data-client_id="282789078464-1efvjomt8lteont9btgp60gjo65mvebt.apps.googleusercontent.com"
         data-login_uri="https://huai-sian.github.io/maskmapvue/"
         data-auto_prompt="false">
    </div>
    <div class="g_id_signin"
        id="g_id_signin">
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'GoogleSignInButton',
  props: {
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    }
  },
  mounted() {
    // window.google.accounts.id.renderButton('g_id_signin', {
    //   type: 'standard',
    //   size: 'large',
    //   theme: 'outline',
    //   text: 'Sign in with',
    //   shape: 'rectangular',
    //   logo_alignment: 'left',
    //   callback: this.signIn,
    // });
    window.gapi.signin2.render('google-sign-in-button', {
      scope: 'profile email',
      width: '80',
      height: '35',
      longtitle: true,
      theme: 'light',
      onsuccess: this.signIn,
      onfailure: () => {}
    });
  },
  methods: {
    signIn(googleUser) {
      console.log("Encoded JWT ID token: " + googleUser);
      const id_token = googleUser.getAuthResponse().id_token;
      const profile = googleUser.getBasicProfile();
      const name = profile.getName();
      console.log('Name', googleUser.getBasicProfile().getName())
      this.$emit('sign-in', {googleUser, id_token, name });

    }
  }
};
// https://accounts.google.com/o/oauth2/auth?redirect_uri=storagerelay%3A%2F%2Fhttps%2Fhuai-sian.github.io%3Fid%3Dauth891137&response_type=permission%20id_token&scope=email%20profile%20openid&openid.realm=&include_granted_scopes=true&client_id=282789078464-1efvjomt8lteont9btgp60gjo65mvebt.apps.googleusercontent.com&ss_domain=https%3A%2F%2Fhuai-sian.github.io&fetch_basic_profile=true&gsiwebsdk=2
</script>

