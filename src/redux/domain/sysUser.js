import fetch from 'isomorphic-fetch'
import { Observable } from 'rxjs/Rx'
import { ajax } from 'rxjs/observable/dom/ajax'
import {keyMirror} from "../../utils/index";

import { userList } from '../../mock/user';

const actionTypes = keyMirror({
  LOAD: null,
  LOAD_FINISHED: null,
})

const requestPosts = path => {
  return {
    type: actionTypes.LOAD,
    path,
  }
}

const receivePosts = ({ payload }) => {
  return {
    type: actionTypes.LOAD_FINISHED,
    payload,
  }
}

const options = {
  mode: 'cors',
  'Content-Type': 'application/json',
}

export default {
  state: {
    list: [],
    pagination: {
      current: 1,
      total: 0,
      showTotal: total => `共有${total}条`,
      showSizeChanger: true,
      showQuickJumper: true,
    },
    initLoaded: false,
    loading: false,
  },

  actions: {
    queryList: ({ payload }) => dispatch => {
      let url = `http://127.0.0.1:3000/users?da=${JSON.stringify(payload)}`
      requestPosts(url)
      return fetch(url, options).then(res => {
        if (res.ok) {
          res.json().then(json => dispatch(receivePosts({ payload: { list: json.data } })))
        } else {
          console.error('status', res.status)
        }
      }).catch(err => {
        return dispatch(receivePosts({ payload: { list: userList } }))
      })
    },
  },

  reducers: {
    [actionTypes.LOAD_FINISHED]: (state, { payload }) => {
      return {
        ...state,
        ...payload,
        initLoaded: true,
      }
    },
  },

  subscription: {
    setup({ dispatch, history }, { queryList }) {
      return history.listen(location => {
        if (location.pathname === '/sys/user') {
          dispatch(queryList({}))
        }
      })
    }
  }

}