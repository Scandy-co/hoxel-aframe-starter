let container = document.querySelector('#container')
let colors = ["red", "orange", "yellow", "green", "blue", "purple", "hotpink"]

function addBall() {
  let x = Math.random() * 10 - 5
  let y = Math.random() * 10 + 2
  let z = Math.random()
  container.innerHTML += `<a-sphere hoverable
  id="ball"
  grabbable
  stretchable
  draggable
  event-set__hoveron="_event: hover-start; material.opacity: 0.7; transparent: true"
  event-set__hoveroff="_event: hover-end; material.opacity: 1; transparent: false"
  dynamic-body
  shadow dynamic-body position="${x} ${y} ${z}" radius="0.5" color="${colors[Math.floor(Math.random() * colors.length)]}"></a-sphere>`
}

for (let i = 0; i < 50; i++) {
  addBall()
}

// setTimeout(() => {
//   let balls = document.querySelectorAll('#ball')
//   balls.forEach((ball)=> {
//     ball.setAttribute('spring', "target: #ball; damping: 0.25; stiffness: 25;")
//   })
// }, 10000)