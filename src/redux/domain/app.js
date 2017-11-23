import {push} from 'react-router-redux'
import {Observable} from 'rxjs/Rx'
import {message} from 'antd'
// import { ajax } from 'rxjs/observable/dom/ajax'
import {keyMirror, arrayToTree} from '../../utils/index'
import * as services from '../../services/app'
import {arrayMenu} from '../../menu'

const actionTypes = keyMirror({
    CHANGE_THEME: null,
    TOGGLE_SLIDER: null,
    LOGOUT: null,
    SHOW_LOADING: null,
    HIDE_LOADING: null,
    SWITCH_LOADING_STATUS: null,
    LOAD_FINISH: null,
    INIT_LOAD: null,
});

const doLogout = () => ({
    type: actionTypes.LOGOUT,
})

const toLogin = () => (dispatch) => {
    return dispatch(push('/login'))
}

const querySuccess = ({payload}) => ({
    type: actionTypes.LOAD_FINISH,
    payload,
})

export default {
    actionTypes,
    state: {
        menus: [],
        menuTrees: [],
        siderVisible: localStorage.getItem('app_sider_visible') !== '0',
        siderFold: localStorage.getItem('app_sider_fold') === '1',
        theme: localStorage.getItem('app_theme_name') || 'light', //'light' or 'dark'
        user: {},
        news: [1, 2, 3, 4].map(i => ({id: i, content: `测试${i}`})),
        loading: false,
    },
    subscription: {
        setup({dispatch, history}, {toggleSider}) {
            const resize = () => {
                const siderFold = document.body.clientWidth < 992
                const siderVisible = document.body.clientWidth > 768
                dispatch(toggleSider({payload: {siderFold, siderVisible}}))
            }

            document.body.clientWidth < 769 && resize()

            let tid;
            window.onresize = () => {
                clearTimeout(tid);
                tid = setTimeout(resize(), 300) //事件节流
            }
        },
    },
    actions: {
        querySuccess,

        toLogin,

        changeTheme: () => ({type: actionTypes.CHANGE_THEME}),

        toggleSider: ({payload}) => ({ type: actionTypes.TOGGLE_SLIDER, payload }),

        switchLoading: ({ payload }) => {
            if (payload && payload.status !== null) {
                return {type: payload.status ? actionTypes.SHOW_LOADING : actionTypes.HIDE_LOADING }
            }

            return { type: actionTypes.SWITCH_LOADING_STATUS }
        },

        initLoad: () => ({ type: actionTypes.INIT_LOAD }),

        logout: () => dispatch => {
            localStorage.removeItem('user-info');
            doLogout();
            return dispatch(push('/login'))
        },

        loadMenus: () => ({ type: actionTypes.CHANGE_THEME }),

        },
    reducers: {
        [actionTypes.CHANGE_THEME]: (state) => {
          const theme = state.theme === 'dark' ? 'light' : 'dark';
          localStorage.setItem('app_theme_name', theme);
          return {
              ...state,
              theme,
          }
        },

        [actionTypes.TOGGLE_SLIDER]: (state, { payload }) => {
          let siderFold = !state.siderFold;
          let siderVisible = state.siderVisible
          if (payload && payload.siderFold !== 'undefined') {
              siderFold = payload.siderFold
          }

          if (payload && payload.siderVisible !== 'undefined') {
              siderVisible = payload.siderVisible
          }

          localStorage.setItem('app_sider_visible', siderVisible ? '1' : '0')
          localStorage.setItem('app_sider_fold', siderFold ? '1' : '0')

          return {
              ...state,
              siderVisible,
              siderFold,
          }
        },

        [actionTypes.LOGOUT]: (state) => {
            return {
                ...state,
                user: {},
            }
        },

        [actionTypes.SHOW_LOADING]: (state) => {
            return {
                ...state,
                loading: true,
            }
        },

        [actionTypes.HIDE_LOADING]: (state) => {
            return {
                ...state,
                loading: false,
            }
        },

        [actionTypes.SWITCH_LOADING_STATUS]: (state) => {
            return {
                ...state,
                loading: !state.loading,
            }
        },

        [actionTypes.LOAD_FINISH]: (state, { payload }) => {
            return {
                ...state,
                ...payload,
            }
        },
    },
    epics: {
        appInitLoad: (action$, store, { ajax }) => action$.ofType(actionTypes.INIT_LOAD)
            .switchMap(() => Observable.of(services.fetchUser())) //Observable.of(func)
            .switchMap(user => {
                if (!user) {
                    return Observable.of(toLogin())
                }

                return services.fetchMenus(user)
                    .map(rsp => ({ payload: { user, menus: rsp.response } }))
                    .map(querySuccess)
                    .catch(error => {
                        message.error(`load menus throw exception: ${error.message}`)
                        return Observable.of(querySuccess({ payload: {user, menus: arrayMenu} }))
                    })
            })
    },
}

