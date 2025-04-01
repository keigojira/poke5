// assets/js/script.js（今回はルートに配置していますが、assets/js/に配置する場合はパスを合わせる）
document.addEventListener("DOMContentLoaded", function () {
  // ゲームの基本データ
  const cards = [
    { name: 'ピカチュウ', type: 'でんき', hp: 50, attack: 20, ability: 'かみなり', evolution: 'ライチュウ' },
    { name: 'フシギダネ', type: 'くさ', hp: 60, attack: 15, ability: 'はっぱカッター', evolution: 'フシギソウ' },
    { name: 'ヒトカゲ', type: 'ほのお', hp: 40, attack: 25, ability: 'ひのこ', evolution: 'リザード' },
    { name: 'ゼニガメ', type: 'みず', hp: 50, attack: 18, ability: 'みずでっぽう', evolution: 'カメール' }
  ];

  let playerDeck = [];
  let opponentDeck = [];
  let playerEnergy = 3;
  let opponentEnergy = 3;
  let playerTurn = true;
  let playerPokemon = { name: 'ピカチュウ', hp: 50 };  // 簡易的に設定
  let opponentPokemon = { name: 'フシギダネ', hp: 60 };

  // ゲームの初期化
  function initializeGame() {
    playerDeck = generateDeck();
    opponentDeck = generateDeck();

    dealCards(playerDeck, 'player-hand');
    dealCards(opponentDeck, 'opponent-hand');

    startTurn();
  }

  // デッキ生成（ここでは全カードを使用）
  function generateDeck() {
    return [...cards];
  }

  // カードを手札に配布
  function dealCards(deck, areaId) {
    const handArea = document.getElementById(areaId);
    handArea.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const card = deck[i];
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      // ドラッグ可能に設定（オプション）
      cardDiv.setAttribute('draggable', 'true');
      cardDiv.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <h3>${card.name}</h3>
            <p>HP: ${card.hp}</p>
            <p>技: ${card.ability}</p>
          </div>
          <div class="card-back">
            <p>進化: ${card.evolution}</p>
          </div>
        </div>
      `;
      // カード詳細の表示
      cardDiv.addEventListener('click', () => showCardDetails(card));
      handArea.appendChild(cardDiv);
    }
  }

  // ゲームログの更新
  function updateGameLog(message) {
    const logArea = document.getElementById('game-log');
    logArea.innerHTML = message;
  }

  // カード詳細を表示
  function showCardDetails(card) {
    const detailsArea = document.getElementById('card-details');
    detailsArea.style.display = 'block';
    detailsArea.innerHTML = `
      <h2>${card.name}</h2>
      <p>タイプ: ${card.type}</p>
      <p>HP: ${card.hp}</p>
      <p>攻撃: ${card.attack}</p>
      <p>技: ${card.ability}</p>
      <p>進化: ${card.evolution}</p>
      <button onclick="hideCardDetails()">閉じる</button>
    `;
  }

  // 詳細を隠す
  window.hideCardDetails = function () {
    const detailsArea = document.getElementById('card-details');
    detailsArea.style.display = 'none';
  };

  // プレイヤーがカードを選んだときの処理（アニメーション付き）
  function onCardClick(card) {
    if (!playerTurn) return;
    const cardElement = document.querySelector(`.card h3:contains("${card.name}")`);
    // ※ jQuery風のセレクタは使用できないので、ここではシンプルにすべてのカードにアニメーションを追加する例とする
    document.querySelectorAll('.card').forEach(el => el.classList.add('animation'));

    setTimeout(() => {
      updateGameLog(`${card.name}の技「${card.ability}」を使用！`);
      opponentPokemon.hp -= card.attack;

      if (opponentPokemon.hp <= 0) {
        updateGameLog(`${opponentPokemon.name}を倒しました！`);
        opponentPokemon = null;
      }

      playerTurn = false;
      opponentTurn();
    }, 1000);

    setTimeout(() => {
      document.querySelectorAll('.card').forEach(el => el.classList.remove('animation'));
    }, 1500);
  }

  // 相手のターン
  function opponentTurn() {
    setTimeout(() => {
      const randomCard = opponentDeck[Math.floor(Math.random() * opponentDeck.length)];
      updateGameLog(`相手が技「${randomCard.ability}」を使用！`);
      opponentPokemon.hp -= randomCard.attack;

      if (opponentPokemon.hp <= 0) {
        updateGameLog(`${opponentPokemon.name}を倒しました！`);
        opponentPokemon = null;
      }

      playerTurn = true;
      updateGameLog('あなたのターンです');
    }, 1500);
  }

  // ターン開始時の処理
  function startTurn() {
    updateGameLog(`あなたのターンです。あなたのポケモン: ${playerPokemon.name} (HP: ${playerPokemon.hp})`);
    // ターン開始時にエネルギー回復
    playerEnergy = Math.min(playerEnergy + 1, 10);
    opponentEnergy = Math.min(opponentEnergy + 1, 10);
    document.getElementById('player-energy').textContent = playerEnergy;
    document.getElementById('opponent-energy').textContent = opponentEnergy;
  }

  // 初期化
  initializeGame();
});
