import sharp from 'sharp'
import { readdir, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.join(__dirname, '..', 'src', 'public', 'toWEBP')
const MAX_DIMENSION = 600
const QUALITY = 78

const files = (await readdir(DIR)).filter((f) => f.endsWith('.webp'))
console.log(`Optimizing ${files.length} images (max ${MAX_DIMENSION}px, quality ${QUALITY})...`)

for (const file of files) {
  const filePath = path.join(DIR, file)
  const buf = await sharp(filePath)
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer()
  await writeFile(filePath, buf)
  console.log(`  ${file}`)
}

console.log('Done.')
