export function testSvgEnemyRender(): () => void {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '40')
  svg.setAttribute('height', '36')
  svg.setAttribute('viewBox', '0 0 40 36')
  
  svg.style.position = 'fixed'
  svg.style.left = '100px'
  svg.style.top = '100px'
  svg.style.width = '40px'
  svg.style.height = '36px'
  svg.style.zIndex = '10000'
  svg.style.pointerEvents = 'none'
  svg.style.transformOrigin = 'center center'
  
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', '0')
  rect.setAttribute('y', '0')
  rect.setAttribute('width', '40')
  rect.setAttribute('height', '36')
  rect.setAttribute('rx', '8')
  rect.setAttribute('fill', '#22c55e')
  svg.appendChild(rect)
  
  // Add eyes
  const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  eye1.setAttribute('cx', '14')
  eye1.setAttribute('cy', '12')
  eye1.setAttribute('r', '2')
  eye1.setAttribute('fill', '#000000')
  eye1.setAttribute('fill-opacity', '0.8')
  svg.appendChild(eye1)
  
  const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  eye2.setAttribute('cx', '26')
  eye2.setAttribute('cy', '12')
  eye2.setAttribute('r', '2')
  eye2.setAttribute('fill', '#000000')
  eye2.setAttribute('fill-opacity', '0.8')
  svg.appendChild(eye2)
  
  document.body.appendChild(svg)
  
  // Rotation animation
  let rotation = 0
  let animationFrameId: number | null = null
  
  const animate = () => {
    rotation += 0.02 // Increment rotation (radians per frame)
    svg.style.transform = `rotate(${rotation}rad)`
    animationFrameId = requestAnimationFrame(animate)
  }
  
  // Start animation
  animationFrameId = requestAnimationFrame(animate)
  
  return () => {
    // Stop animation
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    // Remove SVG element
    if (svg.parentNode) {
      svg.parentNode.removeChild(svg)
    }
  }
}
