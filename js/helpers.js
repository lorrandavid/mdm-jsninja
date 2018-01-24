const Helpers = {
  isRequestSuccessful(request) {
    return request.readyState === 4 && request.status === 200;
  },

  isPropImg(string) {
    return string === 'image';
  },

  validateFormEntries(obj) {
    return !Object.keys(obj).some(key => obj[key] === '');
  },

  isTagEqual(string, stringCompare) {
    return string.toLowerCase() === stringCompare.toLowerCase();
  },
};

export default Helpers;
