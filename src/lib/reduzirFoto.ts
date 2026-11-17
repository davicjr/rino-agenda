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
