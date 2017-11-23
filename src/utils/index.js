export default createReducer = (initialState, handlerMap) => (state = initialState, action) => {
    const handler = (action && action.type) ? handlerMap[action.type] : undefined
    return handler ? handler(state, action) : state
}

export const keyMirror = (obj) => {
    let key;
    let mirrored = {};
    if (obj && typeof obj === 'object') {
        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                mirrored[key] = key
            }
        }
    }

    return mirrored
}

export const deepClone = (obj) => {
    let proto = Object.getPrototypeOf(obj);
    return Object.assign({}, Object.create(proto), obj)
}

// 数组 => 树形结构
export const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
    let data = array.map(item => ({...item}))
    let result = []
    let hash = {}

    data.forEach((item, index) => {
        hash[data[index][id]] = data[index]  //hash[id] = data && data有可能为undefined，{id: '101', xxx}
    })

    data.forEach(item => {
        let hashVP = hash[item[pid]]
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = [])
            hashVP[children].push(item)
        } else {
            result.push(item) //估计不应该有hashVP为undefined的情况
        }
    })

    return result
}

export const queryArray = (array, key, keyAlias = 'key') => {
    if (!!array && array instanceof Array) {
        return array.find(it => it[keyAlias] === key)
    }

    return null
}