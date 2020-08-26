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
  if(mergeFields && Array.isArray(mergeFields)) {
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
    //console.log(files)
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

const jsUcfirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const convertSnakeKeyToLabel = (key,prevKey) => {
  let pieces = key.split('_');
  pieces = pieces.map((piece) => {return jsUcfirst(piece);})
  return pieces.join(' ');
}


const flattenAndRemoveKeys = (jsonStruct) => {
  let temp = {}

  const recurseRemove = (jsonStruct) => {
    Object.keys(jsonStruct).forEach((key) => {
      if(Array.isArray(jsonStruct[key])){
        //if array
        temp[key] = jsonStruct[key]
        // jsonStruct[key].map((item) => {
        //   return recurseRemove(item);
        // })
      }
      else if(typeof jsonStruct[key] === 'object'){
        //we have a subjson, lets move these keys to the top level
        recurseRemove(jsonStruct[key])
      }else{
        //end of a json
        temp[key] = jsonStruct[key]
      }
    });
  }
  
  recurseRemove(jsonStruct)
  return temp;
}
//TODO: use this for the table creation. possibly upgrade table here too... ?
export const convertSnakedObjectToLabels = (snakedObj, prevKey) => {
  if(Array.isArray(snakedObj)){
    snakedObj.map((item) => {
      return convertSnakedObjectToLabels(item);
    });
  } else if(typeof snakedObj === "object"){
    Object.keys(snakedObj).forEach((key) => {
      if(snakedObj[key]){
        // array must come before obj, because an array is an obj in js
        if(Array.isArray(snakedObj[key])){
          //if we have a list or obj, keep going
          let tempVal = snakedObj[key];
          delete snakedObj[key];
          snakedObj[convertSnakeKeyToLabel(key)] = convertSnakedObjectToLabels(tempVal);
        }
        else if(typeof snakedObj[key] === "object"){
          //need to concat the json key names instead of setting it right away
          if(prevKey){
            convertSnakedObjectToLabels(snakedObj[key], prevKey + ' ' + convertSnakeKeyToLabel(key));
          }else{
            convertSnakedObjectToLabels(snakedObj[key], convertSnakeKeyToLabel(key));
          } 
        }else{
          if(prevKey){
            let tempVal = snakedObj[key];
            delete snakedObj[key];
            snakedObj[prevKey +' ' + convertSnakeKeyToLabel(key)] = tempVal;
          }else{
            let tempVal = snakedObj[key];
            delete snakedObj[key];
            snakedObj[convertSnakeKeyToLabel(key)] = tempVal;
          }
        }
      }else{
        delete snakedObj[key];
      }
      
    })
  }
  if(Array.isArray(snakedObj)){
    //need to loop
    return snakedObj.map((obj) => {
      return flattenAndRemoveKeys(obj);
    })
  }else{
    return flattenAndRemoveKeys(snakedObj);
  }
}


export const convertResultsToMappingFields = (results) => {
  if(results && Array.isArray(results)) {
    let firstResult = results[0]
    const temp = {}
    //TODO: FIX MAPPING FIELDS AND MODAL TABLE LIST - HAS A SUBARRAY?
    Object.keys(firstResult).forEach((field) => {
      if((Array.isArray(firstResult[field])) && typeof firstResult[field][0] === 'object'){
        Object.keys(firstResult[field][0]).forEach((subField) => {
          temp[field] = {
            open_tag: false,
            column_mapping: ''
          }
        })
      }else{
        temp[field] = {
          open_tag: false,
          column_mapping: ''
        }
      }
      
    })
    return temp;
  } else {
    return {}
  }
  
}

export const convertMappingFieldsToForm = (mappingFields) => {
  let temp = {}
  Object.keys(mappingFields).forEach((field) => {
    if(mappingFields[field].column_mapping){
      //if match, grab value for this row
      temp[mappingFields[field].column_mapping] = field
    }
  })
  return temp
}
