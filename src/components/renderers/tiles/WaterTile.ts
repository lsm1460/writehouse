import type { TileW } from '~/core/map/tiles/TileW'
import { BaseTileEffect } from './DefaultTile'

export class WaterTile extends BaseTileEffect<TileW> {
  protected render() {
    const { timestamp } = this.context
    const { x, y, char } = this.tile

    const waveSpeed = 0.0025
    const spatialFrequency = 0.4

    const waveAngleX = timestamp * waveSpeed + x * spatialFrequency + y * 0.2
    const waveAngleY = timestamp * (waveSpeed * 0.9) + y * spatialFrequency + x * 0.3

    const alphaPulse = 0.3 + Math.sin(waveAngleX) * 0.1

    const colorCycle = (Math.sin(waveAngleY) + 1) / 2 // 0 ~ 1
    const r = Math.round(14 + colorCycle * 20) // 14 ~ 34
    const g = Math.round(165 + colorCycle * 46) // 165 ~ 211
    const b = Math.round(233 + colorCycle * 5) // 233 ~ 238
    const waveColor = `rgb(${r}, ${g}, ${b})`

    this.ctx.save()

    this.ctx.globalAlpha = alphaPulse

    this.ctx.font = '700 14px D2Coding'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    this.ctx.shadowColor = waveColor
    this.ctx.shadowBlur = 5
    this.ctx.fillStyle = waveColor

    this.ctx.fillText(char, this.centerX, this.centerY)

    this.ctx.restore()
  }
}
