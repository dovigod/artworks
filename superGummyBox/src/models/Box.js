
export class Box {
  constructor(ctx,x, y, width, height, color , textColor = '#ffffff') {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.corners = [
      [this.x, this.y],
      [this.x + this.width, this.y],
      [this.x + this.width, this.y + this.height],
      [this.x, this.y + this.height]
    ]
    this.points = []
    this.init()
    this.isBacking = false
    this.ctx = ctx;
    this.color = color;
  }

  divide(n, a, b) {
    for (let i = 0; i < n; i++) {
      const x = (b[0] - a[0]) * i / n + a[0]
      const y = (b[1] - a[1]) * i / n + a[1]
      this.points.push({ x, y })
    }
  }

  init() {
    this.divide(1, this.corners[0], this.corners[1])
    this.divide(1, this.corners[1], this.corners[2])
    this.divide(3, this.corners[2], this.corners[3])
    this.divide(1, this.corners[3], this.corners[0])
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.moveTo(this.points[0].x, this.points[0].y)
    for (let i = 0; i < this.points.length - 1; i++) {
      this.ctx.quadraticCurveTo(mouse.mx, mouse.my, this.points[i + 1].x, this.points[i + 1].y)
    }
    this.ctx.quadraticCurveTo(mouse.mx , mouse.my , this.points[0].x, this.points[0].y)
    this.ctx.strokeStyle = this.color
    this.ctx.strokeWidth = 1
    this.ctx.stroke()
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    this.ctx.closePath()

    const GAP = this.width * 0.09
    const x1 = (this.corners[0][0] + mouse.mx) / 2
    const x2 = x1 + GAP
    const x3 = x1 + this.width / 2 - GAP
    const x4 = x3 + GAP
    const y1 = (this.corners[0][1] + mouse.my) / 2
    const y2 = y1 + GAP
    const y3 = y1 + this.height / 2 - GAP
    const y4 = y3 + GAP
    this.ctx.beginPath()
    this.ctx.moveTo(x2, y1)
    this.ctx.lineTo(x3, y1)
    this.ctx.quadraticCurveTo(x4, y1, x4, y2)
    this.ctx.lineTo(x4, y3)
    this.ctx.quadraticCurveTo(x4, y4, x3, y4)
    this.ctx.lineTo(x2, y4)
    this.ctx.quadraticCurveTo(x1, y4, x1, y3)
    this.ctx.lineTo(x1, y2)
    this.ctx.quadraticCurveTo(x1, y1, x2, y1)
    this.ctx.closePath()
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.fillStyle = '#ffff'
    this.ctx.textAlign = 'center'
  }

  checkInsideBox(clientX, clientY) {
    return (
      clientX > (this.corners[0][0] + this.width / 4) &&
      clientX < (this.corners[0][0] + this.width / 4) + (this.width / 2) &&
      clientY > (this.corners[0][1] + this.height / 4) &&
      clientY < (this.corners[0][1] + this.height / 4) + (this.height / 2)
    )
  }

  animate() {
    this.draw()
  }
}
