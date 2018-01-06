const Console = {
  log: (...args) => {
    console.log(args);
  },
  error: (...args) => {
    console.error(args);
  },
};

const concatStrings = (...args) => args.join('');

export { Console, concatStrings };
