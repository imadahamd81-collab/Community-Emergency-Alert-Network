export const analyzeEmergencyMedia = async (file) => {
  try {
    const mockResult = {
      suggestedCategory: 'ACCIDENT',
      suggestedSeverity: 'HIGH',
      confidence: 0.87,
    }

    return mockResult
  } catch (error) {
    console.error('AI analysis error:', error)
    return null
  }
}
