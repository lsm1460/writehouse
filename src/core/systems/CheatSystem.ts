import { EngineContext } from '../engineContext'

interface CheatRule {
  pattern: RegExp
  handler: (match: RegExpMatchArray) => string | null
}

export class CheatSystem {
  private ctx: EngineContext
  private registry: CheatRule[]

  constructor(ctx: EngineContext) {
    this.ctx = ctx

    this.registry = [
      {
        pattern: /^operator(?:\s+(.+))?$/,
        handler: (match) => this.handleRoomWarp(match[1]?.trim()),
      },
      {
        pattern: /^we(?:_|\s+)need(?:_|\s+)a(?:_|\s+)upload$/,
        handler: () => this.handleSave(),
      },
    ]
  }

  public execute(command: string): string | null {
    const text = command.trim().toLowerCase()

    for (const rule of this.registry) {
      const match = text.match(rule.pattern)
      if (match) return rule.handler(match)
    }

    return `⚠️ Unknown command. The system doesn't understand: "${command}"`
  }

  private handleRoomWarp(roomId: string | undefined): string {
    if (!roomId) {
      return '📞 "Operator here. Tell me where to drop you. (e.g., operator 1-2)"'
    }

    const success = this.ctx.init(roomId)
    if (!success) {
      return `📞 "Operator to Wanderer: Negative. Room [${roomId}] is an invalid coordinates."`
    }

    return `📞 "Signal locked. Patching you through to Room [${roomId}]..."`
  }

  private handleSave(): string {
    const { save, map, lang } = this.ctx
    save.save(map.currentRoomId, lang)

    return `📞
     "Got it. We need a upload. Holding the line while writing the matrix grid to disk..."`
  }
}
