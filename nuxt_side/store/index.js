export const state = () => ({
  posts: {},
  user: {}
})

export const mutations = ({
  ADD_POST(state, post) {
    state.posts = { title: post.title, description: post.description }
  },
  ADD_USER(state, user) {
    state.user = {
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      type: user.type,
      phone: user.phone,
      dob: user.dob,
      address: user.address,
      profile: user.profile
    }
  }
})

export const getters = {
  getPost(state) {
    return state.posts
  },
  getUser(state) {
    return state.user
  }
}