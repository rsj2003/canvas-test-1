const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("button");
let dots = new Array();
let mouse = {x: 0, y: 0, move: false};
let animate = {play: false, progress: 0, time: 200, replay: false};
let centerLine = false;
let centerLineDots = new Array();
let vMainLine = true;
let vMainDots = true;
let vSubLine = true;
let vSubDots = true;

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  eventListener();
  drawing();

}

function drawing() {
  if(animate.play) animate.progress++;
  if(animate.progress >= animate.time) {
    if(!animate.replay) animate.play = false;
    animate.progress = 0;
    centerLineDots.push({x: dots[dots.length - 1].x, y: dots[dots.length - 1].y});
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
    if(vMainDots) ctx.stroke();
    if(dots.length > 1) {
      ctx.beginPath();
      ctx.arc(i.x, i.y, 4, 0, Math.PI * 2);
      if(vMainDots) ctx.fill();
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
  if(vMainLine) ctx.stroke();
  ctx.beginPath();
  if(animate.progress > 0) {
    if(animate.play && animate.progress === 1) centerLineDots = [{x:dots[0].x, y:dots[0].y}];
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
          let x = l.x - ((l.x - dot.x) / animate.time * animate.progress);
          let y = l.y - ((l.y - dot.y) / animate.time * animate.progress);
          nowDots.push({x: x, y: y});
          ctx.beginPath();
          if(subDots.length > 2) {
            ctx.arc(x, y, 3, 0, Math.PI * 2);
          }else {
            ctx.arc(x, y, 7, 0, Math.PI * 2);
            centerLineDots.push({x: x, y: y});
          }
          if(vSubDots) ctx.fill();
        }
      })
      ctx.beginPath();
      nowDots.forEach((l, idx) => {
        if(idx < nowDots.length - 1) {
          let dot = nowDots[idx + 1];
          ctx.lineWidth = 1;
          ctx.moveTo(l.x, l.y);
          ctx.lineTo(dot.x, dot.y);
        }
        if(vSubLine) ctx.stroke();
      })
      subDots = nowDots;
    }
  }
  ctx.beginPath();
  if(centerLine) {
    centerLineDots.forEach((i, idx) => {
      if(idx === 0) {
        ctx.moveTo(i.x, i.y);
      }else {
        ctx.lineTo(i.x, i.y);
      }
    })
    ctx.stroke();
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
    if(e.keyCode < 90) {
      if(e.key === "1") {
        if(vMainDots) vMainDots = false;
        else vMainDots = true;
      }
      if(e.key === "2") {
        if(vMainLine) vMainLine = false;
        else vMainLine = true;
      }
      if(e.key === "3") {
        if(vSubDots) vSubDots = false;
        else vSubDots = true;
      }
      if(e.key === "4") {
        if(vSubLine) vSubLine = false;
        else vSubLine = true;
      }
      if(e.key === "5") {
        if(centerLine) centerLine = false;
        else centerLine = true;
      }
    }
    if(96 < e.keyCode && e.keyCode < 106) {
      animate.time = Number(e.key) * 50;
    }
    if(e.key.toLowerCase() === "r") {
      if(animate.replay) animate.replay = false;
      else animate.replay = true;
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