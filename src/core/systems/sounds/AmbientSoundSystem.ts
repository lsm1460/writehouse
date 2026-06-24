import type { EngineContext } from '~/core/engineContext'
import type { SoundCategory } from './SoundCategory'

export class AmbientSoundSystem {
  private category: SoundCategory
  private ctx: EngineContext
  private currentPlayingKey: string | null = null

  constructor(category: SoundCategory, ctx: EngineContext) {
    this.category = category
    this.ctx = ctx
  }

  public update(): void {
    const { x, y } = this.ctx.player.targetPos

    const targetTile = this.ctx.map.getTileAt(x, y)
    const nextSoundKey = targetTile?.ambientSoundKey || null

    if (this.currentPlayingKey === nextSoundKey) {
      return}

    if (this.currentPlayingKey) {
      this.category.stop(this.currentPlayingKey, 0.5)
    }

    if (nextSoundKey) {
      this.category.play(nextSoundKey, { fadeIn: 0.5 })
    }

    this.currentPlayingKey = nextSoundKey
  }
}
