export default {
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
