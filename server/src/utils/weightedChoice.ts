interface Weights {
  [key: string]: number;
}
export function weightedChoice(weights: Weights): string {
  // Convert weights object into an array of [key, value] pairs
  const weightEntries = Object.entries(weights);

  // Generate a random number between 0 and 100 (inclusive)
  const randomWeight = Math.random() * 100;

  // Iterate through the weight entries and find the corresponding choice
  let currentWeight = 0;
  for (const [choice, weight] of weightEntries) {
    currentWeight += weight;
    if (randomWeight <= currentWeight) {
      return choice;
    }
  }
  return "NA";
}
