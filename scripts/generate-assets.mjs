// Rasterize the brand SVGs into every icon/social asset the app needs.
// Run: pnpm assets
// Source of truth: app/assets/brand/icon.svg and og.svg. Edit those, re-run.
import sharp from 'sharp'
import { mkdir, copyFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const brand = (f) => resolve(root, 'app/assets/brand', f)
const pub = (f) => resolve(root, 'public', f)

const ICON = brand('icon.svg')
const BURNT = '#e0662e'

// High render density keeps edges crisp; we downscale to the target afterwards.
async function png(src, size, out, { background } = {}) {
  let img = sharp(src, { density: 384 }).resize(size, size, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  if (background) img = img.flatten({ background })
  await img.png().toFile(pub(out))
  console.log('  public/' + out)
}

async function main() {
  await mkdir(resolve(root, 'public'), { recursive: true })
  console.log('Generating Encore assets')

  await copyFile(ICON, pub('favicon.svg'))
  console.log('  public/favicon.svg')

  await png(ICON, 32, 'favicon-32.png')
  await png(ICON, 180, 'apple-touch-icon.png', { background: BURNT })
  await png(ICON, 192, 'icon-192.png')
  await png(ICON, 512, 'icon-512.png')
  // Maskable: fill the whole square so no transparent corners survive the mask.
  await png(ICON, 512, 'icon-maskable-512.png', { background: BURNT })

  await sharp(brand('og.svg'), { density: 200 }).resize(1200, 630).png().toFile(pub('og.png'))
  console.log('  public/og.png')

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
