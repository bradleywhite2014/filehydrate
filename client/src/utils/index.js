/**
 * Generate a random string using window.crypto
 * See https://auth0.com/docs/api-auth/tutorials/nonce
 * @param {number} length - the length of the string
 * @return {string} - the random string
 */
export const randomString = (length) => {
    const bytes = new Uint8Array(length);
    const random = window.crypto.getRandomValues(bytes);
    const result = [];
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
    random.forEach(function (c) {
      result.push(charset[c % charset.length]);
    });
    return result.join('');
  };

export const genMsgId = () => {
  return randomString(20);
}

export const convertMergeFieldsToFormFields = (mergeFields) => {
  if(mergeFields) {
    const temp = {}
    mergeFields.forEach((field) => {
      temp[field] = '';
    })
    return temp;
  } else {
    return {}
  }
  
}

export const convertGoogleFileResponseToAutocompleteFields = (files) => {
  if(files) {
    const newFileArray = []
    console.log(files)
    files.forEach((file) => {
      newFileArray.push({
        label: file.name,
        value: file.id
      });
    })
    newFileArray.sort(function(a,b) {
      var nameA=a.label.toLowerCase(), nameB=b.label.toLowerCase()
      if (nameA < nameB) //sort string ascending
          return -1 
      if (nameA > nameB)
          return 1
      return 0
    })
    return newFileArray;
  }else{
    return []
  }
  
}

export const parseTokenFromUrl = () => {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  const accessToken = getParameterByName('access_token');
  const idToken = getParameterByName('id_token');
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('idToken', idToken);

  return {
    accessToken,
    idToken
  }
}

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};