import express from 'express'
import cors from 'cors'
import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs'
import multer from 'multer'
import { db } from './lib/db'

const app = express()
const PORT = process.env.PORT || 3001

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors())
app.use(express.json())

// ─── Static files ────────────────────────────────────────────────────────────

const imagesDir = path.join(__dirname, '../images')
const uploadsDir = path.join(__dirname, '../uploads')
const reviewsUploadDir = path.join(uploadsDir, 'reviews')

// Ensure directories exist on startup
fs.mkdirSync(imagesDir, { recursive: true })
fs.mkdirSync(reviewsUploadDir, { recursive: true })

app.use('/images', express.static(imagesDir))
app.use('/uploads', express.static(uploadsDir))

// ─── Multer config for review image uploads ──────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, reviewsUploadDir)
  },
  filename: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop() || 'png'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    cb(null, filename)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const ext = '.' + (file.originalname.split('.').pop() || '').toLowerCase()
    if (allowed.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/products — List products with optional filters
app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category as string | undefined
    const featured = req.query.featured as string | undefined
    const search = req.query.search as string | undefined

    const where: Record<string, unknown> = {}

    if (category && category !== 'All') {
      where.category = category
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const formatted = products.map((p) => ({
      ...p,
      price: Number(p.price),
      images: JSON.parse(p.images),
      featured: Boolean(p.featured),
    }))

    res.json(formatted)
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// POST /api/products — Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const body = req.body
    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        images: JSON.stringify(body.images),
        featured: body.featured || false,
      },
    })
    res.status(201).json(product)
  } catch {
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// GET /api/reviews — List reviews, optionally filtered by productId
app.get('/api/reviews', async (req, res) => {
  try {
    const productId = req.query.productId as string | undefined

    const reviews = await db.review.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true } } },
    })

    res.json(
      reviews.map((r) => ({
        ...r,
        images: JSON.parse(r.images),
        rating: Number(r.rating),
      }))
    )
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

// POST /api/reviews — Submit a new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { productId, reviewerName, rating, text, images } = req.body

    if (!productId || !reviewerName || !rating || !text) {
      res.status(400).json({ error: 'Product, name, rating, and review text are required' })
      return
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be 1-5' })
      return
    }

    const review = await db.review.create({
      data: {
        productId,
        reviewerName,
        rating,
        text,
        images: JSON.stringify(images || []),
      },
      include: { product: { select: { name: true } } },
    })

    res.status(201).json({
      ...review,
      images: JSON.parse(review.images),
      rating: Number(review.rating),
    })
  } catch {
    res.status(500).json({ error: 'Failed to submit review' })
  }
})

// POST /api/contact — Submit a contact message
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' })
      return
    }

    const contactMessage = await db.contactMessage.create({
      data: { name, email, phone, message },
    })

    res.status(201).json({ success: true, id: contactMessage.id })
  } catch {
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// POST /api/upload — Upload review images (max 3 files, 5MB each)
app.post('/api/upload', upload.array('files', 3), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files provided' })
      return
    }

    const urls = files.map((file) => `/uploads/reviews/${file.filename}`)
    res.json({ urls })
  } catch {
    res.status(500).json({ error: 'Upload failed' })
  }
})

// ─── Startup ─────────────────────────────────────────────────────────────────

async function start() {
  // Auto-push database schema if it doesn't exist
  const dbPath = path.join(__dirname, '../prisma/dev.db')
  if (!fs.existsSync(dbPath)) {
    console.log('Database not found, running prisma db push...')
    try {
      execSync('npx prisma db push --skip-generate', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
      })
      console.log('Database schema pushed successfully.')
    } catch (err) {
      console.error('Failed to push database schema:', err)
    }
  }

  app.listen(PORT, () => {
    console.log(`Chaitra backend running on port ${PORT}`)
  })
}

start()