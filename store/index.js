export const state = () => ({
  isLogin: false,
  affiliate: null
})


export const mutations = {
  logout(state) {
    console.log('logout')
    state.isLogin = false
    state.affiliate = null;
  },
  login(state, affiliate) {
    console.log(affiliate)
    state.affiliate = affiliate;
    state.isLogin = true;
  }
}


export const actions = {
  async login({
    commit
  }, {
    login_id,
    login_pass
  }) {
    try {
      const data = await this.$axios.$get(`/api/getAffiliateLogin.php?login_id=${login_id}&login_pass=${login_pass}`);
      if (!data.argument_id) {
        throw new Error("ログインIDまたはパスワードが違います")
      }
      let affiliate = {
        affiliate_name: data.affiliate_name,
        argument_id: data.argument_id,
        charge_flg: data.charge_flg,
        login_id: login_id,
        login_pass: login_pass
      }
      commit("login", affiliate)
    } catch (e) {
      throw e
    }
  },

  async logout({
    commit
  }) {
    commit("logout")
  }
};
