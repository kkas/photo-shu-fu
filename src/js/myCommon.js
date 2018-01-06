const Console = {
  log: function logToConsole(...args) {
    console.log(args);
  },
  error: function logErrorToConsole(...args) {
    console.error(args);
  },
};

const concatStrings = function concatenateStrings(...args) {
  return args.join('');
};

export { Console, concatStrings };
