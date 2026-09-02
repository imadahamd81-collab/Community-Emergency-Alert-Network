export const calculateSuggestedPriority = (type, peopleAffected, aiSuggestion) => {
  let score = 0

  const typeScores = {
    FIRE: 4,
    MEDICAL: 4,
    GAS_LEAK: 3,
    ACCIDENT: 3,
    FLOOD: 3,
    MISSING_PERSON: 2,
    ROAD_BLOCKAGE: 1,
    OTHER: 1,
  }

  score += typeScores[type] || 1

  if (peopleAffected >= 10) score += 3
  else if (peopleAffected >= 5) score += 2
  else if (peopleAffected >= 2) score += 1

  if (aiSuggestion?.suggestedSeverity === 'HIGH') score += 2
  else if (aiSuggestion?.suggestedSeverity === 'MEDIUM') score += 1

  if (score >= 6) return 'CRITICAL'
  if (score >= 4) return 'HIGH'
  if (score >= 2) return 'MEDIUM'
  return 'LOW'
}
