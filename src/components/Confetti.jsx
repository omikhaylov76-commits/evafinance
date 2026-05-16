import { useEffect, useRef } from 'react'

const COLORS = ['#ff3d8b','#ff6aab','#ffd60a','#b44bff','#00c97a','#ffffff','#ff4565','#ffadd0']

function spawnPiece(container) {
  const el = document.createElement('div')
  const size = 5 + Math.random() * 9
  const isCircle = Math.random() > 0.45
  const color = COLORS[~~(Math.random() * COLORS.length)]
  const left = 10 + Math.random() * 80
  const delay = Math.random() * 0.4
  const dur = 1.3 + Math.random() * 0.8
  el.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${left}vw;top:-14px;width:${size}px;height:${size}px;background:${color};border-radius:${isCircle ? '50%' : '3px'};animation:confFall ${dur}s ease-in ${delay}s forwards;`
  container.appendChild(el)
  setTimeout(() => el.remove(), (dur + delay + 0.1) * 1000)
}

export default function Confetti({ active }) {
  const containerRef = useRef(null)
  useEffect(() => {
    if (!active || !containerRef.current) return
    if (!document.getElementById('conf-kf')) {
      const style = document.createElement('style')
      style.id = 'conf-kf'
      style.textContent = `@keyframes confFall{0%{transform:translateY(-15px) rotate(0deg) scale(1);opacity:1}100%{transform:translateY(105vh) rotate(360deg) scale(.5);opacity:0}}`
      document.head.appendChild(style)
    }
    for (let i = 0; i < 36; i++) spawnPiece(containerRef.current)
  }, [active])
  return <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
}