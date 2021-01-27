<template>
  <div class="wrapper ">
    <div class="sidebar" data-color="purple" data-background-color="white">
      <div class="logo">
        <a href="http://www.creative-tim.com" class="simple-text logo-normal">
          メニュー
        </a>
      </div>
      <div class="sidebar-wrapper">
        <ul class="nav">
          <li class="nav-item active  ">
            <a class="nav-link" href="#0">
              <i class="material-icons">dashboard</i>
              <p>総合情報</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="main-panel">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
        <div class="container-fluid">
          <div class="navbar-wrapper">
            {{ $store.state.affiliate.affiliate_name }}様
          </div>
          <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
            <span class="sr-only">Toggle navigation</span>
            <span class="navbar-toggler-icon icon-bar"></span>
            <span class="navbar-toggler-icon icon-bar"></span>
            <span class="navbar-toggler-icon icon-bar"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="javascript:void(0);" @click="logout">
                  <i class="material-icons">exit_to_app</i> ログアウト
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="content">
          <Nuxt />
      </div>
      <footer class="footer">
        <div class="container-fluid">
          <nav class="float-left">
            <ul>
              <li></li>
            </ul>
          </nav>
          <div class="copyright float-right">
            &copy; Proceed, Inc.
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rec: []
    }
  },
  methods: {
    async getData() {
      this.$axios.$get("https://shopping.body-custom.net/api/getAffiliate.php", {
        params: {
          argument_id: this.$store.state.affiliate.argument_id,
        }
      }).then(data => { this.rec = data })
    },
    async logout() {
        await this.$store.dispatch("logout")
        this.$router.push('/login')
    },
  },
  mounted() {
    this.getData()
  },
  middleware: "auth"
}
</script>

<style>

</style>
