export default {
  validateFormEntries(obj) {
    return !Object.keys(obj).some(key => obj[key] === '');
  },

  isTagEqual(string, stringCompare) {
    return string.toLowerCase() === stringCompare.toLowerCase();
  },
};
