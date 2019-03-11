import { OK, CREATED, UNPROCESSABLE_ENTITY } from '../util'
const state = {
    user: null,
    apiStatus: null,
    loginErrorMessages: null,
    registerErrorMessages: null
  }
  
  const getters = {
    check: state => !! state.user,
    username: state => state.user ? state.user.name : ''
  }
  
  const mutations = {
    setUser (state, user) {
      state.user = user
    },
    setLoginErrorMessages (state, messages) {
        state.loginErrorMessages = messages
        console.log('setLoginErrorMessages')
        console.log(state.loginErrorMessages)
    },
    setApiStatus (state, status) {
        state.apiStatus = status
    },
    setRegisterErrorMessages (state, messages) {
        state.registerErrorMessages = messages
    }
  }
  
  const actions = {
    async register (context, data) {
      const response = await axios.post('/api/register', data)
      context.commit('setUser', response.data)

      if (response.status === CREATED) {
        context.commit('setApiStatus', true)
        context.commit('setUser', response.data)
        return false
      }
  
      context.commit('setApiStatus', false)
      if (response.status === UNPROCESSABLE_ENTITY) {
        console.log('ffffffff')
        context.commit('setRegisterErrorMessages', response.data.errors)
      } else {
        context.commit('error/setCode', response.status, { root: true })
      }

    },
    async login (context, data) {
        context.commit('setApiStatus', null)
        const response = await axios.post('/api/login', data).catch(err => err.response || err)
      
        if (response.status === OK) {
          context.commit('setApiStatus', true)
          context.commit('setUser', response.data)
          return false
        }
      
        context.commit('setApiStatus', false)
        if (response.status === UNPROCESSABLE_ENTITY) {
            console.log('auth.js')
            console.log(response.status)
            console.log(response.data.errors)
            context.commit('setLoginErrorMessages', response.data.errors)
          } else {
            context.commit('error/setCode', response.status, { root: true })
        }
    },
    async logout (context) {
        context.commit('setApiStatus', null)
        const response = await axios.post('/api/logout')
    
        if (response.status === OK) {
         console.log('logout')
          context.commit('setApiStatus', true)
          context.commit('setUser', null)
          return false
        }
    
        context.commit('setApiStatus', false)
        context.commit('error/setCode', response.status, { root: true })
    },
    async currentUser (context) {
        context.commit('setApiStatus', null)
        const response = await axios.get('/api/user')
        const user = response.data || null
    
        if (response.status === OK) {
          context.commit('setApiStatus', true)
          context.commit('setUser', user)
          return false
        }
    
        context.commit('setApiStatus', false)
        context.commit('error/setCode', response.status, { root: true })
      }
  }
  export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }