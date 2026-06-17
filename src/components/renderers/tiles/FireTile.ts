
import { CELL_SIZE } from '~/components/game/consts'
import type { TileEffect } from './DefaultTile'

interface FireParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number    // 1에서 시작해서 0이 되면 소멸
  maxLife: number
  size: number
  color: string
}

// 타일별로 독립된 파티클 배열을 관리하기 위한 저장소 (x,y 좌표를 키로 사용)
const particleCache = new Map<string, FireParticle[]>()

export const FireTile: TileEffect = {
  render(ctx, x, y, char, timestamp) {
    const tilePixelX = x * CELL_SIZE
    const tilePixelY = y * CELL_SIZE
    const centerX = tilePixelX + CELL_SIZE / 2
    const centerY = tilePixelY + CELL_SIZE / 2
    const cacheKey = `${x},${y}`

    // --- 1. 파티클 시스템 관리 (생성 및 업데이트) ---
    if (!particleCache.has(cacheKey)) {
      particleCache.set(cacheKey, [])
    }
    const particles = particleCache.get(cacheKey)!

    // 일정 확률로 상단으로 튈 파티클 스폰 (타일당 최대 6개 제한)
    if (particles.length < 6 && Math.random() < 0.15) {
      const maxLife = 20 + Math.random() * 20
      particles.push({
        x: centerX + (Math.random() - 0.5) * (CELL_SIZE * 0.6), // 글자 주변 무작위 x
        y: centerY + 2, // 글자 하단 부근에서 시작
        vx: (Math.random() - 0.5) * 0.4, // 미세한 좌우 확산
        vy: -(0.4 + Math.random() * 0.6), // 위로 상승하는 속도
        life: 1.0,
        maxLife,
        size: 1 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#f97316' : '#facc15' // 주황 혹은 노랑
      })
    }

    // 파티클 먼저 그리기 (글자 뒤쪽에 깔리도록)
    ctx.save()
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life -= 1 / p.maxLife

      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      // 위로 올라갈수록 불꽃이 작아지고 투명해짐
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()


    // --- 2. CSS @keyframes (0.4s) 보간 로직 구현 ---
    const duration = 400 // 0.4초
    const progress = (timestamp % duration) / duration // 0.0 ~ 1.0 순환

    // 키프레임 데이터 정의
    let scale = 1
    let skewX = 0
    // [offsetY, blur, color] 리스트 구조
    let shadows: [number, number, string][] = []

    if (progress < 0.25) {
      // 0% -> 25% 보간
      const t = progress / 0.25
      scale = 1 + (1.03 - 1) * t
      skewX = 0 + (-2 - 0) * t
      shadows = [
        [-2 - t, 4 + 2 * t, '#facc15'],
        [-4 - 2 * t, 10 + 2 * t, '#f97316'],
        [-8 - 2 * t, 20 + 4 * t, pColor(t, '#ef4444', '#dc2626')],
        [0, 4 + t, '#facc15']
      ]
    } else if (progress < 0.5) {
      // 25% -> 50% 보간
      const t = (progress - 0.25) / 0.25
      scale = 1.03 + (0.98 - 1.03) * t
      skewX = -2 + (1 - -2) * t
      shadows = [
        [-3 + 2 * t, 6 - 3 * t, '#facc15'],
        [-6 + 3 * t, 12 - 4 * t, '#f97316'],
        [-10 + 4 * t, 24 - 8 * t, pColor(t, '#dc2626', '#ef4444')],
        [0, 5 - 2 * t, '#facc15']
      ]
    } else if (progress < 0.75) {
      // 50% -> 75% 보간
      const t = (progress - 0.5) / 0.25
      scale = 0.98 + (1.05 - 0.98) * t
      skewX = 1 + (2 - 1) * t
      shadows = [
        [-1 - 3 * t, 3 + 4 * t, '#facc15'],
        [-3 - 4 * t, 8 + 7 * t, pColor(t, '#f97316', '#ea580c')],
        [-6 - 6 * t, 16 + 12 * t, '#ef4444'],
        [0, 3 + 3 * t, '#facc15']
      ]
    } else {
      // 75% -> 100% 보간
      const t = (progress - 0.75) / 0.25
      scale = 1.05 + (1 - 1.05) * t
      skewX = 2 + (0 - 2) * t
      shadows = [
        [-4 + 2 * t, 7 - 3 * t, '#facc15'],
        [-7 + 3 * t, 15 - 5 * t, pColor(t, '#ea580c', '#f97316')],
        [-12 + 4 * t, 28 - 8 * t, '#ef4444'],
        [0, 6 - 2 * t, '#facc15']
      ]
    }


    // --- 3. 렌더링 컨텍스트 스타일 적용 및 글자 렌더링 ---
    ctx.save()

    // transform-origin: bottom center 효과 적용을 위해 하단 기준으로 축 변환
    ctx.translate(centerX, centerY + CELL_SIZE / 2)
    ctx.transform(scale, 0, Math.tan(skewX * Math.PI / 180), scale, 0, 0)
    ctx.translate(-centerX, -(centerY + CELL_SIZE / 2))

    ctx.font = 'bold 13px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // HTML text-shadow 다중 레이어를 Canvas 섀도우 루프로 구현
    for (const [sY, blur, color] of shadows) {
      ctx.shadowOffsetY = sY
      ctx.shadowBlur = blur
      ctx.shadowColor = color
      ctx.fillStyle = 'rgba(0,0,0,0)' // 그림자만 그리도록 문자 자체는 투명하게 지정
      ctx.fillText(char, centerX, centerY)
    }

    // 마지막 원본 글자 전면 드로잉 (그림자 OFF)
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    ctx.fillStyle = '#facc15' // 화염의 코어 텍스트 기본색
    ctx.fillText(char, centerX, centerY)

    ctx.restore()
  }
}

// 보간용 간이 색상 반환 헬퍼 (중간 단계는 시작색 유지)
function pColor(t: number, c1: string, c2: string) {
  return t < 0.5 ? c1 : c2
}