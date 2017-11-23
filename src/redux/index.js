import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { browserHistory } from 'react-router'
import { createLogger } from 'redux-logger'
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux'
// 引入createEpicMiddleware
import { createEpicMiddleware } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax'
import {  } from './domain';

