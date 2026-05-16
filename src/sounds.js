let ctx = null

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

let _noiseBuf = null
function noiseBuf(seconds) {
  seconds = seconds || 1
  const c = ac()
  if (_noiseBuf && _noiseBuf.duration >= seconds) return _noiseBuf
  const len = Math.ceil(c.sampleRate * seconds)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  _noiseBuf = buf
  return buf
}

function osc(freq, type, startT, duration, peakGain, endGain) {
  endGain = endGain || 0.0001
  const c = ac()
  const o = c.createOscillator()
  const g = c.createGain()
  o.connect(g); g.connect(c.destination)
  o.type = type
  o.frequency.setValueAtTime(freq, startT)
  g.gain.setValueAtTime(0, startT)
  g.gain.linearRampToValueAtTime(peakGain, startT + 0.005)
  g.gain.exponentialRampToValueAtTime(endGain, startT + duration)
  o.start(startT); o.stop(startT + duration + 0.02)
  return { o, g }
}

function noiseBurst(startT, duration, centerFreq, Q, gain, freqEnd) {
  freqEnd = freqEnd || null
  const c = ac()
  const src = c.createBufferSource()
  src.buffer = noiseBuf(duration + 0.1)
  const filt = c.createBiquadFilter()
  filt.type = 'bandpass'
  filt.frequency.setValueAtTime(centerFreq, startT)
  if (freqEnd) filt.frequency.exponentialRampToValueAtTime(freqEnd, startT + duration)
  filt.Q.value = Q
  const g = c.createGain()
  src.connect(filt); filt.connect(g); g.connect(c.destination)
  g.gain.setValueAtTime(gain, startT)
  g.gain.exponentialRampToValueAtTime(0.0001, startT + duration)
  src.start(startT); src.stop(startT + duration + 0.05)
}

function coinPing(startT, baseFreq, vol, decay) {
  baseFreq = baseFreq || 1900; vol = vol || 0.18; decay = decay || 0.45
  const c = ac()
  const partials = [
    { ratio: 1,     v: vol },
    { ratio: 2.756, v: vol * 0.55 },
    { ratio: 5.404, v: vol * 0.25 },
    { ratio: 8.933, v: vol * 0.1 },
  ]
  partials.forEach(function(p) {
    const o = c.createOscillator()
    const g = c.createGain()
    const hp = c.createBiquadFilter()
    hp.type = 'highpass'; hp.frequency.value = 600
    o.connect(hp); hp.connect(g); g.connect(c.destination)
    o.type = 'triangle'
    o.frequency.setValueAtTime(baseFreq * p.ratio, startT)
    g.gain.setValueAtTime(0, startT)
    g.gain.linearRampToValueAtTime(p.v, startT + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0001, startT + decay)
    o.start(startT); o.stop(startT + decay + 0.05)
  })
  noiseBurst(startT, 0.015, 3000, 2, 0.3)
}

export function playCoinClink() {
  try { coinPing(ac().currentTime, 1800 + Math.random() * 400, 0.14, 0.4) } catch(_) {}
}

export function playSave() {
  try {
    const t = ac().currentTime
    for (let i = 0; i < 4; i++) coinPing(t + i * 0.065, 1600 + Math.random() * 700, 0.16 - i * 0.02, 0.38)
  } catch(_) {}
}

export function playKaching() {
  try {
    const c = ac(); const t = c.currentTime
    noiseBurst(t, 0.04, 200, 1.5, 0.6)
    noiseBurst(t, 0.025, 800, 3, 0.35)
    noiseBurst(t + 0.04, 0.12, 1200, 8, 0.22, 200)
    ;[880, 892].forEach(function(freq, i) {
      osc(freq, 'sine', t + 0.09, 0.7, 0.28 - i * 0.04)
      osc(freq * 3, 'sine', t + 0.09, 0.35, 0.06)
    })
    for (let i = 0; i < 6; i++) coinPing(t + 0.18 + i * 0.055, 1400 + Math.random() * 900, 0.10, 0.28)
  } catch(_) {}
}

export function playCoinRain() {
  try {
    const t = ac().currentTime
    for (let i = 0; i < 14; i++) coinPing(t + Math.random() * 0.7, 1200 + Math.random() * 1200, 0.08 + Math.random() * 0.12, 0.2 + Math.random() * 0.4)
  } catch(_) {}
}

export function playGoalComplete() {
  try {
    const c = ac(); const t = c.currentTime
    ;[523, 659, 784, 1047, 1319].forEach(function(freq, i) {
      osc(freq, 'triangle', t + i * 0.1, 0.5, 0.22)
      osc(freq * 2, 'sine', t + i * 0.1, 0.3, 0.06)
    })
    ;[523, 659, 784].forEach(function(freq) { osc(freq, 'sine', t + 0.55, 0.8, 0.14) })
    playCoinRain()
  } catch(_) {}
}

export function playCoinInJar() {
  try {
    const c = ac(); const t = c.currentTime
    noiseBurst(t, 0.08, 180, 4, 0.45)
    noiseBurst(t, 0.06, 450, 6, 0.2)
    ;[1, 2.5, 4.1].forEach(function(r) { osc(600 * r, 'sine', t + 0.03, 0.3, 0.09) })
    for (let i = 0; i < 3; i++) coinPing(t + 0.06 + i * 0.07, 2000 + Math.random() * 500, 0.07, 0.2)
  } catch(_) {}
}

export function playMoneyIn() {
  try {
    const c = ac(); const t = c.currentTime
    noiseBurst(t, 0.25, 300, 3, 0.25, 2200)
    const o = c.createOscillator(); const g = c.createGain()
    o.connect(g); g.connect(c.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(300, t)
    o.frequency.exponentialRampToValueAtTime(1800, t + 0.22)
    g.gain.setValueAtTime(0.13, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
    o.start(t); o.stop(t + 0.3)
    coinPing(t + 0.2, 2100, 0.14, 0.35)
  } catch(_) {}
}

export function playMoneyOut() {
  try {
    const c = ac(); const t = c.currentTime
    noiseBurst(t, 0.2, 1800, 4, 0.2, 300)
    const o = c.createOscillator(); const g = c.createGain()
    o.connect(g); g.connect(c.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(1200, t)
    o.frequency.exponentialRampToValueAtTime(250, t + 0.2)
    g.gain.setValueAtTime(0.1, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
    o.start(t); o.stop(t + 0.25)
  } catch(_) {}
}

export function playDelete() {
  try {
    const c = ac(); const t = c.currentTime
    noiseBurst(t, 0.06, 600, 4, 0.18)
    osc(440, 'sine', t, 0.2, 0.1)
    osc(330, 'sine', t + 0.1, 0.2, 0.08)
    osc(220, 'sine', t + 0.18, 0.2, 0.06)
  } catch(_) {}
}

export function playTab() {
  try { osc(1100, 'sine', ac().currentTime, 0.07, 0.05) } catch(_) {}
}

export { playCoinInJar as playCoin }
