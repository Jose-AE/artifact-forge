const test = [
  { group: "a", num: 2 },
  { group: "c", num: 3 },
  { group: "c", num: 2 },
  { group: "a", num: 3 },
  { group: "a", num: 1 },
  { group: "b", num: 1 },
  { group: "c", num: 1 },
  { group: "b", num: 2 },
];

test.sort((a, b) => {
  if (a.group < b.group) return -1;
  if (a.group > b.group) return 1;
  if (a.num < b.num) return -1;
  if (a.num > b.num) return 1;
  return 0;
});

console.log(test);
