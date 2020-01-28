import {appConfig} from '../config'

export const post = async (path, body) => {
    const response = await fetch(appConfig.API_SERVER + path, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
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
    const response = await fetch(appConfig.API_SERVER + path, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
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
    const response = await fetch(appConfig.API_SERVER + path, {
        method: 'DELETE',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
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

export const get = async (path) => {
    const response = await fetch(appConfig.API_SERVER + path, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
        }
    })

    try {
        const json = await response.json();
        return json;
    }catch(err) {
        return '401'
    }
}
