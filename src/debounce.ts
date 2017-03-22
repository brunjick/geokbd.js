export function debounce(fn: Function, wait: number): Function {
  let timeout: number;

  return function () {
    const context = this;
    const args = arguments;

    const later = function() {
        fn.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
