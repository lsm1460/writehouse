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
        // "operator" 또는 "operator 1-2" 패턴 매칭
        pattern: /^operator(?:\s+(.+))?$/,
        handler: (match) => this.handleRoomWarp(match[1]?.trim()),
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
    return roomId
      ? ((this.ctx.map.currentRoomId = roomId),
        this.ctx.init(roomId),
        `📞 "Signal locked. Patching you through to Room [${roomId}]..."`)
      : '📞 "Operator here. Tell me where to drop you. (e.g., operator 1-2)"'
  }
}
