const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("button");
let dots = new Array();
let mouse = {x: 0, y: 0, move: false, down: false};
let animate = {play: false, progress: 0, time: 200, replay: false};
let centerLine = false;
let centerLineDots = new Array();
let vMainLine = true;
let vMainDots = true;
let vSubLine = true;
let vSubDots = true;
let ctrl = false;
let shift = false;
let shape = {shape: "", fill: false, alpha: 0};

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  eventListener();
  drawing();

}

function drawing() {
  if(animate.play) animate.progress++;
  if(shape.shape === "") {
    shape.fill = false;
    shape.alpha = 0;
  }
  if(animate.progress >= animate.time) {
    if(!animate.replay) animate.play = false;
    if(shape.shape === "heart") shape.fill = true;
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
  ctx.fillStyle = "#2228";
  ctx.strokeStyle = "#555";
  if(animate.progress > 0 && dots.length > 0) {
    if(animate.play && animate.progress === 1) centerLineDots = [{x:dots[0].x, y:dots[0].y}];
    let subDots = new Array();
    for(let i = 0; i < dots.length - 1; i++) {
      if(i === 0) subDots = dots;
      let nowDots = new Array();
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
    if(shape.fill) {
      ctx.fillStyle = `rgba(255, 50, 50, ${shape.alpha})`;
      ctx.fill();
      if(shape.alpha < 1) shape.alpha += 0.01;
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
    shape.shape = "";
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
    if(!dotClick && ctrl) mouse.down = true;
  })
  document.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.move = true;
    if(mouse.down) {
      shape.shape = "";
      dots.push({x: mouse.x, y: mouse.y, select: false});
    }
  })
  document.addEventListener("mouseup", e => {
    mouse.down = false;
    dots.forEach(i => {
      i.select = false;
    })
  })
  document.addEventListener("keydown", e => {
    let key = e.key.toLowerCase();
    if(key === " ") {
      if(animate.play) animate.play = false;
      else animate.play = true;
    }
    if(e.keyCode > 48 && e.keyCode < 54) {
      shape.shape = "";
      if(key === "1") {
        if(vMainDots) vMainDots = false;
        else vMainDots = true;
      }
      if(key === "2") {
        if(vMainLine) vMainLine = false;
        else vMainLine = true;
      }
      if(key === "3") {
        if(vSubDots) vSubDots = false;
        else vSubDots = true;
      }
      if(key === "4") {
        if(vSubLine) vSubLine = false;
        else vSubLine = true;
      }
      if(key === "5") {
        if(centerLine) centerLine = false;
        else centerLine = true;
      }
    }
    if(96 < e.keyCode && e.keyCode < 106) {
      animate.time = Number(e.key) * 50;
    }
    if(key === "h") {
      if(ctrl && shift) {
        dots = new Array();
        centerLineDots = new Array();
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        dots.push({x: x, y: y + 250, select: false});
        dots.push({x: x - 570, y: y - 50, select: false});
        dots.push({x: x - 250, y: y - 500, select: false});
        dots.push({x: x + 150, y: y - 200, select: false});
        dots.push({x: x + 100, y: y - 50, select: false});
        dots.push({x: x, y: y - 20, select: false});
        dots.push({x: x - 100, y: y - 50, select: false});
        dots.push({x: x - 150, y: y - 200, select: false});
        dots.push({x: x + 250, y: y - 500, select: false});
        dots.push({x: x + 570, y: y - 50, select: false});
        dots.push({x: x, y: y + 250, select: false});
        vMainDots = false;
        vMainLine = false;
        vSubDots = false;
        vSubLine = false;
        centerLine = true;
        shape.shape = "heart";
      }
    }
    if(key === "c") {
      shape.shape = "";
      dots = new Array();
      centerLineDots = new Array();
      let deg = 0;
      for(let i = 0; i < 37; i++) {
        dots.push({x: canvas.width / 2 + (Math.cos(deg * Math.PI / 180) * 300), y: canvas.height / 2 + (Math.sin(deg * Math.PI / 180) * 300), select: false});
        if(!shift && !ctrl) deg += 10;
        if(shift && !ctrl) deg += 20;
        if(!shift && ctrl) deg += 30;
        if(shift && ctrl) deg += 40;
      }
    }
    if(key === "r") {
      if(animate.replay) animate.replay = false;
      else animate.replay = true;
    }
    if(key === "control") {
      e.preventDefault();
      ctrl = true;
    }
    if(key === "shift") {
      shift = true;
    }
    if(key === "enter") {
      dots = new Array();
      centerLineDots = new Array();
    }
  })
  document.addEventListener("keyup", e=> {
    let key = e.key.toLowerCase();
    if(key === "control") {
      ctrl = false;
    }
    if(key === "shift") {
      shift = false;
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