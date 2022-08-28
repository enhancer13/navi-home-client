export const ArrayUtils = {
  arraysEqual: (a, b, compare) => {
    if (a === b) {
      return true;
    }
    if (a == null || b == null) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }

    return a.every((x, index) => {
      return compare ? compare(x, b[index]) : x === b[index];
    });
  },
};
