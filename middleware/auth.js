export default function ({
  redirect,
  store
}) {
  if (!store.state.isLogin) {
    return redirect('/login')
  }
}
