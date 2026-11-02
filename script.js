import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection, deleteDoc, doc, getDoc, onSnapshot,
  runTransaction, serverTimestamp, setDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const $ = selector => document.querySelector(selector);

/* CONFIGURACIÓN DE PROPIEDADES */

const COLORS = {
  green: {
    name: "FÁCIL · $100", color: "#32965c", time: 15,
    rent: 30, price: 100, symbol: "+"
  },
  blue: {
    name: "NORMAL · $200", color: "#397fc9", time: 25,
    rent: 60, price: 200, symbol: "÷"
  },
  purple: {
    name: "ELEVADA · $350", color: "#9253c5", time: 60,
    rent: 105, price: 350, symbol: "√"
  },
  red: {
    name: "MUY DIFÍCIL · $500", color: "#d9434c", time: 120,
    rent: 150, price: 500, symbol: "∫"
  }
};

/* ANIMALES Y COLORES DE JUGADOR */

const ANIMALS = [
  {name:"Pingüino",emoji:"🐧",color:"#7DD3FC"},
  {name:"Cocodrilo",emoji:"🐊",color:"#10B981"},
  {name:"Perezoso",emoji:"🦥",color:"#A87952"},
  {name:"Perro",emoji:"🐕",color:"#E8B84B"},
  {name:"Gato",emoji:"🐈",color:"#B8C0CC"},
  {name:"Oso",emoji:"🐻",color:"#F28C45"},
  {name:"Rana",emoji:"🐸",color:"#A3D948"},
  {name:"Pez",emoji:"🐟",color:"#35C6C8"}
];

/* EJERCICIOS */

const QUESTIONS = {
  green: [
    {q:"18 × 4 = ?",a:"72"},
    {q:"12 × 7 = ?",a:"84"},
    {q:"144 ÷ 12 = ?",a:"12"},
    {q:"96 ÷ 8 = ?",a:"12"},
    {q:"15% de 200 = ?",a:"30"},
    {q:"25% de 80 = ?",a:"20"},
    {q:"30% de 150 = ?",a:"45"},
    {q:"9 × 13 = ?",a:"117"},
    {q:"180 ÷ 9 = ?",a:"20"},
    {q:"20% de 350 = ?",a:"70"},
    {q:"14 × 5 = ?",a:"70"},
    {q:"120 ÷ 6 = ?",a:"20"},
    {q:"10% de 350 = ?",a:"35"},
    {q:"16 × 4 = ?",a:"64"},
    {q:"84 ÷ 7 = ?",a:"12"}
  ],

  blue: [
    {q:"5! = ?",a:"120"},
    {q:"4! = ?",a:"24"},
    {q:"6! = ?",a:"720"},
    {q:"√144 = ?",a:"12"},
    {q:"√225 = ?",a:"15"},
    {q:"√324 = ?",a:"18"},
    {q:"125 × 24 = ?",a:"3000"},
    {q:"36 × 48 = ?",a:"1728"},
    {q:"125 × 16 = ?",a:"2000"},
    {q:"1/2 + 1/4 = ?",a:"3/4"},
    {q:"3/4 + 1/2 = ?",a:"5/4"},
    {q:"2/3 de 90 = ?",a:"60"},
    {q:"5/8 de 80 = ?",a:"50"},
    {q:"7! = ?",a:"5040"}
  ],

  purple: [
    {q:"2x² = 50. ¿x positivo = ?",a:"5"},
    {q:"Si f(x) = 3x − 2, f(7) = ?",a:"19"},
    {q:"√196 + 3² = ?",a:"23"},
    {q:"5x + 8 = 3x + 22. ¿x = ?",a:"7"},
    {q:"Factoriza x² − 9. Primer factor:",a:"x-3"},
    {q:"3² + 4² = ?",a:"25"}
  ],

  red: [
    {q:"x² − 5x + 6 = 0. Raíz mayor:",a:"3"},
    {q:"2ˣ = 32. ¿x = ?",a:"5"},
    {q:"Derivada de x³:",a:"3x^2"},
    {q:"log₁₀(1000) = ?",a:"3"},
    {q:"3(x − 2) = 2x + 7. ¿x = ?",a:"13"},
    {q:"x² = 121. Raíz positiva:",a:"11"}
  ]
};

/* DISTRIBUCIÓN DE LAS 32 PROPIEDADES */

const propertyTypes = [
  "green","blue","green","purple","blue","green","red","purple",
  "green","blue","purple","green","red","blue","green","purple",
  "blue","green","red","purple","blue","green","purple","red",
  "green","blue","purple","green","red","blue","green","purple"
];

/* LAS 20 CARTAS SORPRESA */

const SURPRISE_CARDS = [
  {
    title:"Fortuna inesperada",
    description:"Has encontrado dinero. Recibes $100.",
    effect:"money",value:100
  },
  {
    title:"Pequeña recompensa",
    description:"Recibes una recompensa de $50.",
    effect:"money",value:50
  },
  {
    title:"Premio matemático",
    description:"Tu esfuerzo tiene recompensa. Recibes $100.",
    effect:"money",value:100
  },
  {
    title:"Beca académica",
    description:"Has conseguido una beca de $100.",
    effect:"money",value:100
  },
  {
    title:"Inversión exitosa",
    description:"Una inversión salió bien. Recibes $100.",
    effect:"money",value:100
  },
  {
    title:"Avance extraordinario",
    description:"Avanza tres casillas. ¡Aprovecha tu suerte!",
    effect:"move",value:3
  },
  {
    title:"Viaje gratuito",
    description:"Avanza cinco casillas.",
    effect:"move",value:5
  },
  {
    title:"Segunda oportunidad",
    description:"Tu próxima respuesta incorrecta en un reto con penalización no te hará perder dinero.",
    effect:"mistakeShield"
  },
  {
    title:"Protección financiera",
    description:"No tendrás que pagar el próximo alquiler que te corresponda.",
    effect:"rentShield"
  },
  {
    title:"Impulso económico",
    description:"Recibes $50 por cada propiedad que tengas, hasta un máximo de $200.",
    effect:"perProperty",value:50
  },
  {
    title:"Bono de salida",
    description:"La próxima vez que pases por Inicio recibirás $100 adicionales.",
    effect:"startBonus",value:100
  },
  {
    title:"Robo",
    description:"Has perdido $50.",
    effect:"loss",value:50
  },
  {
    title:"Multa",
    description:"Debes pagar una multa de $100.",
    effect:"loss",value:100
  },
  {
    title:"Reparaciones",
    description:"Paga $50 por cada propiedad que tengas, hasta un máximo de $200.",
    effect:"propertyLoss",value:50
  },
  {
    title:"Detención inesperada",
    description:"La policía te ha detenido. Ve directamente a la cárcel y resuelve un ejercicio para salir.",
    effect:"goToJail"
  },
  {
    title:"Impuestos",
    description:"Debes pagar $100 en impuestos.",
    effect:"loss",value:100
  },
  {
    title:"Retroceso",
    description:"Retrocede tres casillas.",
    effect:"move",value:-3
  },
  {
    title:"Intercambio",
    description:"Puedes proponer un intercambio de propiedades a otro jugador. Ambos deben aceptar.",
    effect:"trade"
  },
  {
    title:"Negociador",
    description:"Elige una propiedad rival. La próxima vez que caigas en ella pagarás la mitad del alquiler.",
    effect:"discount"
  },
  {
    title:"Ventaja matemática",
    description:"Tu próximo ejercicio tendrá 15 segundos adicionales.",
    effect:"extraTime",value:15
  }
];

/* VARIABLES DE LA PARTIDA */

let spaces = [];
let players = [];
let currentPlayer = 0;
let round = 1;
let started = false;
let gameOver = false;
let selectedSetupPlayer = 0;
let challenge = null;
let timerInterval = null;
let toastTimeout = null;
let isMoving = false;
let isRollingDice = false;
let playerRollPending = false;
let surpriseDeck = [];

/* MULTIJUGADOR: ADMINISTRADOR Y CUATRO JUGADORES */
let appMode = "admin";
let currentUid = null;
let roomCode = null;
let roomRef = null;
let roomUnsubscribe = null;
let rosterUnsubscribe = null;
let rollRequestsUnsubscribe = null;
let roomRoster = [];
let selectedPlayerAnimal = null;
let myPlayerProfile = null;
let roomSaveTimeout = null;
let isApplyingRemoteState = false;
let invitationUrl = "";

/* FUNCIONES GENERALES */

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function shuffleSurpriseDeck() {
  surpriseDeck = shuffleArray(SURPRISE_CARDS);
}

function drawSurpriseCard() {
  if (surpriseDeck.length === 0) {
    shuffleSurpriseDeck();
    addLog("El mazo sorpresa se ha mezclado nuevamente.");
  }

  return surpriseDeck.pop();
}

function randomQuestion(difficulty) {
  const list = QUESTIONS[difficulty];
  return list[Math.floor(Math.random() * list.length)];
}

