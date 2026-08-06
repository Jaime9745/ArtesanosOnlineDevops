const MAX_SIDE = 1200
const QUALITY = 0.85

/**
 * Convierte un File a data URI, redimensionando antes.
 *
 * El backend corre en Cloudflare Workers, donde no hay disco: la imagen viaja
 * dentro del JSON y de ahí va a Cloudinary. Base64 infla un 33%, así que se
 * recorta a 1200px y se recomprime a JPEG para no acercarse al límite de 5mb
 * del body ni al de 128mb de memoria del isolate.
 */
export const fileToDataUri = async (file) => {
  const bitmap = await createImageBitmap(file)

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  // Fondo blanco: los PNG con transparencia quedarían negros al pasar a JPEG.
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', QUALITY)
}
