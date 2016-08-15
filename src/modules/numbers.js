module.exports.isEven = num => {
  const parsedNum = parseInt(num, 10);

  if (!Number.isFinite(parsedNum)) {
    return false;
  }

  return parsedNum % 2 === 0;
};
