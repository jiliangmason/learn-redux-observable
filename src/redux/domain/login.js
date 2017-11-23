import fetch from 'isomorphic-fetch';
import { keyMirror } from '../../utils/index';
import { push } from 'react-router-redux';

const actionTypes = keyMirror({
    LOADING_SWITCH: null,
    LOAD_FINISH: null,
})

const options = {
    mode: 'cors',
    'Content-type': 'application/json',
}

const requestPosts = () => {
    return {
        type: actionTypes.LOADING_SWITCH,
    }
}

export default {
    actionTypes,

    state: {
        loading: false,
    },

    actions: {
        doLogin: ({ payload }) => dispatch => {
            let url = `http://127.0.0.1:3000/users?da=${JSON.stringify(payload)}`
            requestPosts()
            return fetch(url, options).then(response => {
                if (response.ok) {
                    localStorage.setItem('user-info', JSON.stringify(payload))
                    dispatch(push('/home'))
                }
                else {
                    localStorage.setItem('user-info', JSON.stringify(payload))
                    dispatch(push('/home'))
                }
            }).catch(err => {
                localStorage.setItem('user-info', JSON.stringify(payload))
                dispatch(push('/home'))
            })
        },
    },

    reducers: {
        [actionTypes.LOAD_FINISH]: (state, { payload }) => {
            return {
                ...state,
                ...payload,
                initLoaded: true,
            }
        },

        [actionTypes.LOADING_SWITCH]: (state) => {
            return {
                ...state,
                loading: !state.loading,
            }
        },
    }
}