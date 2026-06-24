import * as Tone from 'tone'
import type { NoteData } from './types'

export class SoundCategory {
  private volumeNode: Tone.Volume
  private synths: Tone.PolySynth[] = []
  private noiseSynth: Tone.NoiseSynth | null = null
  private scoreMap: Map<string, NoteData[][]> = new Map()
  private activeParts: Map<string, Tone.Part[]> = new Map()
  private loopDefault: boolean

  constructor(
    config: Record<string, NoteData[][]>,
    volumeNode: Tone.Volume,
    loopDefault: boolean,
    defaultSynthVolume: number = 0
  ) {
    this.volumeNode = volumeNode
    this.loopDefault = loopDefault

    // [채널 0] 리드 멜로디 전용 신스
    const leadSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.4, release: 0.15 },
    }).connect(this.volumeNode)
    leadSynth.volume.value = defaultSynthVolume

    // [채널 1] 베이스 전용 신스
    const bassSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.002, decay: 0.08, sustain: 0.1, release: 0.08 },
    }).connect(this.volumeNode)
    bassSynth.volume.value = defaultSynthVolume - 2

    this.noiseSynth = new Tone.NoiseSynth({
      noise: { type: 'pink' }, // 혹은 'brown' (부드러운 바람/불 소리 질감)
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.5, release: 0.2 },
    }).connect(this.volumeNode)

    this.synths = [leadSynth, bassSynth]

    for (const [key, tracks] of Object.entries(config)) {
      this.scoreMap.set(key, tracks)
    }
  }

  public play(key: string, options?: { loop?: boolean; fadeIn?: number; random?: boolean }): void {
    this.stop(key)

    const tracks = this.scoreMap.get(key)
    if (!tracks || tracks.length === 0) return

    this.applyFadeIn(options?.fadeIn)

    const isLoop = options?.loop !== undefined ? options.loop : this.loopDefault
    if (isLoop) {
      this.playLoopingTracks(key, tracks)
    } else {
      this.playOneShotTracks(tracks, options?.random)
    }
  }

  public stop(key?: string, fadeOut?: number): void {
    if (fadeOut && fadeOut > 0) {
      const originalVolume = this.volumeNode.volume.value
      this.volumeNode.volume.linearRampToValueAtTime(-60, Tone.now() + fadeOut)

      setTimeout(() => {
        this.clearActiveParts(key)
        this.synths.forEach((synth) => synth.releaseAll())
        this.noiseSynth?.triggerRelease()

        this.volumeNode.volume.setValueAtTime(originalVolume, Tone.now())
      }, fadeOut * 1000)
    } else {
      this.clearActiveParts(key)
      this.synths.forEach((synth) => synth.releaseAll())
      this.noiseSynth?.triggerRelease()
    }
  }

  public dispose(): void {
    this.stop()
    this.synths.forEach((synth) => synth.dispose())
    this.noiseSynth?.dispose()
  }

  private getSynth(trackIdx: number): Tone.PolySynth {
    if (this.synths[trackIdx]) return this.synths[trackIdx]

    const fallbackSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 },
    }).connect(this.volumeNode)
    fallbackSynth.volume.value = -8

    this.synths[trackIdx] = fallbackSynth
    return fallbackSynth
  }

  private applyFadeIn(fadeInSeconds?: number): void {
    if (!fadeInSeconds || fadeInSeconds <= 0) return

    const targetVolume = this.volumeNode.volume.value
    this.volumeNode.volume.setValueAtTime(-60, Tone.now())
    this.volumeNode.volume.linearRampToValueAtTime(targetVolume, Tone.now() + fadeInSeconds)
  }

  private playLoopingTracks(key: string, tracks: NoteData[][]): void {
    const parts: Tone.Part[] = []

    tracks.forEach((notes, trackIdx) => {
      if (!notes || notes.length === 0) return

      const part = new Tone.Part((time, event) => {
        if (event.note === 'noise' && this.noiseSynth) {
          this.noiseSynth.triggerAttackRelease(event.duration, time)
        } else {
          const currentSynth = this.getSynth(trackIdx)
          currentSynth.triggerAttackRelease(event.note, event.duration, time)
        }
      }, notes)

      part.loop = true

      const maxTime = notes.reduce((max, n) => {
        const t = Tone.Time(n.time).toSeconds()
        return t > max ? t : max
      }, 0)
      part.loopEnd = maxTime + 0.4

      part.start(Tone.getTransport().seconds)
      parts.push(part)
    })

    this.activeParts.set(key, parts)

    if (Tone.getTransport().state !== 'started') {
      Tone.getTransport().start()
    }
  }

  private playOneShotTracks(tracks: NoteData[][], isRandom?: boolean): void {
    const now = Tone.now()

    if (isRandom) {
      const randIdx = Math.floor(Math.random() * tracks.length)
      const notes = tracks[randIdx]
      if (!notes || notes.length === 0) return

      notes.forEach((n) => {
        if (n.note === 'noise' && this.noiseSynth) {
          this.noiseSynth.triggerAttackRelease(n.duration, now + Tone.Time(n.time).toSeconds())
        } else {
          this.getSynth(randIdx).triggerAttackRelease(n.note, n.duration, now + Tone.Time(n.time).toSeconds())
        }
      })
    } else {
      tracks.forEach((notes, trackIdx) => {
        if (!notes || notes.length === 0) return

        notes.forEach((n) => {
          if (n.note === 'noise' && this.noiseSynth) {
            this.noiseSynth.triggerAttackRelease(n.duration, now + Tone.Time(n.time).toSeconds())
          } else {
            this.getSynth(trackIdx).triggerAttackRelease(n.note, n.duration, now + Tone.Time(n.time).toSeconds())
          }
        })
      })
    }
  }

  private clearActiveParts(key?: string): void {
    if (key) {
      const parts = this.activeParts.get(key)
      if (parts) {
        parts.forEach((part) => {
          part.stop()
          part.dispose()
        })
        this.activeParts.delete(key)
      }
    } else {
      this.activeParts.forEach((parts) => {
        parts.forEach((part) => {
          part.stop()
          part.dispose()
        })
      })
      this.activeParts.clear()
    }
  }
}
