import {appConfig} from '../config'

export const post = async (path, body) => {
    const response = await fetch(path, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('idToken')
        },
        body: JSON.stringify(body)
    })

    try {
        const json = await response.json();
        return json;
    }catch(err) {
        return 'Error with parse, who knows..'
    }
}

export const httpPut = async (path, body) => {
    const response = await fetch(path, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('idToken')
        },
        body: JSON.stringify(body)
    })

    try {
        const json = await response.json();
        return json;
    }catch(err) {
        return '401'
    }
}

export const del = async (path, body) => {
    const response = await fetch(path, {
        method: 'DELETE',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('idToken')
        },
        body: JSON.stringify(body)
    })

    try {
        const json = await response.json();
        return json;
    }catch(err) {
        return '401'
    }
}

export const get = async (path, token) => {
    const response = await fetch(path, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : sessionStorage.getItem('idToken')
        }
    })

    try {
        const json = await response.json();
        return json;
    }catch(err) {
        return '401'
    }
}
