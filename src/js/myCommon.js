const Console = {
  log: function logToConsole(...args) {
    console.log(args);
  },
};

const concatStrings = function concatenateStrings(...args) {
  return args.join('');
};

export { Console, concatStrings };
