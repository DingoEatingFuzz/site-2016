export default function delegate(obj) {
  return function(options) {
    return options.fn(obj);
  };
};
