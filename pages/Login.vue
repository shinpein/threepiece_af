<template>
    <div class="container-fluid">
      <div class="form-wrapper">
        <h1>BODY CUSTOM</h1>
        <form @submit.prevent="login">
          <p class="error" v-if="error">{{ error }}</p>
          <div class="form-item">
            <label for="login_id"></label>
            <input type="text" name="login_id" v-model="login_id" required="required" placeholder="ログインID"></input>
          </div>
          <div class="form-item">
            <label for="login_pass"></label>
            <input type="password" name="login_pass" v-model="login_pass" required="required" placeholder="パスワード"></input>
          </div>
          <div class="button-panel">
            <input type="submit" class="button" title="サインイン" value="サインイン"></input>
          </div>
        </form>
        <div class="form-footer">
          <p></p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  layout: 'blank',
  data() {
    return {
      login_id: "",
      login_pass: "",
      error: ""
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("login", {
          login_id: this.login_id,
          login_pass: this.login_pass
        })
        this.$router.push('/')
      } catch(e) {
        this.error = e.message
      }
    }
  }
}
</script>


<style lang="scss" scoped>
/* Fonts */
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400);

/* fontawesome */
@import url(http://weloveiconfonts.com/api/?family=fontawesome);
[class*="fontawesome-"]:before {
  font-family: 'FontAwesome', sans-serif;
}

/* Simple Reset */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* body */
body {
  background: #e9e9e9;
  color: #5e5e5e;
  font: 400 87.5%/1.5em 'Open Sans', sans-serif;
}

/* Form Layout */
.form-wrapper {
  background: #fafafa;
  margin: 3em auto;
  padding: 0 1em;
  max-width: 370px;
}

h1 {
  text-align: center;
  padding: 1em 0;
  font-size: 24px;
  font-weight: bold;
}

form {
  padding: 0 1.5em;
}

.form-item {
  margin-bottom: 0.75em;
  width: 100%;
  & input {
    background: #fafafa;
    border: none;
    border-bottom: 2px solid #e9e9e9;
    color: #666;
    font-family: 'Open Sans', sans-serif;
    font-size: 1em;
    height: 50px;
    transition: border-color 0.3s;
    width: 100%;
    &:focus {
      border-bottom: 2px solid #c0c0c0;
      outline: none;
    }
  }
}

.button-panel {
  margin: 2em 0 0;
  width: 100%;
  & .button {
    background: #f16272;
    border: none;
    color: #fff;
    cursor: pointer;
    height: 50px;
    font-family: 'Open Sans', sans-serif;
    font-size: 1.2em;
    letter-spacing: 0.05em;
    text-align: center;
    text-transform: uppercase;
    transition: background 0.3s ease-in-out;
    width: 100%;
  }
}

.button:hover {
  background: #ee3e52;
}

.form-footer {
  font-size: 1em;
  padding: 2em 0;
  text-align: center;
  & a {
    color: #8c8c8c;
    text-decoration: none;
    transition: border-color 0.3s;
    &:hover {
      border-bottom: 1px dotted #8c8c8c;
    }
  }
}

.error {
  color: #f00;
  font-weight: bold;
}
</style>
