const arr = [
  {
    _id: "64544f972657def7c28544ef",
    locked: false,
    showcase: true,
    artifactData: {
      level: 20,
      set: "lavawalker",
      type: "CIRCLET",
      mainStat: { CR: 31.100000000000005 },
      subStats: { CD: 13.98, HP_P: 4.08, HP: 806.63, DEF: 64.81 },
    },
    voters: [],
    votes: 0,
    __v: 0,
  },
  {
    _id: "64544f972657def7c28544ef",
    locked: false,
    showcase: true,
    artifactData: {
      level: 20,
      set: "lavawalker",
      type: "CIRCLET",
      mainStat: { CR: 31.100000000000005 },
      subStats: { CD: 13.98, HP_P: 4.08, HP: 806.63, DEF: 64.81 },
    },
    voters: [],
    votes: 0,
    __v: 0,
  },
  {
    _id: "64544f972657def7c28544ef",
    locked: false,
    showcase: true,
    artifactData: {
      level: 20,
      set: "lavawalker",
      type: "CIRCLET",
      mainStat: { CR: 31.100000000000005 },
      subStats: { CD: 13.98, HP_P: 4.08, HP: 806.63, DEF: 64.81 },
    },
    voters: [],
    votes: 0,
    __v: 0,
  },
];

uniqueArr = arr.filter((obj, index, self) => {
  console.log(index);
  console.log(self.findIndex((t) => t._id === obj._id));

  return (
    index === self.findIndex((t) => t._id.toString() === obj._id.toString())
  );
});
