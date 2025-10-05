export function generateFakeEEG() {
  return {
    alpha: Math.random(),
    beta: Math.random(),
  }
}

export function getMoodFromEEG(eeg: { alpha: number; beta: number }) {
  if (eeg.beta > 0.7) return "focus"
  if (eeg.alpha > 0.7) return "chill"
  return "energy"
}
