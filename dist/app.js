(() => {
  "use strict";

  const WORLD = { width: 1000, height: 700 };
  const STORAGE_KEY = "cse606-furniture-layout-plans-v1";
  const TYPE_NAMES = {
    bed: "Bed",
    sofa: "Sofa",
    dining: "Dining table set",
    coffee: "Coffee table",
    sectional: "L-shaped sectional"
  };
  const BOUNDS = {
    bed: { x: -70, y: -105, w: 140, h: 210 },
    sofa: { x: -115, y: -58, w: 230, h: 116 },
    dining: { x: -102, y: -102, w: 204, h: 204 },
    coffee: { x: -52, y: -52, w: 104, h: 104 },
    sectional: { x: -110, y: -92, w: 220, h: 184 }
  };
  const ROOM_COLORS = {
    living: [0.96, 0.96, 0.96, 1],
    kitchen: [0.96, 0.96, 0.96, 1],
    bedroom: [0.96, 0.96, 0.96, 1]
  };
  const C = {
    wall: [0.22, 0.22, 0.22, 1],
    select: [0.145, 0.388, 0.922, 1],
    wood: [0.45, 0.45, 0.45, 1],
    woodLight: [0.78, 0.78, 0.78, 1],
    textile: [0.70, 0.70, 0.70, 1],
    textileLight: [0.82, 0.82, 0.82, 1],
    textileDark: [0.40, 0.40, 0.40, 1],
    linen: [0.88, 0.88, 0.88, 1],
    blanket: [0.65, 0.65, 0.65, 1],
    chair: [0.65, 0.65, 0.65, 1]
  };

  // Kept for retrieving plans saved by the original version.
  const layouts = [
    {
      name: "Layout A · Open social core",
      rooms: [
        { name: "Living + dining", key: "living", x: 50, y: 50, w: 580, h: 600 },
        { name: "Kitchen", key: "kitchen", x: 630, y: 50, w: 320, h: 280 },
        { name: "Bedroom", key: "bedroom", x: 630, y: 330, w: 320, h: 320 }
      ],
      walls: [
        [50, 50, 950, 50], [950, 50, 950, 650], [950, 650, 50, 650], [50, 650, 50, 50],
        [630, 50, 630, 142], [630, 222, 630, 438], [630, 518, 630, 650],
        [630, 330, 748, 330], [828, 330, 950, 330]
      ],
      doors: [
        { x: 630, y: 142, r: 80, a: Math.PI / 2 },
        { x: 630, y: 518, r: 80, a: -Math.PI / 2 },
        { x: 748, y: 330, r: 80, a: 0 }
      ]
    },
    {
      name: "Layout B · Rooms on the west",
      rooms: [
        { name: "Kitchen", key: "kitchen", x: 50, y: 50, w: 300, h: 260 },
        { name: "Bedroom", key: "bedroom", x: 50, y: 310, w: 300, h: 340 },
        { name: "Living + dining", key: "living", x: 350, y: 50, w: 600, h: 600 }
      ],
      walls: [
        [50, 50, 950, 50], [950, 50, 950, 650], [950, 650, 50, 650], [50, 650, 50, 50],
        [350, 50, 350, 150], [350, 230, 350, 432], [350, 512, 350, 650],
        [50, 310, 180, 310], [260, 310, 350, 310]
      ],
      doors: [
        { x: 350, y: 150, r: 80, a: Math.PI / 2 },
        { x: 350, y: 512, r: 80, a: -Math.PI / 2 },
        { x: 180, y: 310, r: 80, a: 0 }
      ]
    },
    {
      name: "Layout C · Wide social wing",
      rooms: [
        { name: "Living + dining", key: "living", x: 50, y: 50, w: 900, h: 350 },
        { name: "Kitchen", key: "kitchen", x: 50, y: 400, w: 390, h: 250 },
        { name: "Bedroom", key: "bedroom", x: 440, y: 400, w: 510, h: 250 }
      ],
      walls: [
        [50, 50, 950, 50], [950, 50, 950, 650], [950, 650, 50, 650], [50, 650, 50, 50],
        [50, 400, 190, 400], [270, 400, 690, 400], [770, 400, 950, 400],
        [440, 400, 440, 486], [440, 566, 440, 650]
      ],
      doors: [
        { x: 190, y: 400, r: 80, a: 0 },
        { x: 770, y: 400, r: 80, a: Math.PI },
        { x: 440, y: 486, r: 80, a: Math.PI / 2 }
      ]
    }
  ];

  // Randomize room proportions while keeping all rooms connected by doorways.
  // There is deliberately no wall between the living and dining areas.
  function generateLayout(random = Math.random) {
    const kitchenX = Math.round(580 + random() * 80);
    const splitY = Math.round(305 + random() * 60);
    const bedroomX = Math.round(510 + random() * 100);
    const livingX = Math.round(50 + (kitchenX - 50) * (0.48 + random() * 0.08));
    const doorWidth = 65;
    const kitchenDoorY = splitY - 100;
    const bedDoorX = Math.round((50 + Math.min(bedroomX, kitchenX)) / 2);
    const bathDoorX = Math.round((Math.max(bedroomX, kitchenX) + 950) / 2);
    const entryY = 155;
    return {
      name: "Ground floor",
      rooms: [
        { name: "Living room", key: "living", x: 50, y: 50, w: livingX - 50, h: splitY - 50 },
        { name: "Dining room", key: "living", x: livingX, y: 50, w: kitchenX - livingX, h: splitY - 50 },
        { name: "Kitchen", key: "kitchen", x: kitchenX, y: 50, w: 950 - kitchenX, h: splitY - 50 },
        { name: "Bedroom", key: "bedroom", x: 50, y: splitY, w: bedroomX - 50, h: 650 - splitY },
        { name: "Bathroom", key: "bedroom", x: bedroomX, y: splitY, w: 950 - bedroomX, h: 650 - splitY }
      ],
      walls: [
        [50, 50, 950, 50], [950, 50, 950, 650], [950, 650, 50, 650],
        [50, 50, 50, entryY], [50, entryY + doorWidth, 50, 650],
        [kitchenX, 50, kitchenX, kitchenDoorY],
        [kitchenX, kitchenDoorY + doorWidth, kitchenX, splitY],
        [50, splitY, bedDoorX, splitY],
        [bedDoorX + doorWidth, splitY, bathDoorX, splitY],
        [bathDoorX + doorWidth, splitY, 950, splitY],
        [bedroomX, splitY, bedroomX, 650]
      ],
      doors: [
        { x: 50, y: entryY, r: doorWidth, a: Math.PI / 2, swing: -1 },
        { x: kitchenX, y: kitchenDoorY, r: doorWidth, a: Math.PI / 2, swing: -1 },
        { x: bedDoorX, y: splitY, r: doorWidth, a: 0, swing: 1 },
        { x: bathDoorX, y: splitY, r: doorWidth, a: 0, swing: 1 }
      ]
    };
  }

  const canvas = document.getElementById("glCanvas");
  const wrap = document.getElementById("canvasWrap");
  const labelLayer = document.getElementById("labelLayer");
  const modeLabel = document.getElementById("modeLabel");
  const layoutName = document.getElementById("layoutName");
  const selectionName = document.getElementById("selectionName");
  const labelInput = document.getElementById("labelInput");
  const transformReadout = document.getElementById("transformReadout");
  const savePanel = document.getElementById("savePanel");
  const loadPanel = document.getElementById("loadPanel");
  const savedPlans = document.getElementById("savedPlans");
  const savedPlanMeta = document.getElementById("savedPlanMeta");
  const messageElement = document.getElementById("canvasMessage");

  const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) {
    wrap.innerHTML = '<p style="color:#0c171b;padding:24px">WebGL is not available. Please use a current Chrome, Edge, Firefox, or Safari browser.</p>';
    return;
  }

  const vertexSource = `
    attribute vec2 a_position;
    uniform mat3 u_matrix;
    void main() {
      vec3 position = u_matrix * vec3(a_position, 1.0);
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() { gl_FragColor = u_color; }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
  const colorLocation = gl.getUniformLocation(program, "u_color");
  const buffer = gl.createBuffer();

  const mat3 = {
    projection: (w, h) => [2 / w, 0, 0, 0, -2 / h, 0, -1, 1, 1],
    translation: (x, y) => [1, 0, 0, 0, 1, 0, x, y, 1],
    rotation: (r) => [Math.cos(r), Math.sin(r), 0, -Math.sin(r), Math.cos(r), 0, 0, 0, 1],
    scaling: (x, y) => [x, 0, 0, 0, y, 0, 0, 0, 1],
    multiply: (a, b) => [
      a[0] * b[0] + a[3] * b[1] + a[6] * b[2],
      a[1] * b[0] + a[4] * b[1] + a[7] * b[2],
      a[2] * b[0] + a[5] * b[1] + a[8] * b[2],
      a[0] * b[3] + a[3] * b[4] + a[6] * b[5],
      a[1] * b[3] + a[4] * b[4] + a[7] * b[5],
      a[2] * b[3] + a[5] * b[4] + a[8] * b[5],
      a[0] * b[6] + a[3] * b[7] + a[6] * b[8],
      a[1] * b[6] + a[4] * b[7] + a[7] * b[8],
      a[2] * b[6] + a[5] * b[7] + a[8] * b[8]
    ]
  };

  const compose = (...matrices) => matrices.reduce((a, b) => mat3.multiply(a, b));
  let idCounter = 0;
  function makeItem(type, x = 500, y = 350, label = TYPE_NAMES[type], rotation = 0, scale = 1) {
    idCounter += 1;
    return { id: `${type}-${Date.now()}-${idCounter}`, type, label, x, y, rotation, scale };
  }

  const initialItems = [
    makeItem("sofa", 235, 155, "Living sofa", 0, 0.72),
    makeItem("coffee", 255, 258, "Coffee table", 0, 0.65),
    makeItem("sectional", 125, 280, "Corner seating", 0, 0.50),
    makeItem("dining", 474, 213, "Dining set", 0, 0.78),
    makeItem("bed", 180, 505, "Bedroom bed", 0, 0.82)
  ];

  let state = {
    mode: 0,
    layoutIndex: 0,
    layout: generateLayout(() => 0.5),
    planName: "Ground floor plan",
    items: initialItems,
    selectedId: null,
    dragging: null,
    messageTimer: null
  };

  function currentLayout() {
    return state.layout || layouts[state.layoutIndex];
  }

  function currentView() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const scale = Math.min(width / WORLD.width, height / WORLD.height) * 0.96;
    return { scale, x: (width - WORLD.width * scale) / 2, y: (height - WORLD.height * scale) / 2 };
  }

  function baseMatrix() {
    const v = currentView();
    return compose(
      mat3.projection(canvas.clientWidth, canvas.clientHeight),
      mat3.translation(v.x, v.y),
      mat3.scaling(v.scale, v.scale)
    );
  }

  function objectMatrix(item) {
    return compose(baseMatrix(), mat3.translation(item.x, item.y), mat3.rotation(item.rotation), mat3.scaling(item.scale, item.scale));
  }

  function drawVertices(vertices, mode, color, matrix) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    gl.uniform4fv(colorLocation, color);
    gl.drawArrays(mode, 0, vertices.length / 2);
  }

  function rectVertices(x, y, w, h) {
    return [x,y, x+w,y, x,y+h, x,y+h, x+w,y, x+w,y+h];
  }

  function drawRect(x, y, w, h, color, matrix = baseMatrix()) {
    drawVertices(rectVertices(x, y, w, h), gl.TRIANGLES, color, matrix);
  }

  function drawCircle(cx, cy, radius, color, matrix, segments = 36) {
    const vertices = [cx, cy];
    for (let i = 0; i <= segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;
      vertices.push(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
    drawVertices(vertices, gl.TRIANGLE_FAN, color, matrix);
  }

  function drawSegment(x1, y1, x2, y2, thickness, color, matrix = baseMatrix()) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const m = compose(matrix, mat3.translation(x1, y1), mat3.rotation(angle));
    drawRect(0, -thickness / 2, length, thickness, color, m);
  }

  function drawArc(cx, cy, radius, start, end, color, matrix = baseMatrix()) {
    const vertices = [];
    const steps = 24;
    for (let i = 0; i <= steps; i += 1) {
      const angle = start + ((end - start) * i) / steps;
      vertices.push(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
    drawVertices(vertices, gl.LINE_STRIP, color, matrix);
  }

  function drawFloorPlan() {
    const layout = currentLayout();
    layout.rooms.forEach((room) => drawRect(room.x, room.y, room.w, room.h, ROOM_COLORS[room.key]));
    for (const [x1, y1, x2, y2] of layout.walls) drawSegment(x1, y1, x2, y2, 9, C.wall);
    for (const door of layout.doors) drawDoor(door);
  }

  function drawDoor(door) {
    const openAngle = door.a + (door.swing ?? 1) * Math.PI / 2;
    const ex = door.x + Math.cos(openAngle) * door.r;
    const ey = door.y + Math.sin(openAngle) * door.r;
    drawSegment(door.x, door.y, ex, ey, 3, C.wood);
    drawCircle(door.x, door.y, 3, C.wood, baseMatrix(), 18);
    drawArc(door.x, door.y, door.r, door.a, openAngle, C.wood);
  }

  function drawBed(item) {
    const m = objectMatrix(item);
    drawRect(-70, -105, 140, 210, C.wood, m);
    drawRect(-61, -94, 122, 187, C.linen, m);
    drawRect(-53, -83, 48, 37, [1, 1, 1, 1], m);
    drawRect(5, -83, 48, 37, [1, 1, 1, 1], m);
    drawRect(-35, 39, 70, 54, C.blanket, m);
    drawSegment(-35, 38, 35, 38, 3, C.wood, m);
  }

  function drawSofa(item) {
    const m = objectMatrix(item);
    drawRect(-115, -58, 230, 116, C.textileDark, m);
    drawRect(-96, -39, 192, 78, C.textile, m);
    drawRect(-113, -55, 20, 110, C.textileLight, m);
    drawRect(93, -55, 20, 110, C.textileLight, m);
    drawRect(-93, -55, 186, 20, C.textileLight, m);
    drawSegment(-32, -34, -32, 38, 2, C.textileDark, m);
    drawSegment(32, -34, 32, 38, 2, C.textileDark, m);
  }

  function drawDining(item) {
    const m = objectMatrix(item);
    drawCircle(0, 0, 58, C.woodLight, m, 42);
    drawCircle(0, 0, 48, C.wood, m, 42);
    drawRect(-17, -101, 34, 34, C.chair, m);
    drawRect(-17, 67, 34, 34, C.chair, m);
    drawRect(-101, -17, 34, 34, C.chair, m);
    drawRect(67, -17, 34, 34, C.chair, m);
  }

  function drawCoffee(item) {
    const m = objectMatrix(item);
    drawCircle(0, 0, 52, C.wood, m, 40);
    drawCircle(0, 0, 43, C.woodLight, m, 40);
    drawCircle(-17, -9, 6, C.wood, m, 20);
  }

  function drawSectional(item) {
    const m = objectMatrix(item);
    drawRect(-110, -92, 220, 80, C.textileDark, m);
    drawRect(-110, -12, 86, 104, C.textileDark, m);
    drawRect(-94, -75, 188, 47, C.textile, m);
    drawRect(-94, -28, 54, 104, C.textile, m);
    drawSegment(-30, -75, -30, -28, 2, C.textileLight, m);
    drawSegment(32, -75, 32, -28, 2, C.textileLight, m);
    drawSegment(-94, 18, -40, 18, 2, C.textileLight, m);
  }

  function drawSelection(item) {
    const b = BOUNDS[item.type];
    const m = objectMatrix(item);
    const pad = 7;
    drawSegment(b.x - pad, b.y - pad, b.x + b.w + pad, b.y - pad, 3, C.select, m);
    drawSegment(b.x + b.w + pad, b.y - pad, b.x + b.w + pad, b.y + b.h + pad, 3, C.select, m);
    drawSegment(b.x + b.w + pad, b.y + b.h + pad, b.x - pad, b.y + b.h + pad, 3, C.select, m);
    drawSegment(b.x - pad, b.y + b.h + pad, b.x - pad, b.y - pad, 3, C.select, m);
  }

  function drawItem(item) {
    if (item.type === "bed") drawBed(item);
    if (item.type === "sofa") drawSofa(item);
    if (item.type === "dining") drawDining(item);
    if (item.type === "coffee") drawCoffee(item);
    if (item.type === "sectional") drawSectional(item);
    if (item.id === state.selectedId) drawSelection(item);
  }

  function render() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    gl.clearColor(0.98, 0.98, 0.98, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    drawFloorPlan();
    state.items.forEach(drawItem);
    syncLabels();
  }

  function worldToCanvas(x, y) {
    const v = currentView();
    return { x: v.x + x * v.scale, y: v.y + y * v.scale };
  }

  function eventToWorld(event) {
    const rect = canvas.getBoundingClientRect();
    const v = currentView();
    return {
      x: (event.clientX - rect.left - v.x) / v.scale,
      y: (event.clientY - rect.top - v.y) / v.scale
    };
  }

  function syncLabels() {
    labelLayer.replaceChildren();
    const layout = currentLayout();
    layout.rooms.forEach((room) => {
      const label = document.createElement("span");
      label.className = "room-label";
      label.textContent = room.name;
      const p = worldToCanvas(room.x + room.w / 2, room.y + 25);
      label.style.left = `${p.x}px`;
      label.style.top = `${p.y}px`;
      labelLayer.append(label);
    });
    state.items.forEach((item) => {
      const label = document.createElement("span");
      label.className = `object-label${item.id === state.selectedId ? " selected" : ""}`;
      const coords = state.mode === 2 ? ` · ${Math.round(item.x)}, ${Math.round(item.y)}` : "";
      label.textContent = `${item.label}${coords}`;
      const b = BOUNDS[item.type];
      const halfHeight = (Math.abs(Math.sin(item.rotation)) * b.w + Math.abs(Math.cos(item.rotation)) * b.h) * item.scale / 2;
      const p = worldToCanvas(item.x, item.y - halfHeight - 14);
      label.style.left = `${p.x}px`;
      label.style.top = `${p.y}px`;
      labelLayer.append(label);
    });
  }

  function pickItem(point) {
    for (let i = state.items.length - 1; i >= 0; i -= 1) {
      const item = state.items[i];
      const dx = point.x - item.x;
      const dy = point.y - item.y;
      const c = Math.cos(item.rotation);
      const s = Math.sin(item.rotation);
      const localX = (dx * c + dy * s) / item.scale;
      const localY = (-dx * s + dy * c) / item.scale;
      const b = BOUNDS[item.type];
      if (localX < b.x || localX > b.x + b.w || localY < b.y || localY > b.y + b.h) continue;
      if (item.type === "coffee" && Math.hypot(localX, localY) > 52) continue;
      if (item.type === "sectional" && localY > -12 && localX > -24) continue;
      if (item.type === "dining") {
        const inTable = Math.hypot(localX, localY) <= 58;
        const inChair = (Math.abs(localX) <= 17 && Math.abs(localY) >= 67 && Math.abs(localY) <= 101) ||
          (Math.abs(localY) <= 17 && Math.abs(localX) >= 67 && Math.abs(localX) <= 101);
        if (!inTable && !inChair) continue;
      }
      return item;
    }
    return null;
  }

  function selectedItem() {
    return state.items.find((item) => item.id === state.selectedId) || null;
  }

  function selectItem(item) {
    state.selectedId = item ? item.id : null;
    updateControls();
    render();
  }

  function updateControls() {
    const modes = ["01 · Plan", "02 · Save", "03 · Retrieve"];
    modeLabel.textContent = modes[state.mode];
    layoutName.textContent = state.planName;
    document.getElementById("randomizeButton").disabled = state.mode !== 0;
    document.getElementById("retrievedDetails").hidden = state.mode !== 2;
    document.getElementById("planStatus").textContent = state.items.length + " furniture pieces · " +
      ["Drag to arrange. Press M to save.", "Save mode — furniture editing is paused.", "Retrieve mode — select a saved plan. Press M to edit."][state.mode];
    savePanel.hidden = state.mode !== 1;
    loadPanel.hidden = state.mode !== 2;
    document.getElementById("furnitureSection").hidden = state.mode !== 0;
    document.getElementById("selectionSection").hidden = state.mode !== 0;
    document.querySelectorAll("[data-spawn]").forEach((button) => { button.disabled = state.mode !== 0; });
    const selected = selectedItem();
    const allowTransform = Boolean(selected) && state.mode === 0;
    labelInput.disabled = !allowTransform;
    document.getElementById("rotateLeft").disabled = !allowTransform;
    document.getElementById("rotateRight").disabled = !allowTransform;
    document.getElementById("scaleDown").disabled = !allowTransform;
    document.getElementById("scaleUp").disabled = !allowTransform;
    selectionName.textContent = selected ? TYPE_NAMES[selected.type] : "Select a piece on the plan.";
    labelInput.value = selected ? selected.label : "";
    transformReadout.textContent = selected
      ? `Position ${Math.round(selected.x)}, ${Math.round(selected.y)} · Rotation ${Math.round(selected.rotation * 180 / Math.PI)}° · Scale ${selected.scale.toFixed(2)}×`
      : "Position — · Rotation — · Scale —";
  }

  function announce(text) {
    messageElement.textContent = text;
    messageElement.classList.add("visible");
    window.clearTimeout(state.messageTimer);
    state.messageTimer = window.setTimeout(() => messageElement.classList.remove("visible"), 1800);
  }

  function spawn(type) {
    if (state.mode !== 0 || !TYPE_NAMES[type]) return null;
    const item = makeItem(type, WORLD.width / 2, WORLD.height / 2);
    state.items.push(item);
    selectItem(item);
    announce(`${TYPE_NAMES[type]} added at the plan center`);
    return item;
  }

  function changeRotation(delta) {
    const item = selectedItem();
    if (!item || state.mode !== 0) return;
    item.rotation = (item.rotation + delta) % (Math.PI * 2);
    updateControls();
    render();
  }

  function changeScale(delta) {
    const item = selectedItem();
    if (!item || state.mode !== 0) return;
    item.scale = Math.max(0.5, Math.min(1.8, item.scale + delta));
    updateControls();
    render();
  }

  function cycleMode() {
    state.mode = (state.mode + 1) % 3;
    state.dragging = null;
    canvas.style.cursor = state.mode === 0 ? "crosshair" : "default";
    if (state.mode === 2) {
      refreshSavedPlans();
      renderFurnitureTable();
    }
    updateControls();
    render();
    announce(["Plan mode: edit furniture", "Save mode: name and store the plan", "Retrieve mode: choose a saved plan"][state.mode]);
  }

  function randomizeLayout() {
    if (state.mode !== 0) return;
    const previous = JSON.stringify(currentLayout());
    state.layout = generateLayout();
    // A second draw is enough for the exceptionally unlikely rounded duplicate.
    if (JSON.stringify(state.layout) === previous) state.layout = generateLayout();
    updateControls();
    render();
    announce("Room proportions changed. Rearrange furniture as needed.");
  }

  function renderFurnitureTable() {
    const rows = document.getElementById("furnitureRows");
    rows.replaceChildren();
    state.items.forEach((item) => {
      const tr = document.createElement("tr");
      [item.label, TYPE_NAMES[item.type], item.x.toFixed(1), item.y.toFixed(1),
        (item.rotation * 180 / Math.PI).toFixed(1) + "°", item.scale.toFixed(2) + "×"]
        .forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value;
          tr.append(td);
        });
      rows.append(tr);
    });
  }

  function readPlans() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter((p) => p && typeof p.id === "string" && typeof p.name === "string" && Array.isArray(p.items)) : [];
    } catch {
      return [];
    }
  }

  function writePlans(plans) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      return true;
    } catch {
      announce("Could not save. Browser storage may be full or unavailable.");
      return false;
    }
  }

  function refreshSavedPlans() {
    const plans = readPlans();
    const current = savedPlans.value;
    savedPlans.replaceChildren();
    if (!plans.length) {
      savedPlans.add(new Option("No saved plans", ""));
      savedPlans.disabled = true;
      document.getElementById("loadPlan").disabled = true;
      document.getElementById("deletePlan").disabled = true;
      savedPlanMeta.textContent = "No saved plans yet.";
      return;
    }
    savedPlans.disabled = false;
    plans.forEach((plan) => savedPlans.add(new Option(plan.name, plan.id)));
    savedPlans.value = plans.some((plan) => plan.id === current) ? current : plans[0].id;
    document.getElementById("loadPlan").disabled = false;
    document.getElementById("deletePlan").disabled = false;
    updateSavedPlanMeta();
  }

  function updateSavedPlanMeta() {
    const plan = readPlans().find((entry) => entry.id === savedPlans.value);
    savedPlanMeta.textContent = plan
      ? `${plan.items.length} furniture pieces · ${plan.layout?.name || layouts[plan.layoutIndex]?.name || "Saved layout"}`
      : "No saved plans yet.";
  }

  function saveCurrentPlan() {
    if (state.mode !== 1) return;
    const nameInput = document.getElementById("planName");
    const name = nameInput.value.trim() || `Plan ${readPlans().length + 1}`;
    const plans = readPlans();
    plans.unshift({
      id: `plan-${Date.now()}-${++idCounter}`,
      name,
      savedAt: new Date().toISOString(),
      layoutIndex: state.layoutIndex,
      layout: JSON.parse(JSON.stringify(currentLayout())),
      items: state.items.map((item) => ({ ...item }))
    });
    if (!writePlans(plans)) return;
    state.planName = name;
    refreshSavedPlans();
    savedPlans.value = plans[0].id;
    updateControls();
    announce(`“${name}” saved`);
  }

  function validLayout(layout) {
    return layout && typeof layout.name === "string" &&
      Array.isArray(layout.rooms) && layout.rooms.length > 0 &&
      layout.rooms.every((r) => r && typeof r.name === "string" && Object.hasOwn(ROOM_COLORS, r.key) &&
        [r.x, r.y, r.w, r.h].every(Number.isFinite) && r.w > 0 && r.h > 0) &&
      Array.isArray(layout.walls) &&
      layout.walls.every((w) => Array.isArray(w) && w.length === 4 && w.every(Number.isFinite)) &&
      Array.isArray(layout.doors) &&
      layout.doors.every((d) => d && [d.x, d.y, d.r, d.a].every(Number.isFinite) && d.r > 0 &&
        (d.swing === undefined || d.swing === 1 || d.swing === -1));
  }

  function loadSelectedPlan() {
    if (state.mode !== 2) return;
    const plan = readPlans().find((entry) => entry.id === savedPlans.value);
    if (!plan) return;
    const layout = plan.layout || layouts[plan.layoutIndex];
    const validItems = plan.items.every((item) => item && Object.hasOwn(TYPE_NAMES, item.type) &&
      typeof item.label === "string" &&
      [item.x, item.y, item.rotation, item.scale].every(Number.isFinite) &&
      item.scale >= 0.5 && item.scale <= 1.8);
    if (!validLayout(layout) || !validItems) {
      announce("This saved plan is invalid. The current plan has been kept.");
      return;
    }
    state.layout = JSON.parse(JSON.stringify(layout));
    state.planName = plan.name;
    document.getElementById("planName").value = plan.name;
    state.items = plan.items.map((item) => ({ ...item, id: makeItem(item.type).id }));
    state.selectedId = null;
    state.dragging = null;
    renderFurnitureTable();
    updateControls();
    render();
    announce(`“${plan.name}” rendered with labels and positions`);
  }

  function deleteSelectedPlan() {
    if (state.mode !== 2) return;
    const plans = readPlans();
    const plan = plans.find((entry) => entry.id === savedPlans.value);
    if (!plan) return;
    if (!window.confirm(`Delete saved plan “${plan.name}”?`)) return;
    if (!writePlans(plans.filter((entry) => entry.id !== plan.id))) return;
    refreshSavedPlans();
    announce(`“${plan.name}” deleted`);
  }

  canvas.addEventListener("pointerdown", (event) => {
    canvas.focus({ preventScroll: true });
    if (state.mode !== 0 || event.button !== 0) return;
    const point = eventToWorld(event);
    const item = pickItem(point);
    selectItem(item);
    if (item) {
      state.dragging = { id: item.id, dx: point.x - item.x, dy: point.y - item.y };
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || state.mode !== 0) return;
    const item = selectedItem();
    if (!item) return;
    const point = eventToWorld(event);
    item.x = Math.max(55, Math.min(945, point.x - state.dragging.dx));
    item.y = Math.max(55, Math.min(645, point.y - state.dragging.dy));
    updateControls();
    render();
  });

  const endDrag = () => {
    state.dragging = null;
    canvas.style.cursor = "crosshair";
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("lostpointercapture", endDrag);

  canvas.addEventListener("wheel", (event) => {
    if (!selectedItem() || state.mode !== 0) return;
    event.preventDefault();
    if (event.shiftKey) changeScale(event.deltaY > 0 ? -0.05 : 0.05);
    else changeRotation(event.deltaY > 0 ? Math.PI / 36 : -Math.PI / 36);
  }, { passive: false });

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const editingText = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement;
    if (editingText && event.key === "Escape") {
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      return;
    }
    if (event.key === "m" || event.key === "M") {
      if (!editingText && !event.repeat) { event.preventDefault(); cycleMode(); }
      return;
    }
    if (editingText) return;
    if ((event.key === "g" || event.key === "G") && !event.repeat) randomizeLayout();
    if (event.key === "Escape") selectItem(null);
    if ((event.key === "Delete" || event.key === "Backspace") && state.mode === 0 && state.selectedId) {
      event.preventDefault();
      state.items = state.items.filter((item) => item.id !== state.selectedId);
      selectItem(null);
      announce("Furniture piece removed");
    }
    if (event.key === "ArrowLeft") { event.preventDefault(); changeRotation(-Math.PI / 12); }
    if (event.key === "ArrowRight") { event.preventDefault(); changeRotation(Math.PI / 12); }
    if (event.key === "ArrowUp") { event.preventDefault(); changeScale(0.05); }
    if (event.key === "ArrowDown") { event.preventDefault(); changeScale(-0.05); }
  });

  document.querySelectorAll("[data-spawn]").forEach((button) => button.addEventListener("click", () => spawn(button.dataset.spawn)));
  document.getElementById("randomizeButton").addEventListener("click", randomizeLayout);
  document.getElementById("rotateLeft").addEventListener("click", () => changeRotation(-Math.PI / 12));
  document.getElementById("rotateRight").addEventListener("click", () => changeRotation(Math.PI / 12));
  document.getElementById("scaleDown").addEventListener("click", () => changeScale(-0.05));
  document.getElementById("scaleUp").addEventListener("click", () => changeScale(0.05));
  labelInput.addEventListener("input", () => {
    const item = selectedItem();
    if (!item || state.mode !== 0) return;
    item.label = labelInput.value || TYPE_NAMES[item.type];
    render();
  });
  document.getElementById("savePlan").addEventListener("click", saveCurrentPlan);
  document.getElementById("loadPlan").addEventListener("click", loadSelectedPlan);
  document.getElementById("deletePlan").addEventListener("click", deleteSelectedPlan);
  savedPlans.addEventListener("change", updateSavedPlanMeta);

  function registerWebMcpTools() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const controller = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: "add_furniture",
        title: "Add furniture",
        description: "Add one supported furniture piece to the center of the visible floor plan and select it.",
        inputSchema: {
          type: "object",
          properties: { type: { type: "string", enum: Object.keys(TYPE_NAMES) } },
          required: ["type"],
          additionalProperties: false
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          if (!input || !TYPE_NAMES[input.type]) throw new Error("Unsupported furniture type");
          if (state.mode !== 0) throw new Error("Switch to Plan mode before adding furniture");
          const item = spawn(input.type);
          return { id: item.id, type: item.type, position: { x: item.x, y: item.y } };
        }
      }, { signal: controller.signal })).catch(() => {});
    } catch { /* WebMCP is optional in browsers without the proposal. */ }
  }

  new ResizeObserver(render).observe(wrap);
  refreshSavedPlans();
  updateControls();
  render();
  registerWebMcpTools();
})();
