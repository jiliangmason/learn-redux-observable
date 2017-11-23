import { combineEpics } from 'redux-observable'
import sysUser from './sysUser'
import login from './login'
import sysRole from './sysRole'
import app from './app'
import { createReducer } from '../../utils/index'

const domains = {
  app,
  sysUser,
  login,
  sysRole,
}

const subscriptionHolder = []
const reducersHolder = {}
const initState = {}
const epicsArray = []

for (const key in domains) {
  if (Object.prototype.hasOwnProperty.call(domains, key)) {
    const { state, reducers, actions, epics, subscriptions } = domains[key]
    reducers && (reducersHolder[key] = createReducer(state || {}, reducers)) //reducersHolder['app'] = (state = initialState, action) => { return [actionTypes.xxx](state, action) {...} }
    initState[key] = state
    subscriptions && subscriptionHolder.push({ subscriptions, actions })
    epics && Object.keys(epics).forEach(epicItem => epicsArray.push(epics[epicItem])) //epicsArray为每一个epics函数
  }
}

export default {
  subscriptionHolder,
  reducersHolder,
  initState,
  epics: combineEpics(...epicsArray),
}