function randomPrisonQuestion() {
  const difficulty = Math.random() < 0.5 ? "green" : "blue";

  return {
    difficulty,
    question: randomQuestion(difficulty)
  };
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2,"0")}:${String(remaining).padStart(2,"0")}`;
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase()
    .replace(/\s+/g,"")
    .replace(/−/g,"-")
    .replace(/²/g,"^2");
}/* ELIMINACIÓN Y VICTORIA */

function eliminatePlayer(player) {
  if (!player || player.eliminated) return;

  player.money = 0;
  player.eliminated = true;
  player.inJail = false;
  player.skipNext = false;

  const playerIndex = players.indexOf(player);

  spaces.forEach(space => {
    if (space.owner === playerIndex) {
      space.owner = null;
    }
  });

  addLog(
    `${player.name} no pudo pagar una obligación y queda eliminado. Sus propiedades regresan al banco.`
  );

  renderTokens();
  renderPlayers();
  checkWinner();
}

function checkWinner() {
  if (!started || gameOver) return;

  const remaining = players.filter(player => !player.eliminated);

  if (remaining.length <= 1) {
    gameOver = true;

    const winner = remaining[0];

    $("#rollBtn").disabled = true;
    $("#rollHelp").textContent = winner
      ? `${winner.name} es el ganador de la partida.`
      : "La partida ha terminado.";

    $("#centerStatus").textContent = winner
      ? `GANADOR: ${winner.name.toUpperCase()}`
      : "PARTIDA FINALIZADA";

    $("#turnLabel").textContent = "PARTIDA TERMINADA";

    if (winner) {
      addLog(`¡${winner.name} ha ganado la partida!`);
      showToast(`¡${winner.name} es el ganador!`);
    }

    renderPlayers();
    renderTokens();
  }
}

/* COBROS Y DEUDAS */

function chargePlayer(player, amount) {
  if (!player || player.eliminated) return 0;

  amount = Math.max(0, amount);

  if (player.money >= amount) {
    player.money -= amount;
    return amount;
  }

  const paid = player.money;
  player.money = 0;

  return paid;
}

function settleDebt(player, amount) {
  const hadEnoughMoney = player.money >= amount;
  const paid = chargePlayer(player, amount);

  if (!hadEnoughMoney) {
    eliminatePlayer(player);
  }

  return paid;
}

/* CREAR TABLERO */

function createSpaces() {
  const coordinates = [];

  for (let col = 1; col <= 11; col++) coordinates.push([1,col]);
  for (let row = 2; row <= 11; row++) coordinates.push([row,11]);
  for (let col = 10; col >= 1; col--) coordinates.push([11,col]);
  for (let row = 10; row >= 2; row--) coordinates.push([row,1]);

  const surprises = new Set([4,14,24,34,37]);

  // DISTRIBUCIÓN FIJA DE LAS PROPIEDADES
  // Ya no se mezclan al recargar o reiniciar la página.
  const shuffled = [...propertyTypes];
  let propertyIndex = 0;

  spaces = coordinates.map(([row,col],index) => {
    const base = {
      index,row,col,owner:null,
      type:"property",difficulty:null,
      symbol:"",price:0
    };

    if (index === 0) {
      return {...base,type:"start",symbol:"⌂"};
    }

    if (index === 10) {
      return {...base,type:"prison",symbol:"▤"};
    }

    if (index === 30) {
      return {...base,type:"police",symbol:"♜"};
    }

    if (surprises.has(index)) {
      return {...base,type:"surprise",symbol:"✧"};
    }

    const difficulty = shuffled[propertyIndex++];

    return {
      ...base,
      difficulty,
      symbol: COLORS[difficulty].symbol,
      price: COLORS[difficulty].price
    };
  });
}

function renderBoard() {
  const board = $("#board");
  board.querySelectorAll(".space").forEach(el => el.remove());

  spaces.forEach(space => {
    const cell = document.createElement("div");
    cell.className = `space ${space.type} ${space.difficulty || ""}`;
    cell.style.gridRow = space.row;
    cell.style.gridColumn = space.col;
    cell.dataset.index = space.index;

    const band = document.createElement("span");
    band.className = "space-band";
    band.style.background = space.difficulty
      ? COLORS[space.difficulty].color
      : space.type === "surprise" ? "#a77bd1" : "#a88d5c";

    const symbol = document.createElement("span");
    symbol.className = "space-symbol";
    symbol.textContent = space.symbol;

    const tokens = document.createElement("span");
    tokens.className = "tokens";
    tokens.dataset.tokens = space.index;

    cell.append(band,symbol,tokens);

    const meta = document.createElement("div");
    meta.className = "space-meta";

    if (space.type === "property") {
      const price = document.createElement("span");
      price.className = "space-price";
      price.textContent = `$${space.price}`;
      meta.append(price);
    }

    const number = document.createElement("span");
    number.className = "space-index";
    number.textContent = String(space.index);

    meta.append(number);
    cell.append(meta);

    board.append(cell);
  });

  renderTokens();
}

/* CREAR JUGADORES */

function createPlayers() {
  players = Array.from({length:4},(_,index) => ({
    name: `Jugador ${index+1}`,
    animal: null,
    money: 1000,
    position: 0,
    skipNext: false,
    inJail: false,
    eliminated: false,
    mistakeShield: false,
    rentShield: false,
    startBonus: 0,
    extraTime: 0,
    discountTarget: null
  }));
}

/* SELECCIÓN DE ANIMALES */

function renderSetup() {
  const tabs = $("#playerTabs");
  const grid = $("#animalGrid");

  tabs.innerHTML = "";
  grid.innerHTML = "";

  players.forEach((player,index) => {
    const tab = document.createElement("button");
    tab.className = "player-tab";
    tab.textContent = `Jugador ${index+1}`;

    if (selectedSetupPlayer === index) tab.classList.add("active");
    if (player.animal) tab.classList.add("done");

    tab.addEventListener("click",() => {
      selectedSetupPlayer = index;
      renderSetup();
    });

    tabs.append(tab);
  });

  ANIMALS.forEach(animal => {
    const taken = players.some((player,index) =>
      index !== selectedSetupPlayer &&
      player.animal?.name === animal.name
    );

    const button = document.createElement("button");
    button.className = "animal-option";
    button.style.setProperty("--animal-color",animal.color);

    if (players[selectedSetupPlayer].animal?.name === animal.name) {
      button.classList.add("selected");
    }

    if (taken) {
      button.classList.add("taken");
      button.disabled = true;
    }

    const emoji = document.createElement("span");
    emoji.className = "animal-emoji";
    emoji.textContent = animal.emoji;

    const labelRow = document.createElement("span");
    labelRow.className = "animal-label-row";

    const dot = document.createElement("span");
    dot.className = "animal-color-dot";

    const label = document.createElement("span");
    label.textContent = animal.name;

    labelRow.append(dot,label);
    button.append(emoji,labelRow);

    button.addEventListener("click",() => {
      players[selectedSetupPlayer].animal = animal;
      renderSetup();
      renderPlayers();
    });

    grid.append(button);
  });

  const selected = players[selectedSetupPlayer];

  $("#selectionStatus").textContent = selected.animal
    ? `Jugador ${selectedSetupPlayer+1}: ${selected.animal.name}`
    : `Jugador ${selectedSetupPlayer+1}: elige una ficha`;

  $("#startBtn").disabled = !players.every(player => player.animal);
}

/* JUGADORES Y PROPIEDADES */

function renderPlayers() {
  const list = $("#playersList");
  list.innerHTML = "";

  players.forEach((player,index) => {
    const row = document.createElement("div");
    row.className = "player-row";

    if (started && index === currentPlayer && !player.eliminated) {
      row.classList.add("active");
    }

    if (player.eliminated) {
      row.classList.add("eliminated");
    }

    const avatar = document.createElement("div");
    avatar.className = "player-avatar";
    avatar.textContent = player.animal?.emoji || "?";
    avatar.style.setProperty(
      "--player-color",
      player.animal?.color || "#363841"
    );

    const details = document.createElement("div");

    const name = document.createElement("div");
    name.className = "player-name";
    name.textContent = player.name;

    if (started && index === currentPlayer && !player.eliminated) {
      const chip = document.createElement("span");
      chip.className = "turn-chip";
      chip.textContent = "TURNO";
      name.append(chip);
    }

    const subtitle = document.createElement("div");
    subtitle.className = "player-sub";

    subtitle.textContent = player.eliminated
      ? "ELIMINADO"
      : `${player.animal?.name || "Sin ficha"} · Casilla ${player.position}`;

    details.append(name,subtitle);

    const money = document.createElement("div");
    money.className = "player-money";
    money.textContent = `$${player.money}`;

    const small = document.createElement("small");
    small.textContent = player.eliminated ? "ELIMINADO" : "SALDO";
    money.append(small);

    row.append(avatar,details,money);
    list.append(row);
  });

  renderMyProperties();
  scheduleRoomSync();
}

function renderMyProperties() {
  const list = $("#myPropertiesList");
  const label = $("#propertyOwnerLabel");
  const count = $("#propertyCount");

  if (!list || !label || !count) return;

  const player = players[currentPlayer];

  if (!player) {
    list.innerHTML = '<p class="property-empty">Aún no hay jugadores.</p>';
    return;
  }

  const owned = spaces.filter(space => space.owner === currentPlayer);

  label.textContent = `Propiedades de ${player.name}`;
  count.textContent = `${owned.length} PROPIEDAD${owned.length===1?"":"ES"}`;

  list.innerHTML = "";

  if (owned.length === 0) {
    list.innerHTML = '<p class="property-empty">Aún no tienes propiedades.</p>';
    return;
  }

  owned.forEach(space => {
    const type = COLORS[space.difficulty];

    const card = document.createElement("div");
    card.className = "property-card";

    const symbol = document.createElement("div");
    symbol.className = "property-card-symbol";
    symbol.style.setProperty("--property-color",type.color);
    symbol.textContent = space.symbol;

    const info = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = `Casilla ${space.index}`;

    const details = document.createElement("small");
    details.textContent = `${type.name} · Alquiler $${type.rent}`;

    info.append(title,details);

    const price = document.createElement("div");
    price.className = "property-card-price";
    price.textContent = `$${space.price}`;

    card.append(symbol,info,price);
    list.append(card);
  });
}

function renderTokens() {
  document.querySelectorAll(".tokens").forEach(el => {
    el.innerHTML = "";
  });

  players.forEach(player => {
    if (player.eliminated) return;

    const holder = document.querySelector(
      `.tokens[data-tokens="${player.position}"]`
    );

    if (!holder || !player.animal) return;

    const token = document.createElement("span");
    token.className = "token-mini";
    token.textContent = player.animal.emoji;
    token.title = player.name;

    token.style.color = player.animal.color;
    token.style.textShadow = `0 0 8px ${player.animal.color}`;

    holder.append(token);
  });

  spaces.forEach(space => {
    const cell = document.querySelector(
      `.space[data-index="${space.index}"]`
    );

    if (!cell) return;

    cell.querySelector(".owner-mark")?.remove();

    if (space.owner !== null) {
      const mark = document.createElement("span");
      mark.className = "owner-mark";
      mark.title = `Propiedad de ${players[space.owner].name}`;
      mark.style.background = players[space.owner].animal.color;
      cell.append(mark);
    }
  });

  scheduleRoomSync();
}

/* HISTORIAL Y AVISOS */

function addLog(message) {
  const list = $("#logList");
  list.querySelector(".empty-log")?.remove();

  const entry = document.createElement("div");
  entry.className = "log-entry";

  const dot = document.createElement("span");
  dot.className = "log-dot";

  const text = document.createElement("span");
  text.textContent = message;

  entry.append(dot,text);
  list.prepend(entry);

  while (list.children.length > 6) {
    list.lastElementChild.remove();
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  },2300);
}/* INICIAR PARTIDA */

async function startGame() {
  if (appMode !== "admin" || !roomRef) return;

  if (roomRoster.length !== 4) {
    showToast("Necesitas cuatro jugadores para iniciar.");
    return;
  }

  players = [...roomRoster]
    .sort((a,b) => a.seat - b.seat)
    .map(profile => ({
      uid: profile.uid,
      name: profile.name,
      animal: profile.animal,
      money: 1000,
      position: 0,
      skipNext: false,
      inJail: false,
      eliminated: false,
      mistakeShield: false,
      rentShield: false,
      startBonus: 0,
      extraTime: 0,
      discountTarget: null
    }));

  started = true;
  gameOver = false;
  currentPlayer = 0;
  round = 1;
  createSpaces();
  shuffleSurpriseDeck();

  $("#adminHomePanel").classList.add("hidden");
  $("#gameLayout").classList.remove("hidden");
  $("#setupPanel").classList.add("hidden");
  $("#resetBtn").hidden = false;
  $("#rollBtn").hidden = true;
  $("#rollBtn").disabled = true;
  $("#rollHelp").textContent = "Cada jugador lanza los dados desde su propio dispositivo.";
  $("#centerStatus").textContent = "LA PARTIDA ESTÁ EN CURSO";
  $("#topRoomLabel").textContent = `SALA ${roomCode}`;

  addLog("La partida ha comenzado. Los cuatro jugadores reciben $1.000.");
  renderBoard();
  updateTurnLabel();
  renderPlayers();
  renderTokens();

  try {
    await updateDoc(roomRef, {
      status: "playing",
      gameState: buildGameState(),
      startedAt: serverTimestamp(),
      updatedAt: Date.now()
    });
    showToast("Partida iniciada. Los celulares ya pueden verla.");
  } catch (error) {
    console.error("No se pudo iniciar la partida en Firestore:", error);
    showToast("No se pudo guardar el inicio. Revisa las reglas de Firestore.");
  }
}

/* DADOS Y MOVIMIENTO */

function rollDice() {
  if (appMode !== "admin" || !started || gameOver || challenge || isMoving || isRollingDice) return;

  const player = players[currentPlayer];

  if (player.eliminated) {
    nextTurn();
    return;
  }

  if (player.skipNext) {
    player.skipNext = false;
    player.inJail = false;

    addLog(`${player.name} pierde este turno por estar detenido.`);
    showToast(`${player.name} pierde su turno.`);

    nextTurn();
    return;
  }

  isRollingDice = true;

  const d1 = 1 + Math.floor(Math.random()*6);
  const d2 = 1 + Math.floor(Math.random()*6);
  const total = d1+d2;

  $("#rollBtn").disabled = true;
  $("#dieOne").classList.add("rolling");
  $("#dieTwo").classList.add("rolling");
  $("#diceMessage").textContent = "Los dados están rodando...";

  setTimeout(() => {
    $("#dieOne").classList.remove("rolling");
    $("#dieTwo").classList.remove("rolling");

    $("#dieOne").dataset.value = d1;
    $("#dieTwo").dataset.value = d2;

    $("#diceMessage").textContent = `${d1} + ${d2} casillas`;
    $("#diceTotal").textContent = total;

    isRollingDice = false;
    movePlayer(total);
  },650);
}

async function movePlayer(steps) {
  if (isMoving || gameOver) return;

  isMoving = true;

  const player = players[currentPlayer];

  if (!player || player.eliminated) {
    isMoving = false;
    nextTurn();
    return;
  }

  const direction = steps >= 0 ? 1 : -1;
  const count = Math.abs(steps);

  let passedStart = false;

  for (let step = 0; step < count; step++) {
    const next = (player.position+direction+40)%40;

    if (direction === 1 && next === 0) {
      passedStart = true;
    }

    player.position = next;

    renderTokens();
    renderPlayers();

    const cell = document.querySelector(
      `.space[data-index="${next}"]`
    );

    cell?.classList.add("moving-to");

    await new Promise(resolve => setTimeout(resolve,280));

    cell?.classList.remove("moving-to");
  }

  if (passedStart) {
    const bonus = 200 + player.startBonus;
    player.money += bonus;

    addLog(`${player.name} pasó por Inicio y recibió $${bonus}.`);

    player.startBonus = 0;
  }

  isMoving = false;

  const space = spaces[player.position];

  addLog(`${player.name} llegó a la casilla ${space.index}.`);

  renderPlayers();
  renderTokens();

  if (space.type === "property") {
    landOnProperty(space,player);

  } else if (space.type === "police") {
    sendPlayerToJail(player,"police");

  } else if (space.type === "prison") {
    // Caer en la casilla 10 significa estar de visita.
    // No se pierde el turno ni se realiza un ejercicio.
    player.inJail = false;

    addLog(`${player.name} está de visita en la cárcel.`);
    showToast("Estás de visita. Tu turno continúa normalmente.");

    nextTurn();

  } else if (space.type === "surprise") {
    openSurprise();

  } else {
    showToast("Has llegado a Inicio.");
    nextTurn();
  }
}

/* TURNOS */

function updateTurnLabel() {
  if (gameOver) {
    $("#turnLabel").textContent = "PARTIDA TERMINADA";
    return;
  }

  $("#turnLabel").textContent = started
    ? `TURNO DE ${players[currentPlayer].name.toUpperCase()}`
    : "PREPARANDO PARTIDA";
}

function nextTurn() {
  if (!started || gameOver) return;

  const previousPlayer = currentPlayer;
  let found = false;

  for (let i = 1; i <= players.length; i++) {
    const candidate = (previousPlayer+i)%players.length;

    if (!players[candidate].eliminated) {
      if (candidate <= previousPlayer) {
        round++;
      }

      currentPlayer = candidate;
      found = true;
      break;
    }
  }

  if (!found) {
    checkWinner();
    return;
  }

  $("#roundNumber").textContent = String(round).padStart(2,"0");
  $("#roundNumberMobile").textContent = String(round).padStart(2,"0");

  updateTurnLabel();
  renderPlayers();
  renderTokens();

  $("#rollBtn").disabled = gameOver;
  $("#rollHelp").textContent = gameOver
    ? "La partida ha terminado."
    : "Lanza los dados para avanzar.";
}

/* SISTEMA DE EJERCICIOS */

function openChallenge(options) {
  clearInterval(timerInterval);

  challenge = {...options,answered:false};

  const player = players[currentPlayer];

  let timeLeft = options.time+(player.extraTime||0);
  player.extraTime = 0;

  $("#modalCategory").textContent = options.category;
  $("#modalTitle").textContent = options.title;
  $("#modalDescription").textContent = options.description;
  $("#modalSymbol").textContent = options.symbol||"∑";
  $("#questionText").textContent = options.question.q;
  $("#timerText").textContent = formatTime(timeLeft);
  $("#modalFeedback").textContent = "";
  $("#modalFeedback").className = "feedback";

  $("#modalActions").innerHTML = "";
  $("#timerBox").classList.remove("hidden");
  $("#questionBox").classList.remove("hidden");
  $("#answerForm").classList.remove("hidden");

  $("#answerInput").value = "";
  $("#answerInput").disabled = false;

  $("#modalBackdrop").classList.remove("hidden");
  $("#rollBtn").disabled = true;

  timerInterval = setInterval(() => {
    if (!challenge || challenge.answered) return;

    timeLeft--;

    $("#timerText").textContent = formatTime(Math.max(0,timeLeft));

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      resolveAnswer(false,true);
    }
  },1000);

  setTimeout(() => $("#answerInput").focus(),100);
}

function submitAnswer(event) {
  event.preventDefault();

  if (!challenge || challenge.answered) return;

  const correct =
    normalizeAnswer($("#answerInput").value) ===
    normalizeAnswer(challenge.question.a);

  resolveAnswer(correct,false);
}

function addModalButton(label,callback,primary=false) {
  const button = document.createElement("button");

  button.className = primary
    ? "primary-button compact"
    : "secondary-button";

  button.textContent = label;
  button.addEventListener("click",callback);

  $("#modalActions").append(button);
}

function resolveAnswer(correct,timedOut) {
  if (!challenge || challenge.answered) return;

  clearInterval(timerInterval);

  challenge.answered = true;
  $("#answerInput").disabled = true;
  $("#answerForm").classList.add("hidden");

  const c = challenge;
  const player = players[currentPlayer];

  $("#modalFeedback").textContent = correct
    ? "¡Correcto! Has resuelto el ejercicio."
    : `Respuesta incorrecta. ${timedOut?"Se acabó el tiempo. ":""}Respuesta: ${c.question.a}`;

  $("#modalFeedback").className = correct
    ? "feedback"
    : "feedback bad";

  $("#modalActions").innerHTML = "";

  // Cada ejercicio correcto concede $50.
  if (correct) {
    player.money += 50;
    addLog(`${player.name} respondió correctamente y recibió $50.`);
  }

  if (c.kind === "property") {
    handlePropertyAnswer(c,player,correct);

  } else if (c.kind === "owned") {
    handleOwnedAnswer(c,player,correct);

  } else if (c.kind === "prison") {
    if (correct) {
      player.inJail = false;

      $("#modalDescription").textContent =
        "¡Has resuelto el reto! Recibiste $50 y puedes salir de la cárcel.";

      addModalButton("Salir de la cárcel",finishChallenge,true);

    } else {
      player.inJail = true;
      player.skipNext = true;

      $("#modalDescription").textContent =
        "No has logrado salir. Perderás tu próximo turno.";

      addModalButton("Aceptar",finishChallenge,true);
    }

  } else if (c.kind === "rentChallenge") {
    handleRentChallenge(c,player,correct);
  }

  renderPlayers();
  renderTokens();
}/* PROPIEDADES */

function landOnProperty(space,player) {
  const color = COLORS[space.difficulty];

  if (space.owner === null) {
    openChallenge({
      kind:"property",
      category:`PROPIEDAD · ${color.name}`,
      title:"Oportunidad de compra",
      description:`Resuelve el ejercicio para poder comprar esta propiedad por $${space.price}.`,
      symbol:color.symbol,
      time:color.time,
      question:randomQuestion(space.difficulty),
      space
    });

    return;
  }

  if (space.owner === currentPlayer) {
    openChallenge({
      kind:"owned",
      category:`TU PROPIEDAD · ${color.name}`,
      title:"Tu propiedad",
      description:"Esta propiedad ya te pertenece. Resuelve el ejercicio para continuar.",
      symbol:color.symbol,
      time:color.time,
      question:randomQuestion(space.difficulty),
      space
    });

    return;
  }

  let rent = color.rent;

  if (player.rentShield) {
    player.rentShield = false;

    showToast("Tu protección financiera evitó el alquiler.");
    addLog(`${player.name} utilizó su protección de alquiler.`);

    nextTurn();
    return;
  }

  if (
    player.discountTarget &&
    player.discountTarget.spaceIndex === space.index &&
    player.discountTarget.owner === space.owner
  ) {
    rent = Math.ceil(rent/2);
    player.discountTarget = null;
  }

  const higher = {
    green:"blue",
    blue:"purple",
    purple:"red",
    red:"red"
  }[space.difficulty];

  openChallenge({
    kind:"rentChallenge",
    category:`RETO · ${COLORS[higher].name}`,
    title:"Propiedad ajena",
    description:`Propiedad de ${players[space.owner].name}. Puedes pagar $${rent} de alquiler o resolver un ejercicio más difícil para intentar comprarla por $${space.price}.`,
    symbol:COLORS[higher].symbol,
    time:COLORS[higher].time,
    question:randomQuestion(higher),
    space,
    rent,
    higherDifficulty:higher
  });

  addModalButton(`Pagar alquiler · $${rent}`,() => {
    if (!challenge || challenge.answered) return;

    const ownerIndex = space.owner;
    const paid = settleDebt(player,rent);

    players[ownerIndex].money += paid;

    addLog(
      `${player.name} pagó $${paid} de alquiler a ${players[ownerIndex].name}.`
    );

    renderPlayers();
    finishChallenge();
  });
}

function handlePropertyAnswer(c,player,correct) {
  const space = c.space;

  if (correct) {
    $("#modalDescription").textContent =
      `¡Correcto! Recibiste $50. Puedes comprar esta propiedad por $${space.price}.`;

    if (player.money >= space.price) {
      addModalButton(
        `Comprar · $${space.price}`,
        () => buyProperty(space,player,space.price,null),
        true
      );
    } else {
      $("#modalDescription").textContent =
        `Recibiste $50, pero no tienes suficiente dinero para comprarla. Necesitas $${space.price}.`;
    }

    addModalButton("Continuar",finishChallenge);

  } else {
    $("#modalDescription").textContent =
      "No has resuelto el ejercicio. No puedes comprar esta propiedad en este turno.";

    addModalButton("Continuar",finishChallenge,true);
  }
}

function handleOwnedAnswer(c,player,correct) {
  $("#modalDescription").textContent = correct
    ? "¡Correcto! Recibiste $50 por resolver el ejercicio."
    : "No te preocupes. Podrás intentarlo en otra ocasión.";

  addModalButton("Continuar",finishChallenge,true);
}

function handleRentChallenge(c,player,correct) {
  const space = c.space;
  const ownerIndex = space.owner;
  const rent = c.rent;

  if (correct) {
    if (player.money >= space.price) {
      $("#modalDescription").textContent =
        `¡Correcto! Recibiste $50, evitaste el alquiler y puedes comprar la propiedad por $${space.price}. El dinero pasará a ${players[ownerIndex].name}.`;

      addModalButton(
        `Comprar · $${space.price}`,
        () => buyProperty(space,player,space.price,ownerIndex),
        true
      );

    } else {
      const paid = settleDebt(player,rent);
      players[ownerIndex].money += paid;

      $("#modalDescription").textContent =
        `Recibiste $50, pero no tienes suficiente para comprarla. Pagaste $${paid} de alquiler.`;

      addLog(
        `${player.name} no pudo comprar la propiedad y pagó $${paid} de alquiler.`
      );
    }

    addModalButton("Continuar",finishChallenge);
    return;
  }

  if (player.mistakeShield) {
    player.mistakeShield = false;

    $("#modalDescription").textContent =
      "Tu segunda oportunidad te protege. No debes pagar el alquiler.";

    addLog(`${player.name} utilizó su segunda oportunidad.`);
    addModalButton("Continuar",finishChallenge,true);
    return;
  }

  const penalty = rent*2;
  const paid = settleDebt(player,penalty);

  players[ownerIndex].money += paid;

  addLog(
    `${player.name} falló el reto y pagó $${paid} de penalización a ${players[ownerIndex].name}.`
  );

  $("#modalDescription").textContent =
    `Fallaste el ejercicio. La penalización era $${penalty} y pagaste $${paid}.`;

  addModalButton("Pagar y continuar",finishChallenge,true);
}

function buyProperty(space,player,price,previousOwner=null) {
  if (player.money < price) {
    $("#modalDescription").textContent =
      `No tienes suficiente dinero. Necesitas $${price}.`;

    $("#modalActions").innerHTML = "";
    addModalButton("Continuar",finishChallenge,true);
    return;
  }

  const oldOwner = previousOwner !== null
    ? previousOwner
    : space.owner;

  player.money -= price;

  if (oldOwner !== null && oldOwner !== undefined) {
    players[oldOwner].money += price;

    addLog(
      `${player.name} compró la propiedad de ${players[oldOwner].name} por $${price}.`
    );

  } else {
    addLog(
      `${player.name} compró la propiedad de la casilla ${space.index} por $${price}.`
    );
  }

  space.owner = currentPlayer;

  renderTokens();
  renderPlayers();

  finishChallenge();
}

/* CÁRCEL */

function sendPlayerToJail(player,reason="card") {
  if (!player || player.eliminated) return;

  player.position = 10;
  player.inJail = true;
  player.skipNext = false;

  renderPlayers();
  renderTokens();

  if (reason === "police") {
    addLog(`${player.name} cayó en la Policía y fue enviado a la cárcel.`);
    showToast("¡La Policía te ha enviado a la cárcel!");

  } else {
    addLog(`${player.name} fue enviado a la cárcel por una carta sorpresa.`);
    showToast("¡Has sido enviado a la cárcel!");
  }

  openPrison(reason === "police");
}

function openPrison(sentByPolice) {
  const selected = randomPrisonQuestion();
  const color = COLORS[selected.difficulty];

  openChallenge({
    kind:"prison",
    category:sentByPolice ? "POLICÍA · DETENCIÓN" : "CÁRCEL",
    title:sentByPolice ? "¡Te han detenido!" : "¡Has sido enviado a la cárcel!",
    description:sentByPolice
      ? `El policía te ha enviado a la cárcel. Resuelve un ejercicio ${color.name.toLowerCase()} para salir.`
      : `Una carta sorpresa te ha enviado a la cárcel. Resuelve un ejercicio ${color.name.toLowerCase()} para salir.`,
    symbol:color.symbol,
    time:color.time,
    question:selected.question
  });
}

/* CARTAS SORPRESA */

function openSurprise() {
  const card = drawSurpriseCard();
  const player = players[currentPlayer];

  challenge = {
    kind:"surpriseCard",
    answered:true,
    card
  };

  $("#modalCategory").textContent = "CARTA SORPRESA";
  $("#modalTitle").textContent = card.title;
  $("#modalDescription").textContent = card.description;
  $("#modalSymbol").textContent = "✧";
  $("#modalFeedback").textContent = "";
  $("#modalFeedback").className = "feedback";

  $("#timerBox").classList.add("hidden");
  $("#questionBox").classList.add("hidden");
  $("#answerForm").classList.add("hidden");

  $("#modalActions").innerHTML = "";
  $("#modalBackdrop").classList.remove("hidden");
  $("#rollBtn").disabled = true;

  addLog(`${player.name} obtuvo la carta: ${card.title}.`);

  let movement = null;

  switch (card.effect) {
    case "money":
      player.money += card.value;
      break;

    case "loss": {
      const paid = settleDebt(player,card.value);

      $("#modalDescription").textContent =
        `${card.description} Pagaste $${paid}.`;
      break;
    }

    case "perProperty": {
      const count = spaces.filter(s => s.owner === currentPlayer).length;
      const amount = Math.min(200,count*card.value);

      player.money += amount;

      $("#modalDescription").textContent =
        `${card.description} Recibes $${amount}.`;
      break;
    }

    case "propertyLoss": {
      const count = spaces.filter(s => s.owner === currentPlayer).length;
      const amount = Math.min(200,count*card.value);
      const paid = settleDebt(player,amount);

      $("#modalDescription").textContent =
        `${card.description} El coste era $${amount}; pagaste $${paid}.`;
      break;
    }

    case "move":
      movement = card.value;
      break;

    case "mistakeShield":
      player.mistakeShield = true;
      break;

    case "rentShield":
      player.rentShield = true;
      break;

    case "startBonus":
      player.startBonus += card.value;
      break;

    case "extraTime":
      player.extraTime += card.value;
      break;

    case "goToJail":
      // Se aplica al pulsar el botón de continuar.
      break;

    case "trade":
      $("#modalDescription").textContent =
        "Puedes proponer un intercambio. Si ambos jugadores aceptan, las propiedades cambiarán de dueño.";

      addModalButton("Proponer intercambio",() => {
        proposeTrade();
      },true);
      break;

    case "discount":
      chooseDiscountTarget();
      break;
  }

  renderPlayers();

  if (card.effect === "goToJail") {
    addModalButton("Ir a la cárcel",() => {
      finishChallenge(false);
      sendPlayerToJail(player,"card");
    },true);

  } else if (movement !== null) {
    addModalButton("Aplicar movimiento",() => {
      finishChallenge(false);
      movePlayer(movement);
    },true);

  } else if (!$("#modalActions").children.length) {
    addModalButton("Continuar",finishChallenge,true);
  }
}

/* INTERCAMBIO DE PROPIEDADES */

function proposeTrade() {
  const player = players[currentPlayer];

  const ownProperties = spaces.filter(s => s.owner === currentPlayer);

  if (ownProperties.length === 0) {
    showToast("No tienes propiedades para intercambiar.");
    return;
  }

  const opponents = players
    .map((p,index) => ({player:p,index}))
    .filter(item =>
      item.index !== currentPlayer &&
      !item.player.eliminated &&
      spaces.some(s => s.owner === item.index)
    );

  if (opponents.length === 0) {
    showToast("Ningún rival tiene propiedades para intercambiar.");
    return;
  }

  const opponentList = opponents
    .map(item => `${item.index+1}: ${item.player.name}`)
    .join("\n");

  const opponentNumber = Number(prompt(
    `Elige el jugador rival escribiendo su número:\n${opponentList}`
  ));

  const opponent = opponents.find(item => item.index === opponentNumber-1);

  if (!opponent) {
    showToast("Jugador no válido.");
    return;
  }

  const rivalProperties = spaces.filter(s => s.owner === opponent.index);

  const ownList = ownProperties.map(s =>
    `Casilla ${s.index} ($${s.price})`
  ).join("\n");

  const rivalList = rivalProperties.map(s =>
    `Casilla ${s.index} ($${s.price})`
  ).join("\n");

  const ownIndex = Number(prompt(
    `¿Qué propiedad tuya deseas ofrecer?\n${ownList}\nEscribe el número de casilla:`
  ));

  const mySpace = ownProperties.find(s => s.index === ownIndex);

  if (!mySpace) {
    showToast("Tu propiedad no es válida.");
    return;
  }

  const rivalIndex = Number(prompt(
    `¿Qué propiedad deseas recibir?\n${rivalList}\nEscribe el número de casilla:`
  ));

  const rivalSpace = rivalProperties.find(s => s.index === rivalIndex);

  if (!rivalSpace) {
    showToast("La propiedad rival no es válida.");
    return;
  }

  const accepted = confirm(
    `${opponent.player.name}, ¿aceptas intercambiar la casilla ${rivalSpace.index} por la casilla ${mySpace.index}?`
  );

  if (!accepted) {
    showToast("El intercambio fue rechazado.");
    return;
  }

  mySpace.owner = opponent.index;
  rivalSpace.owner = currentPlayer;

  addLog(
    `${player.name} y ${opponent.player.name} intercambiaron propiedades.`
  );

  renderTokens();
  renderPlayers();

  $("#modalDescription").textContent =
    "¡Intercambio realizado! Las dos propiedades han cambiado de dueño.";

  $("#modalActions").innerHTML = "";
  addModalButton("Continuar",finishChallenge,true);
}

/* DESCUENTO DE ALQUILER */

function chooseDiscountTarget() {
  const opponents = players
    .map((p,index) => ({player:p,index}))
    .filter(item =>
      item.index !== currentPlayer &&
      !item.player.eliminated &&
      spaces.some(s => s.owner === item.index)
    );

  if (opponents.length === 0) {
    $("#modalDescription").textContent =
      "Todavía no hay propiedades rivales. No puedes usar esta ventaja.";
    return;
  }

  const list = opponents.map(item =>
    `${item.index+1}: ${item.player.name}`
  ).join("\n");

  const number = Number(prompt(`Elige un rival:\n${list}`));
  const opponent = opponents.find(item => item.index === number-1);

  if (!opponent) {
    $("#modalDescription").textContent =
      "No seleccionaste un rival válido. La ventaja no se ha aplicado.";
    return;
  }

  const properties = spaces.filter(s => s.owner === opponent.index);

  const propertyList = properties.map(s =>
    `Casilla ${s.index} · Alquiler $${COLORS[s.difficulty].rent}`
  ).join("\n");

  const propertyNumber = Number(prompt(
    `Elige una propiedad:\n${propertyList}\nEscribe el número de casilla:`
  ));

  const target = properties.find(s => s.index === propertyNumber);

  if (!target) {
    $("#modalDescription").textContent =
      "No seleccionaste una propiedad válida. La ventaja no se ha aplicado.";
    return;
  }

  players[currentPlayer].discountTarget = {
    owner:opponent.index,
    spaceIndex:target.index
  };

  $("#modalDescription").textContent =
    `La próxima vez que caigas en la casilla ${target.index}, pagarás la mitad del alquiler.`;
}

/* CERRAR RETOS */

function finishChallenge(advanceTurn=true) {
  clearInterval(timerInterval);

  $("#modalBackdrop").classList.add("hidden");
  $("#timerBox").classList.remove("hidden");
  $("#questionBox").classList.remove("hidden");
  $("#answerForm").classList.remove("hidden");

  challenge = null;

  renderPlayers();
  renderTokens();

  if (gameOver) {
    $("#rollBtn").disabled = true;
    return;
  }

  if (advanceTurn) {
    nextTurn();
  }
}

/* REINICIAR */

async function resetGame() {
  if (appMode !== "admin") return;

  clearInterval(timerInterval);
  clearTimeout(roomSaveTimeout);

  challenge = null;
  started = false;
  gameOver = false;
  isMoving = false;
  isRollingDice = false;
  playerRollPending = false;
  currentPlayer = 0;
  round = 1;
  selectedSetupPlayer = 0;
  surpriseDeck = [];

  players = roomRoster
    .slice()
    .sort((a,b) => a.seat - b.seat)
    .map(profile => ({
      uid: profile.uid, name: profile.name, animal: profile.animal,
      money: 1000, position: 0, skipNext: false, inJail: false,
      eliminated: false, mistakeShield: false, rentShield: false,
      startBonus: 0, extraTime: 0, discountTarget: null
    }));

  createSpaces();
  renderBoard();
  renderPlayers();

  $("#gameLayout").classList.add("hidden");
  $("#adminHomePanel").classList.remove("hidden");
  $("#adminWelcomePanel").classList.add("hidden");
  $("#adminLobbyPanel").classList.remove("hidden");
  $("#resetBtn").hidden = true;
  $("#modalBackdrop").classList.add("hidden");
  $("#rollBtn").disabled = true;
  $("#rollHelp").textContent = "Los cuatro jugadores están registrados.";
  $("#diceMessage").textContent = "Listos para jugar";
  $("#diceTotal").textContent = "—";
  $("#dieOne").dataset.value = 1;
  $("#dieTwo").dataset.value = 1;
  $("#roundNumber").textContent = "01";
  $("#roundNumberMobile").textContent = "01";
  $("#turnLabel").textContent = "PREPARANDO PARTIDA";
  $("#centerStatus").textContent = "ESPERANDO A LOS JUGADORES";
  $("#logList").innerHTML = '<p class="empty-log">La partida aún no ha comenzado.</p>';

  if (roomRef) {
    try {
      await updateDoc(roomRef, {
        status: "waiting",
        gameState: null,
        startedAt: null,
        updatedAt: Date.now()
      });
      renderAdminRoster();
      showToast("Partida reiniciada. Los jugadores siguen en la sala.");
    } catch (error) {
      console.error("Error al reiniciar la sala:", error);
      showToast("No se pudo reiniciar la sala en Firebase.");
    }
  }
}

/* EVENTOS */

$("#rollBtn").addEventListener("click", () => {
  if (appMode === "player") requestPlayerRoll();
  else if (appMode === "admin") showToast("Los jugadores lanzan los dados desde sus dispositivos.");
});
$("#answerForm").addEventListener("submit", submitAnswer);

$("#closeModal").addEventListener("click",() => {
  if (!challenge) return;
  if (!challenge.answered) {
    showToast("Debes responder o esperar a que termine el tiempo.");
    return;
  }
  finishChallenge();
});

$("#resetBtn").addEventListener("click",() => {
  if (confirm("¿Quieres reiniciar la partida? Los cuatro jugadores permanecerán en la sala.")) {
    resetGame();
  }
});

$("#modalBackdrop").addEventListener("click",event => {
  if (event.target === $("#modalBackdrop") && challenge?.answered) finishChallenge();
});

$("#adminCreateRoomBtn").addEventListener("click", createRoom);
$("#adminStartBtn").addEventListener("click", startGame);
$("#copyRoomLinkBtn").addEventListener("click", async () => {
  if (!invitationUrl) return;
  try {
    await navigator.clipboard.writeText(invitationUrl);
    showToast("Enlace copiado. Compártelo con los jugadores.");
  } catch {
    showToast("No se pudo copiar. Comparte el código de sala manualmente.");
  }
});
$("#playerJoinForm").addEventListener("submit", joinRoom);

/* AUTENTICACIÓN Y SALAS FIREBASE */

function getSignedInUser() {
  return new Promise((resolve,reject) => {
    let unsubscribe = () => {};
    unsubscribe = onAuthStateChanged(auth, async user => {
      unsubscribe();
      try {
        if (user) {
          resolve(user);
        } else {
          const credential = await signInAnonymously(auth);
          resolve(credential.user);
        }
      } catch (error) {
        reject(error);
      }
    }, reject);
  });
}

function randomRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({length:6},() => chars[Math.floor(Math.random()*chars.length)]).join("");
}

function getInvitationUrl(code) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("room",code);
  return url.toString();
}

async function createRoom() {
  const button = $("#adminCreateRoomBtn");
  button.disabled = true;
  $("#adminMessage").textContent = "Creando sala segura...";

  try {
    for (let attempt = 0; attempt < 8; attempt++) {
      const code = randomRoomCode();
      const candidateRef = doc(db,"rooms",code);
      const existing = await getDoc(candidateRef);
      if (existing.exists()) continue;

      await setDoc(candidateRef, {
        adminUid: currentUid,
        playerUids: [],
        status: "waiting",
        gameState: null,
        createdAt: serverTimestamp(),
        updatedAt: Date.now()
      });

      roomCode = code;
      roomRef = candidateRef;
      localStorage.setItem("monopolyAdminRoom",code);
      invitationUrl = getInvitationUrl(code);
      showAdminLobby();
      subscribeToRoom();
      subscribeToRoster();
      return;
    }
    throw new Error("No se pudo encontrar un código de sala libre. Intenta nuevamente.");
  } catch (error) {
    console.error(error);
    $("#adminMessage").textContent = error.message || "No se pudo crear la sala.";
    showToast("No se pudo crear la sala. Revisa las reglas de Firestore.");
  } finally {
    button.disabled = false;
  }
}

function showAdminLobby() {
  $("#adminHomePanel").classList.remove("hidden");
  $("#adminWelcomePanel").classList.add("hidden");
  $("#adminLobbyPanel").classList.remove("hidden");
  $("#playerJoinPanel").classList.add("hidden");
  $("#playerWaitingPanel").classList.add("hidden");
  $("#gameLayout").classList.add("hidden");
  $("#resetBtn").hidden = true;
  $("#roomCodeLabel").textContent = roomCode;
  $("#topRoomLabel").textContent = `SALA ${roomCode}`;
  invitationUrl = getInvitationUrl(roomCode);
  const qrContainer = $("#qrCode");
  qrContainer.innerHTML = "";
  if (window.QRCode) {
    new window.QRCode(qrContainer, {
      text: invitationUrl,
      width: 190,
      height: 190,
      colorDark: "#101116",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.M
    });
  } else {
    qrContainer.textContent = "No se pudo cargar el generador QR. Comparte el enlace.";
  }
}

function subscribeToRoom() {
  if (roomUnsubscribe) roomUnsubscribe();
  if (appMode === "admin") subscribeToRollRequests();
  roomUnsubscribe = onSnapshot(roomRef, snapshot => {
    if (!snapshot.exists()) {
      showToast("La sala ya no existe.");
      return;
    }

    const data = snapshot.data();
    if (appMode === "admin") {
      if (data.adminUid !== currentUid) {
        showToast("Esta sala pertenece a otra sesión de administrador.");
        localStorage.removeItem("monopolyAdminRoom");
        return;
      }
      if (data.status === "playing" && data.gameState && !started) {
        restoreGameState(data.gameState);
        $("#adminHomePanel").classList.add("hidden");
        $("#gameLayout").classList.remove("hidden");
        $("#resetBtn").hidden = false;
      } else if (data.status === "waiting" && started) {
        started = false;
        showAdminLobby();
      }
    } else {
      if ((data.status === "playing" || data.status === "finished") && data.gameState) {
        renderPlayerGame(data.gameState,data.status);
      } else if (myPlayerProfile) {
        showPlayerWaiting(data.status);
      } else if (data.status === "waiting") {
        $("#adminHomePanel").classList.add("hidden");
        $("#playerWaitingPanel").classList.add("hidden");
        $("#playerJoinPanel").classList.remove("hidden");
        renderPlayerAnimalChoices();
      } else {
        if (rosterUnsubscribe) {
          rosterUnsubscribe();
          rosterUnsubscribe = null;
        }
        $("#playerJoinMessage").textContent = "La partida ya comenzó y esta sesión no está registrada.";
        $("#playerJoinBtn").disabled = true;
        $("#playerJoinPanel").classList.remove("hidden");
      }
    }
  }, error => {
    console.error("Error al escuchar la sala:",error);
    showToast("Se perdió la conexión con la sala.");
  });
}

function subscribeToRoster() {
  if (rosterUnsubscribe) rosterUnsubscribe();
  rosterUnsubscribe = onSnapshot(collection(roomRef,"players"), snapshot => {
    roomRoster = snapshot.docs.map(item => item.data()).sort((a,b) => a.seat-b.seat);
    if (appMode === "admin") renderAdminRoster();
    if (appMode === "player") {
      renderPlayerAnimalChoices();
      if (myPlayerProfile) $("#waitingCount").textContent = `${roomRoster.length} / 4 JUGADORES`;
    }
  }, error => {
    console.error("Error al escuchar jugadores:",error);
  });
}

function renderAdminRoster() {
  const list = $("#adminPlayersList");
  if (!list) return;
  list.innerHTML = "";
  for (let index = 0; index < 4; index++) {
    const profile = roomRoster.find(item => item.seat === index);
    const row = document.createElement("div");
    row.className = "room-player-row";
    const left = document.createElement("span");
    left.textContent = profile ? `${profile.animal.emoji}  ${profile.name}` : `Jugador ${index+1} · Esperando...`;
    const right = document.createElement("small");
    right.textContent = profile ? "CONECTADO" : "LIBRE";
    row.append(left,right);
    list.append(row);
  }
  $("#adminLobbyStatus").textContent = roomRoster.length === 4
    ? "Los cuatro jugadores están listos. Puedes iniciar."
    : `Conectados: ${roomRoster.length} de 4 jugadores.`;
  $("#adminStartBtn").disabled = roomRoster.length !== 4;
}

function renderPlayerAnimalChoices() {
  const grid = $("#playerAnimalGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const usedAnimals = new Set(roomRoster.map(profile => profile.animal?.name));
  if (selectedPlayerAnimal && usedAnimals.has(selectedPlayerAnimal.name)) {
    selectedPlayerAnimal = null;
  }

  ANIMALS.forEach(animal => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "player-animal-option";
    const taken = usedAnimals.has(animal.name);
    button.disabled = taken;
    if (selectedPlayerAnimal?.name === animal.name) button.classList.add("selected");
    const emoji = document.createElement("span");
    emoji.textContent = animal.emoji;
    const name = document.createElement("small");
    name.textContent = animal.name;
    button.append(emoji,name);
    button.addEventListener("click",() => {
      selectedPlayerAnimal = animal;
      renderPlayerAnimalChoices();
      $("#playerJoinBtn").disabled = false;
    });
    grid.append(button);
  });
  $("#playerJoinBtn").disabled = !selectedPlayerAnimal;
}

async function joinRoom(event) {
  event.preventDefault();
  if (!roomRef || !currentUid || !selectedPlayerAnimal) return;
  const name = $("#playerNameInput").value.trim().replace(/\s+/g," ");
  if (name.length < 2 || name.length > 18) {
    $("#playerJoinMessage").textContent = "Escribe un nombre de entre 2 y 18 caracteres.";
    return;
  }

  const button = $("#playerJoinBtn");
  button.disabled = true;
  $("#playerJoinMessage").textContent = "Entrando a la sala...";

  try {
    const playerRef = doc(roomRef,"players",currentUid);
    let registeredProfile = null;

    await runTransaction(db,async transaction => {
      const roomSnapshot = await transaction.get(roomRef);
      if (!roomSnapshot.exists()) throw new Error("La sala no existe.");
      const roomData = roomSnapshot.data();
      if (roomData.status !== "waiting") throw new Error("La partida ya comenzó. No se aceptan más jugadores.");

      const existingPlayer = await transaction.get(playerRef);
      if (existingPlayer.exists()) {
        registeredProfile = existingPlayer.data();
        return;
      }

      const uids = roomData.playerUids || [];
      if (uids.length >= 4) throw new Error("La sala ya está completa.");
      if (uids.includes(currentUid)) throw new Error("Tu sesión ya está registrada en esta sala.");

      const existingProfiles = [];
      for (const uid of uids) {
        const otherRef = doc(roomRef,"players",uid);
        const otherSnapshot = await transaction.get(otherRef);
        if (otherSnapshot.exists()) existingProfiles.push(otherSnapshot.data());
      }
      if (existingProfiles.some(profile => profile.animal?.name === selectedPlayerAnimal.name)) {
        throw new Error("Ese animal ya fue elegido por otro jugador.");
      }

      registeredProfile = {
        uid: currentUid,
        name,
        animal: selectedPlayerAnimal,
        seat: uids.length,
        joinedAt: Date.now()
      };

      transaction.set(playerRef,registeredProfile);
      transaction.update(roomRef,{playerUids:[...uids,currentUid]});
    });

    myPlayerProfile = registeredProfile;
    $("#waitingAnimal").textContent = registeredProfile.animal.emoji;
    $("#waitingPlayerText").textContent = `${registeredProfile.name}, ya estás dentro de la sala. Espera a que el administrador inicie la partida.`;
    $("#playerJoinPanel").classList.add("hidden");
    $("#playerWaitingPanel").classList.remove("hidden");
    $("#topRoomLabel").textContent = `SALA ${roomCode}`;
    showToast("¡Te has unido correctamente!");
  } catch (error) {
    console.error("Error al entrar a la sala:",error);
    $("#playerJoinMessage").textContent = error.message || "No se pudo entrar a la sala.";
    button.disabled = false;
    renderPlayerAnimalChoices();
  }
}

function showPlayerWaiting(status="waiting") {
  $("#adminHomePanel").classList.add("hidden");
  $("#playerJoinPanel").classList.add("hidden");
  $("#gameLayout").classList.add("hidden");
  $("#playerWaitingPanel").classList.remove("hidden");
  $("#resetBtn").hidden = true;
  $("#waitingCount").textContent = `${roomRoster.length} / 4 JUGADORES`;
  if (myPlayerProfile) {
    $("#waitingAnimal").textContent = myPlayerProfile.animal.emoji;
    $("#waitingPlayerText").textContent = `${myPlayerProfile.name}, espera a que el administrador inicie la partida.`;
  }
  if (status === "finished") $("#waitingPlayerText").textContent = "La partida ha terminado.";
}

function buildGameState() {
  return {
    players: players.map(player => ({...player})),
    spaces: spaces.map(space => ({...space})),
    currentPlayer,
    round,
    started,
    gameOver,
    turnPhase: challenge ? "challenge" : (isMoving || isRollingDice) ? "moving" : "roll",
    diceOne: Number($("#dieOne").dataset.value || 1),
    diceTwo: Number($("#dieTwo").dataset.value || 1),
    diceTotal: $("#diceTotal").textContent,
    diceMessage: $("#diceMessage").textContent,
    log: Array.from($("#logList").querySelectorAll(".log-entry span:last-child"))
      .map(item => item.textContent).slice(0,6)
  };
}

async function requestPlayerRoll() {
  if (appMode !== "player" || !roomRef || !currentUid || !myPlayerProfile || !started || gameOver) return;

  const activePlayer = players[currentPlayer];
  if (!activePlayer || activePlayer.uid !== currentUid) {
    showToast("Todavía no es tu turno.");
    return;
  }

  if (playerRollPending) return;

  playerRollPending = true;
  $("#rollBtn").disabled = true;
  $("#rollHelp").textContent = "Enviando tu lanzamiento...";

  const animation = !activePlayer.skipNext;
  if (animation) {
    $("#dieOne").classList.add("rolling");
    $("#dieTwo").classList.add("rolling");
    $("#diceMessage").textContent = "Tus dados están rodando...";
    $("#diceTotal").textContent = "—";
  } else {
    $("#diceMessage").textContent = "Este turno debes pasar.";
    $("#diceTotal").textContent = "—";
  }

  try {
    // El jugador solicita la tirada desde su dispositivo. El administrador
    // genera el resultado oficial y sincroniza los dados con toda la sala.
    const requestRef = doc(roomRef, "rollRequests", currentUid);
    await setDoc(requestRef, {
      uid: currentUid,
      type: "roll",
      createdAt: Date.now()
    });

    if (animation) {
      await new Promise(resolve => setTimeout(resolve, 650));
      $("#dieOne").classList.remove("rolling");
      $("#dieTwo").classList.remove("rolling");
    }

    $("#rollHelp").textContent = activePlayer.skipNext
      ? "Turno comunicado. Espera a que se actualice el siguiente turno."
      : "Tirada enviada. Espera a que aparezca el resultado compartido.";
  } catch (error) {
    console.error("No se pudo solicitar el lanzamiento:", error);
    $("#dieOne").classList.remove("rolling");
    $("#dieTwo").classList.remove("rolling");
    playerRollPending = false;
    updatePlayerRollControls();
    showToast(error.code === "permission-denied"
      ? "No es tu turno o la solicitud no está permitida."
      : "No se pudo enviar el lanzamiento. Comprueba tu conexión.");
  }
}

function updatePlayerRollControls(phase = "roll") {
  const activePlayer = players[currentPlayer];
  const isMyTurn = activePlayer?.uid === currentUid;
  const canRoll = appMode === "player" && started && !gameOver && isMyTurn
    && !activePlayer?.eliminated && phase === "roll" && !playerRollPending;

  $("#rollBtn").hidden = false;
  $("#rollBtn").disabled = !canRoll;
  $("#rollBtn").innerHTML = activePlayer?.skipNext
    ? 'Continuar turno <span class="arrow">↗</span>'
    : 'Tirar los dados <span class="arrow">↗</span>';

  if (gameOver) {
    $("#rollHelp").textContent = "La partida ha terminado.";
  } else if (playerRollPending) {
    $("#rollHelp").textContent = "Tu lanzamiento fue enviado. Espera el resultado.";
  } else if (phase === "challenge" || phase === "moving") {
    $("#rollHelp").textContent = "Espera a que termine el movimiento o el reto.";
  } else if (isMyTurn) {
    $("#rollHelp").textContent = activePlayer?.skipNext
      ? "Es tu turno, pero debes cumplir la pérdida de turno."
      : "¡Es tu turno! Toca aquí para lanzar los dados.";
  } else {
    $("#rollHelp").textContent = `Espera el turno de ${activePlayer?.name || "otro jugador"}.`;
  }
}

function subscribeToRollRequests() {
  if (appMode !== "admin" || !roomRef) return;
  if (rollRequestsUnsubscribe) rollRequestsUnsubscribe();

  rollRequestsUnsubscribe = onSnapshot(collection(roomRef, "rollRequests"), snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        processRollRequest(change.doc.ref, change.doc.data());
      }
    });
  }, error => {
    console.error("Error al escuchar solicitudes de lanzamiento:", error);
    showToast("No se pudieron recibir los lanzamientos de los jugadores.");
  });
}

async function processRollRequest(requestRef, requestData) {
  if (appMode !== "admin") return;

  const activePlayer = players[currentPlayer];
  const isValidRequest = started && !gameOver && !challenge && !isMoving
    && !isRollingDice && activePlayer && activePlayer.uid === requestData.uid
    && requestData.type === "roll";

  try {
    // El documento de solicitud se elimina para permitir que ese jugador
    // pueda volver a lanzar cuando le corresponda otro turno.
    await deleteDoc(requestRef);
  } catch (error) {
    console.error("No se pudo cerrar la solicitud de lanzamiento:", error);
    showToast("No se pudo procesar el lanzamiento solicitado.");
    return;
  }

  if (!isValidRequest) {
    showToast("Se ignoró una solicitud porque ya no correspondía al turno actual.");
    return;
  }

  rollDice();
}

function scheduleRoomSync() {
  if (appMode !== "admin" || !roomRef || !started || isApplyingRemoteState) return;
  clearTimeout(roomSaveTimeout);
  roomSaveTimeout = setTimeout(async () => {
    try {
      await updateDoc(roomRef,{
        status: gameOver ? "finished" : "playing",
        gameState: buildGameState(),
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("No se pudo sincronizar la partida:",error);
      showToast("No se pudo sincronizar. Comprueba tu conexión.");
    }
  },450);
}

function restoreGameState(state) {
  isApplyingRemoteState = true;
  players = (state.players || []).map(player => ({...player}));
  spaces = (state.spaces || []).map(space => ({...space}));
  currentPlayer = state.currentPlayer || 0;
  round = state.round || 1;
  started = !!state.started;
  gameOver = !!state.gameOver;
  $("#dieOne").dataset.value = state.diceOne || 1;
  $("#dieTwo").dataset.value = state.diceTwo || 1;
  $("#diceTotal").textContent = state.diceTotal || "—";
  $("#diceMessage").textContent = state.diceMessage || "Partida en curso";
  $("#roundNumber").textContent = String(round).padStart(2,"0");
  $("#roundNumberMobile").textContent = String(round).padStart(2,"0");
  renderBoard();
  renderPlayers();
  renderTokens();
  updateTurnLabel();
  $("#centerStatus").textContent = gameOver ? "PARTIDA FINALIZADA" : "LA PARTIDA ESTÁ EN CURSO";
  $("#rollBtn").hidden = true;
  $("#rollBtn").disabled = true;
  $("#rollHelp").textContent = gameOver ? "La partida ha terminado." : "Los jugadores lanzan los dados desde sus dispositivos.";
  $("#adminHomePanel").classList.add("hidden");
  $("#gameLayout").classList.remove("hidden");
  $("#resetBtn").hidden = false;
  $("#topRoomLabel").textContent = `SALA ${roomCode}`;
  if (Array.isArray(state.log)) {
    $("#logList").innerHTML = "";
    state.log.slice(0,6).forEach(message => addLog(message));
  }
  isApplyingRemoteState = false;
}

function renderPlayerGame(state,status) {
  if (!myPlayerProfile) {
    getDoc(doc(roomRef,"players",currentUid)).then(snapshot => {
      if (snapshot.exists()) myPlayerProfile = snapshot.data();
      if (myPlayerProfile) renderPlayerGame(state,status);
      else showPlayerWaiting(status);
    }).catch(console.error);
    return;
  }

  isApplyingRemoteState = true;
  players = (state.players || []).map(player => ({...player}));
  spaces = (state.spaces || []).map(space => ({...space}));
  currentPlayer = state.currentPlayer || 0;
  round = state.round || 1;
  started = !!state.started;
  gameOver = !!state.gameOver;

  $("#adminHomePanel").classList.add("hidden");
  $("#playerJoinPanel").classList.add("hidden");
  $("#playerWaitingPanel").classList.add("hidden");
  $("#gameLayout").classList.remove("hidden");
  $("#resetBtn").hidden = true;
  $("#rollBtn").hidden = false;
  $("#setupPanel").classList.add("hidden");
  $("#playerLiveNotice").classList.remove("hidden");

  $("#dieOne").dataset.value = state.diceOne || 1;
  $("#dieTwo").dataset.value = state.diceTwo || 1;
  $("#diceTotal").textContent = state.diceTotal || "—";
  $("#diceMessage").textContent = state.diceMessage || "Partida en curso";
  $("#roundNumber").textContent = String(round).padStart(2,"0");
  $("#roundNumberMobile").textContent = String(round).padStart(2,"0");

  renderBoard();
  renderPlayers();
  renderTokens();
  updateTurnLabel();
  if (Array.isArray(state.log)) {
    $("#logList").innerHTML = "";
    state.log.slice(0,6).forEach(message => addLog(message));
  }
  $("#centerStatus").textContent = status === "finished" ? "PARTIDA FINALIZADA" : "PARTIDA EN VIVO";
  const turnPlayer = players[currentPlayer];
  const isMyTurn = turnPlayer?.uid === currentUid;
  $("#playerLiveTitle").textContent = isMyTurn ? "¡Es tu turno!" : `Turno de ${turnPlayer?.name || "otro jugador"}`;
  $("#playerLiveText").textContent = `${myPlayerProfile.name} · ${myPlayerProfile.animal.name}. Tú lanzas los dados cuando sea tu turno; el administrador gestiona la banca.`;
  if (players[currentPlayer]?.uid !== currentUid || state.turnPhase !== "roll") {
    playerRollPending = false;
  }
  updatePlayerRollControls(state.turnPhase || "roll");
  isApplyingRemoteState = false;
}

async function initializeMultiplayerApp() {
  try {
    const user = await getSignedInUser();
    currentUid = user.uid;
    console.log("Sesión anónima lista:",currentUid);

    const params = new URLSearchParams(window.location.search);
    const requestedRoom = (params.get("room") || "").trim().toUpperCase();

    if (requestedRoom) {
      appMode = "player";
      roomCode = requestedRoom;
      roomRef = doc(db,"rooms",roomCode);
      $("#playerRoomCodeLabel").textContent = roomCode;
      $("#topRoomLabel").textContent = `SALA ${roomCode}`;
      $("#playerJoinPanel").classList.remove("hidden");
      const roomSnapshot = await getDoc(roomRef);
      if (!roomSnapshot.exists()) {
        $("#playerJoinMessage").textContent = "No encontramos esa sala. Pide al administrador un QR nuevo.";
        $("#playerJoinBtn").disabled = true;
        return;
      }
      const ownProfile = await getDoc(doc(roomRef,"players",currentUid));
      if (ownProfile.exists()) myPlayerProfile = ownProfile.data();
      if (roomSnapshot.data().status === "waiting" || myPlayerProfile) subscribeToRoster();
      subscribeToRoom();
      if (myPlayerProfile) showPlayerWaiting(roomSnapshot.data().status);
      else if (roomSnapshot.data().status !== "waiting") {
        $("#playerJoinMessage").textContent = "La partida ya comenzó y tu sesión no está registrada.";
        $("#playerJoinBtn").disabled = true;
      }
      return;
    }

    appMode = "admin";
    const savedCode = localStorage.getItem("monopolyAdminRoom");
    if (savedCode) {
      const savedRef = doc(db,"rooms",savedCode);
      const savedSnapshot = await getDoc(savedRef);
      if (savedSnapshot.exists() && savedSnapshot.data().adminUid === currentUid) {
        roomCode = savedCode;
        roomRef = savedRef;
        invitationUrl = getInvitationUrl(roomCode);
        showAdminLobby();
        subscribeToRoom();
        subscribeToRoster();
        const data = savedSnapshot.data();
        if (data.status === "playing" && data.gameState) {
          restoreGameState(data.gameState);
        }
        return;
      }
      localStorage.removeItem("monopolyAdminRoom");
    }

    createSpaces();
    renderBoard();
    $("#adminHomePanel").classList.remove("hidden");
    $("#adminWelcomePanel").classList.remove("hidden");
  } catch (error) {
    console.error("Error al iniciar la aplicación:",error);
    showToast("No se pudo conectar con Firebase. Revisa la configuración y las reglas.");
    $("#adminHomePanel").classList.remove("hidden");
    $("#adminMessage").textContent = error.message || "Error de conexión con Firebase.";
  }
}

initializeMultiplayerApp();
