import Emergency from '../models/Emergency.js'
import Responder from '../models/Responder.js'

export const getOverview = async (req, res) => {
  try {
    const totalEmergencies = await Emergency.countDocuments()
    const activeEmergencies = await Emergency.countDocuments({
      status: { $nin: ['RESOLVED', 'CANCELLED', 'REJECTED'] },
    })
    const resolvedEmergencies = await Emergency.countDocuments({ status: 'RESOLVED' })
    const pendingVerification = await Emergency.countDocuments({ status: 'PENDING_VERIFICATION' })
    const falseReports = await Emergency.countDocuments({ status: 'REJECTED' })
    const respondersOnline = await Responder.countDocuments({ isOnline: true })

    res.status(200).json({
      success: true,
      data: {
        totalEmergencies,
        activeEmergencies,
        resolvedEmergencies,
        pendingVerification,
        falseReports,
        respondersOnline,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getEmergencyStats = async (req, res) => {
  try {
    const byType = await Emergency.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ])

    const byPriority = await Emergency.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ])

    const byStatus = await Emergency.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const byDay = await Emergency.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.status(200).json({
      success: true,
      data: {
        byType,
        byPriority,
        byStatus,
        byDay,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getResponseTimes = async (req, res) => {
  try {
    const resolved = await Emergency.find({ status: 'RESOLVED', resolvedAt: { $exists: true } })

    const responseTimes = resolved.map((e) => {
      const created = new Date(e.createdAt)
      const resolvedAt = new Date(e.resolvedAt)
      return (resolvedAt - created) / 1000 / 60
    })

    const average = responseTimes.length ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0
    const fastest = responseTimes.length ? Math.min(...responseTimes) : 0
    const slowest = responseTimes.length ? Math.max(...responseTimes) : 0

    res.status(200).json({
      success: true,
      data: {
        averageResponseTime: average,
        fastestResponse: fastest,
        slowestResponse: slowest,
        totalResolved: resolved.length,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getHeatmapData = async (req, res) => {
  try {
    const data = await Emergency.aggregate([
      {
        $group: {
          _id: { $arrayElemAt: ['$location.coordinates', 0] },
          count: { $sum: 1 },
        },
      },
    ])

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
