import fetch from 'isomorphic-fetch'
import { Observable } from 'rxjs/Rx'
import { ajax } from 'rxjs/observable/dom/ajax'

export function fetchUser () {
    const data = localStorage.getItem('user-info');
    return (!!data && data !== 'undefined') ? JSON.parse(data) : null
}

export function fetchMenus ({ id }) {
    return ajax({
        url: `http://127.0.0.1:3000/menus?id=${id}`,
        method: 'GET',
        responseType: 'json',
    })
}