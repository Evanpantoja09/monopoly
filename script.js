
const $ = selector => document.querySelector(selector);

/* CONFIGURACIÓN DE PROPIEDADES */

const COLORS = {
  green: {
    name:"FÁCIL", color:"#32965c", time:15,
    rent:50, price:100, symbol:"+"
  },
  blue: {
    name:"NORMAL", color:"#397fc9", time:25,
    rent:100, price:200, symbol:"÷"
  },
  purple: {
    name:"ELEVADA", color:"#9253c5", time:60,
    rent:175, price:350, symbol:"√"
  },
  red: {
    name:"MUY DIFÍCIL", color:"#d9434c", time:120,
    rent:250, price:500, symbol:"∫"
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

/* EJERCICIOS DE PRUEBA */

const QUESTIONS = {
  green:[
    {q:"18 + 27 = ?",a:"45"},
    {q:"7 × 6 = ?",a:"42"},
    {q:"64 ÷ 8 = ?",a:"8"},
    {q:"15 − 9 = ?",a:"6"},
    {q:"10% de 80 = ?",a:"8"},
    {q:"9 × 4 = ?",a:"36"},
    {q:"√81 = ?",a:"9"},
    {q:"125 − 47 = ?",a:"78"}
  ],
  blue:[
    {q:"3x + 5 = 20. ¿x = ?",a:"5"},
    {q:"12² = ?",a:"144"},
    {q:"¾ de 80 = ?",a:"60"},
    {q:"2x − 7 = 13. ¿x = ?",a:"10"},
    {q:"√169 = ?",a:"13"},
    {q:"25% de 240 = ?",a:"60"},
    {q:"5x = 65. ¿x = ?",a:"13"}
  ],
  purple:[
    {q:"2x² = 50. ¿x positivo = ?",a:"5"},
    {q:"Si f(x) = 3x − 2, f(7) = ?",a:"19"},
    {q:"√196 + 3² = ?",a:"23"},
    {q:"5x + 8 = 3x + 22. ¿x = ?",a:"7"},
    {q:"Factoriza x² − 9. Primer factor:",a:"x-3"},
    {q:"3² + 4² = ?",a:"25"}
  ],
  red:[
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
    description:"Tu esfuerzo tiene recompensa. Recibes $150.",
    effect:"money",value:150
  },
  {
    title:"Beca académica",
    description:"Has conseguido una beca de $200.",
    effect:"money",value:200
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
    description:"Recibes $50 por cada propiedad que tengas.",
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
    description:"Paga $50 por cada propiedad que tengas.",
    effect:"propertyLoss",value:50
  },
  {
    title:"Error de cálculo",
    description:"Una equivocación te cuesta $100.",
    effect:"loss",value:100
  },
  {
    title:"Impuestos",
    description:"Debes pagar $150 en impuestos.",
    effect:"loss",value:150
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

let spaces=[];
let players=[];
let currentPlayer=0;
let round=1;
let started=false;
let selectedSetupPlayer=0;
let challenge=null;
let timerInterval=null;
let toastTimeout=null;
let isMoving=false;
let surpriseDeck=[];

/* FUNCIONES GENERALES */

function shuffleArray(array){
  const result=[...array];

  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }

  return result;
}

function shuffleSurpriseDeck(){
  surpriseDeck=shuffleArray(SURPRISE_CARDS);
}

function drawSurpriseCard(){
  if(surpriseDeck.length===0){
    shuffleSurpriseDeck();
    addLog("El mazo sorpresa se ha mezclado nuevamente.");
  }

  return surpriseDeck.pop();
}

function chargePlayer(player,amount){
  const paid=Math.min(player.money,Math.max(0,amount));
  player.money-=paid;
  return paid;
}

function randomQuestion(difficulty){
  const list=QUESTIONS[difficulty];
  return list[Math.floor(Math.random()*list.length)];
}

function formatTime(seconds){
  const minutes=Math.floor(seconds/60);
  const remaining=seconds%60;

  return `${String(minutes).padStart(2,"0")}:${String(remaining).padStart(2,"0")}`;
}

function normalizeAnswer(value){
  return value.trim().toLowerCase()
    .replace(/\s+/g,"")
    .replace(/−/g,"-")
    .replace(/²/g,"^2");
}

/* CREAR TABLERO */

function createSpaces(){
  const coordinates=[];

  /* Se conserva la distribución original. */
  for(let col=1;col<=11;col++) coordinates.push([1,col]);
  for(let row=2;row<=11;row++) coordinates.push([row,11]);
  for(let col=10;col>=1;col--) coordinates.push([11,col]);
  for(let row=10;row>=2;row--) coordinates.push([row,1]);

  /* Cinco casillas sorpresa. */
  const surprises=new Set([4,14,24,34,37]);

  const shuffled=shuffleArray(propertyTypes);
  let propertyIndex=0;

  spaces=coordinates.map(([row,col],index)=>{
    const base={
      index,row,col,owner:null,
      type:"property",difficulty:null,
      symbol:"",price:0
    };

    /* Inicio: casilla 0. */
    if(index===0){
      return {...base,type:"start",symbol:"⌂"};
    }

    /* Cárcel: casilla 10. */
    if(index===10){
      return {...base,type:"prison",symbol:"▤"};
    }

    /* Policía: casilla 30. */
    if(index===30){
      return {...base,type:"police",symbol:"♜"};
    }

    if(surprises.has(index)){
      return {...base,type:"surprise",symbol:"✧"};
    }

    const difficulty=shuffled[propertyIndex++];

    return {
      ...base,
      difficulty,
      symbol:COLORS[difficulty].symbol,
      price:COLORS[difficulty].price
    };
  });
}

function renderBoard(){
  const board=$("#board");
  board.querySelectorAll(".space").forEach(el=>el.remove());

  spaces.forEach(space=>{
    const cell=document.createElement("div");
    cell.className=`space ${space.type} ${space.difficulty||""}`;
    cell.style.gridRow=space.row;
    cell.style.gridColumn=space.col;
    cell.dataset.index=space.index;

    const band=document.createElement("span");
    band.className="space-band";
    band.style.background=space.difficulty
      ?COLORS[space.difficulty].color
      :space.type==="surprise"?"#a77bd1":"#a88d5c";

    const symbol=document.createElement("span");
    symbol.className="space-symbol";
    symbol.textContent=space.symbol;

    const tokens=document.createElement("span");
    tokens.className="tokens";
    tokens.dataset.tokens=space.index;

    cell.append(band,symbol,tokens);

    if(space.type==="property"){
      const price=document.createElement("span");
      price.className="space-price";
      price.textContent=`$${space.price}`;
      cell.append(price);
    }

    const number=document.createElement("span");
    number.className="space-index";
    number.textContent=String(space.index);
    cell.append(number);

    board.append(cell);
  });

  renderTokens();
}

/* CREAR JUGADORES */

function createPlayers(){
  players=Array.from({length:4},(_,index)=>({
    name:`Jugador ${index+1}`,
    animal:null,
    money:800,
    position:0,
    skipNext:false,
    inJail:false,
    mistakeShield:false,
    rentShield:false,
    startBonus:0,
    extraTime:0,
    discountTarget:null
  }));
}

/* SELECCIÓN DE ANIMALES */

function renderSetup(){
  const tabs=$("#playerTabs");
  const grid=$("#animalGrid");

  tabs.innerHTML="";
  grid.innerHTML="";

  players.forEach((player,index)=>{
    const tab=document.createElement("button");
    tab.className="player-tab";
    tab.textContent=`Jugador ${index+1}`;

    if(selectedSetupPlayer===index) tab.classList.add("active");
    if(player.animal) tab.classList.add("done");

    tab.addEventListener("click",()=>{
      selectedSetupPlayer=index;
      renderSetup();
    });

    tabs.append(tab);
  });

  ANIMALS.forEach(animal=>{
    const taken=players.some((player,index)=>
      index!==selectedSetupPlayer &&
      player.animal?.name===animal.name
    );

    const button=document.createElement("button");
    button.className="animal-option";
    button.style.setProperty("--animal-color",animal.color);

    if(players[selectedSetupPlayer].animal?.name===animal.name){
      button.classList.add("selected");
    }

    if(taken){
      button.classList.add("taken");
      button.disabled=true;
    }

    const emoji=document.createElement("span");
    emoji.className="animal-emoji";
    emoji.textContent=animal.emoji;

    const labelRow=document.createElement("span");
    labelRow.className="animal-label-row";

    const dot=document.createElement("span");
    dot.className="animal-color-dot";

    const label=document.createElement("span");
    label.textContent=animal.name;

    labelRow.append(dot,label);
    button.append(emoji,labelRow);

    button.addEventListener("click",()=>{
      players[selectedSetupPlayer].animal=animal;
      renderSetup();
      renderPlayers();
    });

    grid.append(button);
  });

  const selected=players[selectedSetupPlayer];

  $("#selectionStatus").textContent=selected.animal
    ?`Jugador ${selectedSetupPlayer+1}: ${selected.animal.name}`
    :`Jugador ${selectedSetupPlayer+1}: elige una ficha`;

  $("#startBtn").disabled=!players.every(player=>player.animal);
}

/* JUGADORES Y PROPIEDADES */

function renderPlayers(){
  const list=$("#playersList");
  list.innerHTML="";

  players.forEach((player,index)=>{
    const row=document.createElement("div");
    row.className="player-row";

    if(started&&index===currentPlayer){
      row.classList.add("active");
    }

    const avatar=document.createElement("div");
    avatar.className="player-avatar";
    avatar.textContent=player.animal?.emoji||"?";
    avatar.style.setProperty(
      "--player-color",
      player.animal?.color||"#363841"
    );

    const details=document.createElement("div");

    const name=document.createElement("div");
    name.className="player-name";
    name.textContent=player.name;

    if(started&&index===currentPlayer){
      const chip=document.createElement("span");
      chip.className="turn-chip";
      chip.textContent="TURNO";
      name.append(chip);
    }

    const subtitle=document.createElement("div");
    subtitle.className="player-sub";
    subtitle.textContent=
      `${player.animal?.name||"Sin ficha"} · Casilla ${player.position}`;

    details.append(name,subtitle);

    const money=document.createElement("div");
    money.className="player-money";
    money.textContent=`$${player.money}`;

    const small=document.createElement("small");
    small.textContent="SALDO";
    money.append(small);

    row.append(avatar,details,money);
    list.append(row);
  });

  renderMyProperties();
}

function renderMyProperties(){
  const list=$("#myPropertiesList");
  const label=$("#propertyOwnerLabel");
  const count=$("#propertyCount");

  if(!list||!label||!count) return;

  const player=players[currentPlayer];

  if(!player){
    list.innerHTML='<p class="property-empty">Aún no hay jugadores.</p>';
    return;
  }

  const owned=spaces.filter(space=>space.owner===currentPlayer);

  label.textContent=`Propiedades de ${player.name}`;
  count.textContent=`${owned.length} PROPIEDAD${owned.length===1?"":"ES"}`;

  list.innerHTML="";

  if(owned.length===0){
    list.innerHTML='<p class="property-empty">Aún no tienes propiedades.</p>';
    return;
  }

  owned.forEach(space=>{
    const type=COLORS[space.difficulty];

    const card=document.createElement("div");
    card.className="property-card";

    const symbol=document.createElement("div");
    symbol.className="property-card-symbol";
    symbol.style.setProperty("--property-color",type.color);
    symbol.textContent=space.symbol;

    const info=document.createElement("div");
    info.className="property-card-info";

    const title=document.createElement("strong");
    title.textContent=`Casilla ${space.index}`;

    const details=document.createElement("small");
    details.textContent=
      `${type.name} · Alquiler $${type.rent}`;

    info.append(title,details);

    const price=document.createElement("div");
    price.className="property-card-price";
    price.textContent=`$${space.price}`;

    card.append(symbol,info,price);
    list.append(card);
  });
}

function renderTokens(){
  document.querySelectorAll(".tokens").forEach(el=>{
    el.innerHTML="";
  });

  players.forEach(player=>{
    const holder=document.querySelector(
      `.tokens[data-tokens="${player.position}"]`
    );

    if(!holder||!player.animal) return;

    const token=document.createElement("span");
    token.className="token-mini";
    token.textContent=player.animal.emoji;
    token.title=player.name;

    token.style.color=player.animal.color;
    token.style.textShadow=`0 0 8px ${player.animal.color}`;

    holder.append(token);
  });

  spaces.forEach(space=>{
    const cell=document.querySelector(
      `.space[data-index="${space.index}"]`
    );

    if(!cell) return;

    cell.querySelector(".owner-mark")?.remove();

    if(space.owner!==null){
      const mark=document.createElement("span");
      mark.className="owner-mark";
      mark.title=`Propiedad de ${players[space.owner].name}`;
      mark.style.background=players[space.owner].animal.color;
      cell.append(mark);
    }
  });
}

/* HISTORIAL Y AVISOS */

function addLog(message){
  const list=$("#logList");
  list.querySelector(".empty-log")?.remove();

  const entry=document.createElement("div");
  entry.className="log-entry";

  const dot=document.createElement("span");
  dot.className="log-dot";

  const text=document.createElement("span");
  text.textContent=message;

  entry.append(dot,text);
  list.prepend(entry);

  while(list.children.length>6){
    list.lastElementChild.remove();
  }
}

function showToast(message){
  const toast=$("#toast");
  toast.textContent=message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout=setTimeout(()=>{
    toast.classList.remove("show");
  },2300);
}

/* INICIAR PARTIDA */

function startGame(){
  if(!players.every(player=>player.animal)) return;

  started=true;
  shuffleSurpriseDeck();

  $("#setupPanel").classList.add("hidden");
  $("#rollBtn").disabled=false;
  $("#rollHelp").textContent="Lanza los dados para avanzar.";
  $("#centerStatus").textContent="LA PARTIDA ESTÁ EN CURSO";

  addLog("La partida ha comenzado. Todos reciben $800.");

  updateTurnLabel();
  renderPlayers();
  renderTokens();
}

/* DADOS Y MOVIMIENTO */

function rollDice(){
  if(!started||challenge||isMoving) return;

  const player=players[currentPlayer];

  if(player.skipNext){
    player.skipNext=false;
    player.inJail=false;

    addLog(`${player.name} pierde este turno por estar detenido.`);
    showToast(`${player.name} pierde su turno.`);

    nextTurn();
    return;
  }

  const d1=1+Math.floor(Math.random()*6);
  const d2=1+Math.floor(Math.random()*6);
  const total=d1+d2;

  $("#rollBtn").disabled=true;
  $("#dieOne").classList.add("rolling");
  $("#dieTwo").classList.add("rolling");
  $("#diceMessage").textContent="Los dados están rodando...";

  setTimeout(()=>{
    $("#dieOne").classList.remove("rolling");
    $("#dieTwo").classList.remove("rolling");

    $("#dieOne").dataset.value=d1;
    $("#dieTwo").dataset.value=d2;

    $("#diceMessage").textContent=`${d1} + ${d2} casillas`;
    $("#diceTotal").textContent=total;

    movePlayer(total);
  },650);
}

async function movePlayer(steps){
  if(isMoving) return;

  isMoving=true;

  const player=players[currentPlayer];
  const direction=steps>=0?1:-1;
  const count=Math.abs(steps);

  let passedStart=false;

  for(let step=0;step<count;step++){
    const next=(player.position+direction+40)%40;

    if(direction===1&&next===0){
      passedStart=true;
    }

    player.position=next;

    renderTokens();
    renderPlayers();

    const cell=document.querySelector(
      `.space[data-index="${next}"]`
    );

    cell?.classList.add("moving-to");

    await new Promise(resolve=>setTimeout(resolve,280));

    cell?.classList.remove("moving-to");
  }

  if(passedStart){
    const bonus=200+player.startBonus;
    player.money+=bonus;

    addLog(
      `${player.name} pasó por Inicio y recibió $${bonus}.`
    );

    player.startBonus=0;
  }

  isMoving=false;

  const space=spaces[player.position];

  addLog(`${player.name} llegó a la casilla ${space.index}.`);

  renderPlayers();
  renderTokens();

  if(space.type==="property"){
    landOnProperty(space,player);
  }else if(space.type==="police"){
    player.position=10;
    player.inJail=true;

    addLog(`${player.name} fue enviado a la cárcel.`);

    renderPlayers();
    renderTokens();

    openPrison(true);
  }else if(space.type==="prison"){
    player.inJail=true;
    openPrison(false);
  }else if(space.type==="surprise"){
    openSurprise();
  }else{
    showToast("Has llegado a Inicio.");
    nextTurn();
  }
}

/* TURNOS */

function updateTurnLabel(){
  $("#turnLabel").textContent=started
    ?`TURNO DE ${players[currentPlayer].name.toUpperCase()}`
    :"PREPARANDO PARTIDA";
}

function nextTurn(){
  currentPlayer=(currentPlayer+1)%players.length;

  if(currentPlayer===0){
    round++;
  }

  $("#roundNumber").textContent=String(round).padStart(2,"0");
  $("#roundNumberMobile").textContent=String(round).padStart(2,"0");

  updateTurnLabel();
  renderPlayers();
  renderTokens();

  $("#rollBtn").disabled=!started;
  $("#rollHelp").textContent="Lanza los dados para avanzar.";
}

/* SISTEMA DE EJERCICIOS */

function openChallenge(options){
  clearInterval(timerInterval);

  challenge={...options,answered:false};

  const player=players[currentPlayer];

  let timeLeft=options.time+(player.extraTime||0);

  player.extraTime=0;

  $("#modalCategory").textContent=options.category;
  $("#modalTitle").textContent=options.title;
  $("#modalDescription").textContent=options.description;
  $("#modalSymbol").textContent=options.symbol||"∑";
  $("#questionText").textContent=options.question.q;
  $("#timerText").textContent=formatTime(timeLeft);
  $("#modalFeedback").textContent="";
  $("#modalFeedback").className="feedback";
  $("#modalActions").innerHTML="";

  $("#timerBox").classList.remove("hidden");
  $("#questionBox").classList.remove("hidden");
  $("#answerForm").classList.remove("hidden");

  $("#answerInput").value="";
  $("#answerInput").disabled=false;

  $("#modalBackdrop").classList.remove("hidden");
  $("#rollBtn").disabled=true;

  timerInterval=setInterval(()=>{
    if(!challenge||challenge.answered) return;

    timeLeft--;

    $("#timerText").textContent=formatTime(Math.max(0,timeLeft));

    if(timeLeft<=0){
      clearInterval(timerInterval);
      resolveAnswer(false,true);
    }
  },1000);

  setTimeout(()=>$("#answerInput").focus(),100);
}

function submitAnswer(event){
  event.preventDefault();

  if(!challenge||challenge.answered) return;

  const correct=
    normalizeAnswer($("#answerInput").value)===
    normalizeAnswer(challenge.question.a);

  resolveAnswer(correct,false);
}

function addModalButton(label,callback,primary=false){
  const button=document.createElement("button");

  button.className=primary
    ?"primary-button compact"
    :"secondary-button";

  button.textContent=label;
  button.addEventListener("click",callback);

  $("#modalActions").append(button);
}

function resolveAnswer(correct,timedOut){
  if(!challenge||challenge.answered) return;

  clearInterval(timerInterval);

  challenge.answered=true;
  $("#answerInput").disabled=true;
  $("#answerForm").classList.add("hidden");

  const c=challenge;
  const player=players[currentPlayer];

  $("#modalFeedback").textContent=correct
    ?"¡Correcto! Has resuelto el ejercicio."
    :`Respuesta incorrecta. ${timedOut?"Se acabó el tiempo.":""} Respuesta: ${c.question.a}`;

  $("#modalFeedback").className=
    correct?"feedback":"feedback bad";

  $("#modalActions").innerHTML="";

  if(c.kind==="property"){
    handlePropertyAnswer(c,player,correct);
  }else if(c.kind==="owned"){
    handleOwnedAnswer(c,player,correct);
  }else if(c.kind==="prison"){
    if(correct){
      player.inJail=false;

      $("#modalDescription").textContent=
        "¡Has resuelto el reto! Ya puedes salir de la cárcel.";

      addModalButton("Salir de la cárcel",finishChallenge,true);
    }else{
      player.inJail=true;
      player.skipNext=true;

      $("#modalDescription").textContent=
        "No has logrado salir. Perderás tu próximo turno.";

      addModalButton("Aceptar",finishChallenge,true);
    }
  }else if(c.kind==="rentChallenge"){
    handleRentChallenge(c,player,correct);
  }

  renderPlayers();
  renderTokens();
}

/* PROPIEDADES */

function landOnProperty(space,player){
  const color=COLORS[space.difficulty];

  if(space.owner===null){
    openChallenge({
      kind:"property",
      category:`PROPIEDAD · ${color.name}`,
      title:"Oportunidad de compra",
      description:
        `Resuelve el ejercicio para poder comprar esta propiedad por $${space.price}.`,
      symbol:color.symbol,
      time:color.time,
      question:randomQuestion(space.difficulty),
      space
    });

    return;
  }

  if(space.owner===currentPlayer){
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

  let rent=color.rent;

  if(player.rentShield){
    player.rentShield=false;

    showToast("Tu protección financiera evitó el alquiler.");

    addLog(`${player.name} utilizó su protección de alquiler.`);
    nextTurn();
    return;
  }

  if(
    player.discountTarget&&
    player.discountTarget.spaceIndex===space.index&&
    player.discountTarget.owner===space.owner
  ){
    rent=Math.ceil(rent/2);
    player.discountTarget=null;
  }

  const higher={
    green:"blue",
    blue:"purple",
    purple:"red",
    red:"red"
  }[space.difficulty];

  openChallenge({
    kind:"rentChallenge",
    category:`RETO · ${COLORS[higher].name}`,
    title:"Propiedad ajena",
    description:
      `Propiedad de ${players[space.owner].name}. Puedes pagar $${rent} o intentar un ejercicio de mayor dificultad para evitar el alquiler.`,
    symbol:COLORS[higher].symbol,
    time:COLORS[higher].time,
    question:randomQuestion(higher),
    space,
    rent,
    higherDifficulty:higher
  });

  addModalButton(`Pagar alquiler · $${rent}`,()=>{
    if(!challenge||challenge.answered) return;

    const paid=chargePlayer(player,rent);

    players[space.owner].money+=paid;

    addLog(`${player.name} pagó $${paid} de alquiler.`);
    finishChallenge();
  });
}

function handlePropertyAnswer(c,player,correct){
  const space=c.space;

  if(correct){
    $("#modalDescription").textContent=
      `Puedes comprar esta propiedad por $${space.price}.`;

    addModalButton(
      `Comprar · $${space.price}`,
      ()=>buyProperty(space,player,space.price),
      true
    );

    addModalButton("No comprar",finishChallenge);
  }else{
    $("#modalDescription").textContent=
      "No has resuelto el ejercicio. No puedes comprar esta propiedad en este turno.";

    addModalButton("Continuar",finishChallenge,true);
  }
}

function handleOwnedAnswer(c,player,correct){
  $("#modalDescription").textContent=correct
    ?"¡Correcto! Has demostrado tus conocimientos."
    :"No te preocupes. Podrás intentarlo en otra ocasión.";

  addModalButton("Continuar",finishChallenge,true);
}

function handleRentChallenge(c,player,correct){
  const space=c.space;
  const ownerIndex=space.owner;
  const rent=c.rent;

  if(correct){
    $("#modalDescription").textContent=
      "¡Correcto! Evitas el alquiler de esta propiedad.";

    addModalButton("Continuar sin pagar",finishChallenge,true);
    return;
  }

  if(player.mistakeShield){
    player.mistakeShield=false;

    $("#modalDescription").textContent=
      "Tu segunda oportunidad te protege. No debes pagar el alquiler.";

    addLog(`${player.name} utilizó su segunda oportunidad.`);
    addModalButton("Continuar",finishChallenge,true);
    return;
  }

  const paid=chargePlayer(player,rent);
  players[ownerIndex].money+=paid;

  addLog(`${player.name} falló el reto y pagó $${paid} de alquiler.`);

  $("#modalDescription").textContent=
    `Has fallado el ejercicio y debes pagar $${paid} al propietario.`;

  addModalButton("Pagar y continuar",finishChallenge,true);
}

function buyProperty(space,player,price){
  if(player.money<price){
    $("#modalDescription").textContent=
      `No tienes suficiente dinero. Necesitas $${price}.`;

    $("#modalActions").innerHTML="";
    addModalButton("Continuar",finishChallenge,true);
    return;
  }

  player.money-=price;
  space.owner=currentPlayer;

  addLog(
    `${player.name} compró la propiedad de la casilla ${space.index} por $${price}.`
  );

  renderTokens();
  renderPlayers();

  finishChallenge();
}

/* CÁRCEL */

function openPrison(sentByPolice){
  openChallenge({
    kind:"prison",
    category:sentByPolice?"POLICÍA · DETENCIÓN":"CÁRCEL",
    title:sentByPolice?"¡Te han detenido!":"La cárcel",
    description:sentByPolice
      ?"El policía te ha enviado a la cárcel. Resuelve el ejercicio para salir."
      :"Has caído en la cárcel. Resuelve el reto para salir.",
    symbol:sentByPolice?"♜":"▤",
    time:25,
    question:randomQuestion("blue")
  });
}

/* CARTAS SORPRESA */

function openSurprise(){
  const card=drawSurpriseCard();
  const player=players[currentPlayer];

  challenge={
    kind:"surpriseCard",
    answered:true,
    card
  };

  $("#modalCategory").textContent="CARTA SORPRESA";
  $("#modalTitle").textContent=card.title;
  $("#modalDescription").textContent=card.description;
  $("#modalSymbol").textContent="✧";
  $("#modalFeedback").textContent="";
  $("#modalFeedback").className="feedback";

  $("#timerBox").classList.add("hidden");
  $("#questionBox").classList.add("hidden");
  $("#answerForm").classList.add("hidden");

  $("#modalActions").innerHTML="";
  $("#modalBackdrop").classList.remove("hidden");
  $("#rollBtn").disabled=true;

  addLog(`${player.name} obtuvo la carta: ${card.title}.`);

  let movement=null;

  switch(card.effect){
    case "money":
      player.money+=card.value;
      break;

    case "loss":{
      const paid=chargePlayer(player,card.value);
      $("#modalDescription").textContent=
        `${card.description} Has pagado $${paid}.`;
      break;
    }

    case "perProperty":{
      const count=spaces.filter(s=>s.owner===currentPlayer).length;
      const amount=count*card.value;

      player.money+=amount;

      $("#modalDescription").textContent=
        `${card.description} Recibes $${amount}.`;
      break;
    }

    case "propertyLoss":{
      const count=spaces.filter(s=>s.owner===currentPlayer).length;
      const amount=count*card.value;
      const paid=chargePlayer(player,amount);

      $("#modalDescription").textContent=
        `${card.description} Has pagado $${paid}.`;
      break;
    }

    case "move":
      movement=card.value;
      break;

    case "mistakeShield":
      player.mistakeShield=true;
      break;

    case "rentShield":
      player.rentShield=true;
      break;

    case "startBonus":
      player.startBonus+=card.value;
      break;

    case "extraTime":
      player.extraTime+=card.value;
      break;

    case "trade":
      $("#modalDescription").textContent=
        "Puedes proponer un intercambio. Si ambos jugadores aceptan, las propiedades cambiarán de dueño.";

      addModalButton("Proponer intercambio",()=>{
        proposeTrade();
      },true);
      break;

    case "discount":
      chooseDiscountTarget();
      break;
  }

  renderPlayers();

  if(movement!==null){
    addModalButton("Aplicar movimiento",()=>{
      finishChallenge(false);
      movePlayer(movement);
    },true);
  }else{
    addModalButton("Continuar",finishChallenge,true);
  }
}

/* INTERCAMBIO DE PROPIEDADES */

function proposeTrade(){
  const player=players[currentPlayer];

  const ownProperties=spaces.filter(s=>s.owner===currentPlayer);

  if(ownProperties.length===0){
    showToast("No tienes propiedades para intercambiar.");
    return;
  }

  const opponents=players
    .map((p,index)=>({player:p,index}))
    .filter(item=>
      item.index!==currentPlayer&&
      spaces.some(s=>s.owner===item.index)
    );

  if(opponents.length===0){
    showToast("Ningún rival tiene propiedades para intercambiar.");
    return;
  }

  const opponentList=opponents
    .map(item=>`${item.index+1}: ${item.player.name}`)
    .join("\n");

  const opponentNumber=Number(prompt(
    `Elige el jugador rival escribiendo su número:\n${opponentList}`
  ));

  const opponent=opponents.find(item=>item.index===opponentNumber-1);

  if(!opponent){
    showToast("Jugador no válido.");
    return;
  }

  const rivalProperties=spaces.filter(
    s=>s.owner===opponent.index
  );

  const ownList=ownProperties.map(s=>
    `Casilla ${s.index} ($${s.price})`
  ).join("\n");

  const rivalList=rivalProperties.map(s=>
    `Casilla ${s.index} ($${s.price})`
  ).join("\n");

  const ownIndex=Number(prompt(
    `¿Qué propiedad tuya deseas ofrecer?\n${ownList}\nEscribe el número de casilla:`
  ));

  const mySpace=ownProperties.find(s=>s.index===ownIndex);

  if(!mySpace){
    showToast("Tu propiedad no es válida.");
    return;
  }

  const rivalIndex=Number(prompt(
    `¿Qué propiedad deseas recibir?\n${rivalList}\nEscribe el número de casilla:`
  ));

  const rivalSpace=rivalProperties.find(s=>s.index===rivalIndex);

  if(!rivalSpace){
    showToast("La propiedad rival no es válida.");
    return;
  }

  const accepted=confirm(
    `${opponent.player.name}, ¿aceptas intercambiar la casilla ${rivalSpace.index} por la casilla ${mySpace.index}?`
  );

  if(!accepted){
    showToast("El intercambio fue rechazado.");
    return;
  }

  mySpace.owner=opponent.index;
  rivalSpace.owner=currentPlayer;

  addLog(
    `${player.name} y ${opponent.player.name} intercambiaron propiedades.`
  );

  renderTokens();
  renderPlayers();

  $("#modalDescription").textContent=
    "¡Intercambio realizado! Las dos propiedades han cambiado de dueño.";

  $("#modalActions").innerHTML="";
  addModalButton("Continuar",finishChallenge,true);
}

/* DESCUENTO DE ALQUILER */

function chooseDiscountTarget(){
  const opponents=players
    .map((p,index)=>({player:p,index}))
    .filter(item=>
      item.index!==currentPlayer&&
      spaces.some(s=>s.owner===item.index)
    );

  if(opponents.length===0){
    $("#modalDescription").textContent=
      "Todavía no hay propiedades rivales. No puedes usar esta ventaja.";
    return;
  }

  const list=opponents.map(item=>
    `${item.index+1}: ${item.player.name}`
  ).join("\n");

  const number=Number(prompt(
    `Elige un rival:\n${list}`
  ));

  const opponent=opponents.find(item=>item.index===number-1);

  if(!opponent){
    $("#modalDescription").textContent=
      "No seleccionaste un rival válido. La ventaja no se ha aplicado.";
    return;
  }

  const properties=spaces.filter(s=>s.owner===opponent.index);

  const propertyList=properties.map(s=>
    `Casilla ${s.index} · Alquiler $${COLORS[s.difficulty].rent}`
  ).join("\n");

  const propertyNumber=Number(prompt(
    `Elige una propiedad:\n${propertyList}\nEscribe el número de casilla:`
  ));

  const target=properties.find(s=>s.index===propertyNumber);

  if(!target){
    $("#modalDescription").textContent=
      "No seleccionaste una propiedad válida. La ventaja no se ha aplicado.";
    return;
  }

  players[currentPlayer].discountTarget={
    owner:opponent.index,
    spaceIndex:target.index
  };

  $("#modalDescription").textContent=
    `La próxima vez que caigas en la casilla ${target.index}, pagarás la mitad del alquiler.`;
}

/* CERRAR RETOS */

function finishChallenge(advanceTurn=true){
  clearInterval(timerInterval);

  $("#modalBackdrop").classList.add("hidden");
  $("#timerBox").classList.remove("hidden");
  $("#questionBox").classList.remove("hidden");

  challenge=null;

  renderPlayers();
  renderTokens();

  if(advanceTurn){
    nextTurn();
  }
}

/* REINICIAR */

function resetGame(){
  clearInterval(timerInterval);

  challenge=null;
  started=false;
  isMoving=false;

  currentPlayer=0;
  round=1;
  selectedSetupPlayer=0;

  surpriseDeck=[];

  createPlayers();
  createSpaces();

  renderBoard();
  renderSetup();
  renderPlayers();

  $("#setupPanel").classList.remove("hidden");
  $("#modalBackdrop").classList.add("hidden");

  $("#rollBtn").disabled=true;
  $("#rollHelp").textContent=
    "Los cuatro jugadores deben elegir un animal.";

  $("#diceMessage").textContent="Listos para jugar";
  $("#diceTotal").textContent="—";

  $("#dieOne").dataset.value=1;
  $("#dieTwo").dataset.value=1;

  $("#roundNumber").textContent="01";
  $("#roundNumberMobile").textContent="01";

  $("#turnLabel").textContent="PREPARANDO PARTIDA";
  $("#centerStatus").textContent="ELIGE TUS FICHAS PARA COMENZAR";

  $("#logList").innerHTML=
    '<p class="empty-log">La partida aún no ha comenzado.</p>';
}

/* EVENTOS */

$("#startBtn").addEventListener("click",startGame);
$("#rollBtn").addEventListener("click",rollDice);
$("#answerForm").addEventListener("submit",submitAnswer);

$("#closeModal").addEventListener("click",()=>{
  if(!challenge) return;

  if(!challenge.answered){
    showToast("Debes responder o esperar a que termine el tiempo.");
    return;
  }

  finishChallenge();
});

$("#resetBtn").addEventListener("click",()=>{
  if(confirm("¿Quieres reiniciar toda la partida?")){
    resetGame();
  }
});

$("#modalBackdrop").addEventListener("click",event=>{
  if(
    event.target===$("#modalBackdrop")&&
    challenge?.answered
  ){
    finishChallenge();
  }
});

/* ARRANQUE INICIAL */

resetGame();
