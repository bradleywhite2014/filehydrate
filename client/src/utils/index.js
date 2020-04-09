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

export const convertMergeFieldsToFormFields = (mergeFields) => {
  const temp = {}
  mergeFields.forEach((field) => {
    temp[field] = '';
  })
  return temp;
}

export const convertGoogleFileResponseToAutocompleteFields = (files) => {
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
}