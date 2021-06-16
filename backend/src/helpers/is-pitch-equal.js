module.exports.isPitchesEqual = (received = [], target, isStrict = false) => {
  if (!isStrict) return target.every((pitch) => received.includes(pitch));

  const firstEntry = received.indexOf(target[0]);

  let isReversed = false;
  let current = received.slice(firstEntry + 1);
  for (let i = 1; i < target.length; i++) {
    const index = current.indexOf(target[i]);

    if (~index) {
      current = current.slice(index + 1);
      continue;
    } else {
      if (!isReversed) {
        isReversed = true;
        current = received.slice(0, firstEntry);
        i--;
        continue;
      } else return false;
    }
  }

  return true;
};
