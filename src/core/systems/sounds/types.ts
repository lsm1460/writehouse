export interface NoteData {
  note: string // 음고 (예: "C4", "E4", "G4", "A#3")
  duration: string // 음 길이 (예: "8n", "4n", "16n", "2n")
  time: string | number // 재생 타이밍 오프셋 (예: "0:0:2" 마디 포맷 또는 초 단위 숫자)
}

export interface SoundConfig {
  bgm?: Record<string, NoteData[][]>
  ambient?: Record<string, NoteData[][]>
  sfx?: Record<string, NoteData[][]>
}
