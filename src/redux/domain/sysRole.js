import fetch from 'isomorphic-fetch'
import { Observable } from 'rxjs/Rx'
import { ajax } from 'rxjs/observable/dom/ajax'
import {keyMirror} from "../../utils/index";

const actionTypes = keyMirror({
    FETCH_REQUEST: null,
    FETCH_RECEIVE: null,
})

const fetchReceive = res => {
    return {
        type: actionTypes.FETCH_RECEIVE,
        res,
    }
}

export default {
    actionTypes,

    state: {
        loading: false,
    },

    actions: {
        fetchRequest: () => {
            return {
                type: actionTypes.FETCH_REQUEST,
            }
        },

        fetchReceive,
    },

    reducers: {
        [actionTypes.FETCH_RECEIVE]: (state, { payload }) => {
            return {
              ...state,
              ...payload,
              loading: false,
            }
        },

       [actionTypes.FETCH_REQUEST]: (state) => {
            return {
              ...state,
              loading: !state.loading,
            }
       },
    },

    epics: {
        fetch: (action$) => {
            action$.ofType(actionTypes.FETCH_REQUEST)
              .switchMap(action => {
                console.log('fetch action', action)
                return ajax({
                  url: 'http://127.0.0.1:3000/users',
                  method: 'GET',
                  responseType: 'json',
                })
              }).map(res => {
                  return res.response;
            }).map(fetchReceive)
        },
    },

}