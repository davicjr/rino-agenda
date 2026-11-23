// Recorta a área escolhida no recortador e reduz para 320 px em WebP (uns 20 KB),
// usando o próprio navegador (createImageBitmap + canvas), já respeitando a orientação da câmera.
const LADO = 320

export type Area = { x: number; y: number; width: number; height: number }

export async function recortarFoto(arquivo: Blob, area: Area): Promise<Blob> {
  const img = await createImageBitmap(arquivo, { imageOrientation: 'from-image' })
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = LADO
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não deu para processar a foto.')
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, LADO, LADO)
  img.close()
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/webp', 0.82))
  if (!blob) throw new Error('Não deu para processar a foto.')
  return blob
}

const LADO_TREINO = 1280

/** Foto do treino: mantém a imagem inteira e reduz o lado maior para 1280 px em WebP (uns 100 a 200 KB). */
export async function reduzirFotoTreino(arquivo: Blob): Promise<Blob> {
  const img = await createImageBitmap(arquivo, { imageOrientation: 'from-image' })
  const escala = Math.min(1, LADO_TREINO / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * escala)
  canvas.height = Math.round(img.height * escala)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não deu para processar a foto.')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  img.close()
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/webp', 0.8))
  if (!blob) throw new Error('Não deu para processar a foto.')
  return blob
}
