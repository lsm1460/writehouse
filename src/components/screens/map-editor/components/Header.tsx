import { useRef, useState, useEffect } from 'react'
import { useMapEditorContext } from '../context/MapEditorContext'

export function Header() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { handleImportMap, handleRunTest, handleDownload } = useMapEditorContext()

  // --- 메뉴 클릭 상태 관리 ---
  // null: 모두 닫힘, 'file': 파일 메뉴 열림, 'help': 헬프 메뉴 열림
  const [openMenu, setOpenMenu] = useState<'file' | 'help' | null>(null)

  const handleImportButtonClick = () => {
    fileInputRef.current?.click()
    setOpenMenu(null) // 메뉴 실행 후 닫기
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        handleImportMap(json)
      } catch (error) {
        alert('JSON 파일 형식이 올바르지 않습니다.')
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  // 메뉴 영역 밖의 다른 곳을 클릭하면 드롭다운 메뉴가 닫히도록 처리
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // 클릭된 요소가 메뉴 버튼이나 드롭다운 컨텐츠가 아니면 닫음
      if (!(e.target as HTMLElement).closest('.menu-container')) {
        setOpenMenu(null)
      }
    }

    if (openMenu !== null) {
      window.addEventListener('click', handleOutsideClick)
    }
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [openMenu])

  return (
    <header className="h-9 px-2 bg-neutral-950 border-b border-neutral-800 flex justify-between items-center shrink-0 select-none font-mono text-xs tracking-tight">
      
      {/* 1️⃣ 좌측: 클래식 윈도우 메뉴바 (Menu Bar) */}
      <div className="flex items-center h-full">
        
        {/* 파일 메뉴 */}
        <div className="relative h-full flex items-center menu-container">
          <button 
            onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
            className={`px-4 h-full font-medium transition cursor-pointer flex items-center gap-1 ${
              openMenu === 'file' ? 'bg-neutral-900 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            File
          </button>
          
          {/* 호버(Hover) 대신 오픈 상태 조건부 렌더링 */}
          {openMenu === 'file' && (
            <div className="flex flex-col absolute left-0 top-[100%] w-44 bg-neutral-950 border border-neutral-800 shadow-2xl py-1 z-50">
              <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              
              <button
                onClick={handleImportButtonClick}
                className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white text-neutral-300 flex items-center gap-2 cursor-pointer"
              >
                📂 Open Map...
              </button>
              
              <button
                onClick={() => {
                  handleDownload()
                  setOpenMenu(null)
                }}
                className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white text-neutral-300 flex items-center gap-2 cursor-pointer"
              >
                ⬇ Export JSON
              </button>
            </div>
          )}
        </div>

        {/* 헬프 메뉴 */}
        <div className="relative h-full flex items-center menu-container">
          <button 
            onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
            className={`px-4 h-full font-medium transition cursor-pointer flex items-center gap-1 ${
              openMenu === 'help' ? 'bg-neutral-900 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            Help
          </button>
          
          {openMenu === 'help' && (
            <div className="flex flex-col absolute left-0 top-[100%] w-52 bg-neutral-950 border border-neutral-800 shadow-2xl py-2 px-4 z-50 text-neutral-400 gap-1">
              <div className="font-bold text-white text-[11px] tracking-wider border-b border-neutral-900 pb-1 mb-1">
                WRITEHOUSE MAP EDITOR
              </div>
              <div className="text-[10px] flex justify-between">
                <span>Version:</span>
                <span className="text-neutral-200">v1.0.0</span>
              </div>
              <div className="text-[10px] flex justify-between">
                <span>Engine:</span>
                <span className="text-neutral-500 font-sans">Retro-Text 2D</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2️⃣ 우측: 제어/툴바 구역 (Toolbar) */}
      <div className="flex items-center h-full gap-1">
        
        {/* 실행(Test) 단추 */}
        <button
          onClick={handleRunTest}
          title="Run Map Test"
          className="h-5 px-2 bg-neutral-900 hover:bg-blue-950/40 border border-neutral-800 hover:border-blue-900 text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-bold transition cursor-pointer"
        >
          <span className="text-[10px] scale-80">▶</span>
          <span className="text-[10px] uppercase tracking-wider font-sans">Run</span>
        </button>

        {/* 가로 분리선 */}
        <div className="w-[1px] h-4 bg-neutral-800 mx-1" />

        {/* 게임으로 돌아가기(Exit) 단추 */}
        <a
          href="/"
          title="Exit Editor & Return to Game"
          className="h-5 px-2 bg-neutral-900 hover:bg-red-950/40 border border-neutral-800 hover:border-red-900 text-neutral-400 hover:text-red-400 flex items-center gap-1.5 font-bold transition"
        >
          <span className="text-xs font-sans font-normal scale-70">❌</span>
          <span className="text-[10px] uppercase tracking-wider font-sans">Exit</span>
        </a>
      </div>
    </header>
  )
}