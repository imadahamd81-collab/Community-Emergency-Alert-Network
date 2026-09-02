import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.join(__dirname, '..', '..', 'uploads')
const emergenciesDir = path.join(uploadsDir, 'emergencies')
const profilesDir = path.join(uploadsDir, 'profiles')

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(emergenciesDir)) fs.mkdirSync(emergenciesDir, { recursive: true })
if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir, { recursive: true })

const emergencyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, emergenciesDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilesDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mpeg', 'video/quicktime']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false)
  }
}

const imageOnlyFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed.'), false)
  }
}

export const upload = multer({
  storage: emergencyStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
})

export const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageOnlyFilter,
})

export const getFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`
}
