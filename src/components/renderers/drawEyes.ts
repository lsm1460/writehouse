export const drawEyes = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestamp: number,
  isMoving: boolean,
  direction: string | undefined,
  char: string,
  eyeRadius: number,
  pupilRadius: number
) => {
  let offsetX = 0
  let offsetY = 0

  if (isMoving) {
    const lookStrength = 2.0
    switch (direction) {
      case 'UP': offsetY = -lookStrength; break
      case 'DOWN': offsetY = lookStrength; break
      case 'LEFT': offsetX = -lookStrength; break
      case 'RIGHT': offsetX = lookStrength; break
    }
  } else {
    const time = timestamp * 0.003
    if (char === 'M') {
      offsetX = Math.sin(time) * 1.5
    } else if (char === 'm') {
      offsetY = Math.sin(time) * 1.5
    }
  }

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(x, y, eyeRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.arc(x + offsetX, y + offsetY, pupilRadius, 0, Math.PI * 2)
  ctx.fill()
}
