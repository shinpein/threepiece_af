<template>
    <section>
        <h1>ログイン状態</h1>
        <p>{{ isLogin }}</p>
        <button @click="login()">ログイン</button>
        <button @click="logout()">ログアウト</button>
    </section>
</template>

<script>
export default {
    computed: {
        isLogin() {
            return this.$store.state.isLogin
        }
    },
    methods: {
        login() {
            this.$store.commit("login");
        },
        logout() {
            this.$store.commit("logout");
        },
    }
}
</script>