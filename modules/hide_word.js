module.exports = (word, percentage) => {
  const wordLength = word.length;
  const allocation = Math.floor(percentage * wordLength);
  const interval = wordLength / allocation;
  const random = Math.random();
  let char = word.split("");
  for (let i = 0; i < allocation; i++) {
    const sampleIndex = Math.ceil(random * interval + (i - 1) * interval);
    char[sampleIndex] = "_";
  }
  return ` *${char.join(" ")}* `;
};
