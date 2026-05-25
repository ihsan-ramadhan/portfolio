export async function optimizeImage(file: File): Promise<File> {
  if (file.type === 'image/gif') return file;
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      const maxWidth = 800
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      const finalRatio = ratio < 1 ? ratio : 1

      canvas.width = img.width * finalRatio
      canvas.height = img.height * finalRatio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          const optimizedFile = new File(
            [blob!],
            file.name.replace(/\.\w+$/, '.webp'),
            { type: 'image/webp' }
          )
          resolve(optimizedFile)
        },
        'image/webp',
        0.8
      )
    }

    img.src = URL.createObjectURL(file)
  })
}
