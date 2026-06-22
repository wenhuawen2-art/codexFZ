function UeViewport() {
  return (
    <main className="relative min-w-0 flex-1 bg-transparent">
      {/* 虚线框外不透明边距（四边条），框内保持镂空 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-2 bg-hud-bg" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-hud-bg" />
        <div className="absolute bottom-2 left-0 top-2 w-2 bg-hud-bg" />
        <div className="absolute bottom-2 right-0 top-2 w-2 bg-hud-bg" />
      </div>

      <div className="pointer-events-none absolute inset-2 border-2 border-dashed border-hud-viewport bg-transparent">
        <span className="absolute -left-[2px] -top-[2px] z-10 h-4 w-4 border-l-2 border-t-2 border-hud-grid-major" />
        <span className="absolute -right-[2px] -top-[2px] z-10 h-4 w-4 border-r-2 border-t-2 border-hud-grid-major" />
        <span className="absolute -bottom-[2px] -left-[2px] z-10 h-4 w-4 border-b-2 border-l-2 border-hud-grid-major" />
        <span className="absolute -bottom-[2px] -right-[2px] z-10 h-4 w-4 border-b-2 border-r-2 border-hud-grid-major" />
      </div>
    </main>
  )
}

export default UeViewport
