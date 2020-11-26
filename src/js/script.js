const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("button");
let dots = new Array();
let mouse = {x: 0, y: 0, move: false};
let animate = {play: false, progress: 0};

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  eventListener();
  drawing();

}

function drawing() {
  if(animate.play) animate.progress++;
  if(animate.progress >= 200) {
    animate.play = false;
    animate.progress = 0;
  }
  canvas.width = canvas.width;
  ctx.fillStyle = "#222";
  ctx.StrokeStyle = "#222";
  dots.forEach(i => {
    if(i.select && mouse.move) {
      i.x = mouse.x;
      i.y = mouse.y;
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(i.x, i.y, 7, 0, Math.PI * 2);
    ctx.stroke();
    if(dots.length > 1) {
      ctx.beginPath();
      ctx.arc(i.x, i.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  })
  ctx.beginPath();
  dots.forEach((i, idx) => {
    if(idx < dots.length - 1) {
      let dot = dots[idx + 1];
      ctx.lineWidth = 1;
      ctx.moveTo(i.x, i.y);
      ctx.lineTo(dot.x, dot.y);
    }
  })
  ctx.stroke();
  ctx.beginPath();
  if(animate.progress > 0) {
    ctx.fillStyle = "#2228";
    ctx.strokeStyle = "#555";
    let subDots = new Array();
    for(let i = 0; i < dots.length - 1; i++) {
      if(i === 0) subDots = dots;
      let nowDots = new Array();
      // console.log(subDots);
      subDots.forEach((l, idx) => {
        if(idx < subDots.length - 1) {
          let dot = subDots[idx + 1];
          let x = l.x - ((l.x - dot.x) / 200 * animate.progress);
          let y = l.y - ((l.y - dot.y) / 200 * animate.progress);
          nowDots.push({x: x, y: y});
          ctx.beginPath();
          if(subDots.length > 2) {
            ctx.arc(x, y, 3, 0, Math.PI * 2);
          }else {
            ctx.arc(x, y, 7, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      })
      nowDots.forEach((l, idx) => {
        if(idx < nowDots.length - 1) {
          let dot = nowDots[idx + 1];
          ctx.lineWidth = 1;
          ctx.moveTo(l.x, l.y);
          ctx.lineTo(dot.x, dot.y);
        }
        ctx.stroke();
      })
      subDots = nowDots;
    }
  }
  ctx.beginPath();
  mouse.move = false;
  requestAnimationFrame(drawing);
}

function eventListener() {
  document.addEventListener("dblclick", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    let dotClick = false;
    dots.reverse();
    dots.forEach((i, idx) => {
      if(dotClick === false){
        if(distance(i.x, i.y, mouse.x, mouse.y) < 9) {
          dotClick = true;
          dots.splice(idx, 1);
        }
      }
    })
    dots.reverse();
    if(!dotClick) {
      dots.push({x: mouse.x, y: mouse.y, select: false});
    }
  })
  document.addEventListener("mousedown", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    let dotClick = false;
    dots.forEach(i => {
      if(dotClick === false){
        if(distance(i.x, i.y, mouse.x, mouse.y) < 9) {
          dotClick = true;
          i.select = true;
        }
      }
    })
  })
  document.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.move = true;
  })
  document.addEventListener("mouseup", e => {
    dots.forEach(i => {
      i.select = false;
    })
  })
  document.addEventListener("keydown", e => {
    if(e.key === " ") {
      if(animate.play) animate.play = false;
      else animate.play = true;
    }
  })
  button.addEventListener("click", e => {
    if(animate.play) animate.play = false;
    else animate.play = true;
  })
}

function distance(x, y, X, Y) {
  return Math.sqrt(((x - X) * (x - X)) + ((y - Y) * (y - Y)));
}

window.onload = init;