let cards = [
    {id: 1, value: '☆'},
    {id: 2, value: 'J'},
    {id: 3, value: 'A'},
    {id: 4, value: 'C'},
    {id: 5, value: 'K'},
    {id: 6, value: 'P'},
    {id: 7, value: 'O'},
    {id: 8, value: 'T'},
    {id: 9, value: '☆'}
];

let flippedCards = [];  // ひっくり返したカードの情報
let isGameOver = false;  // ゲームオーバー判定
let gameStarted = false; // ゲーム開始判定

// サイコロを振る関数
function rollDice() {
    if (isGameOver) return;

    gameStarted = true; // ゲーム開始フラグを有効化
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-result').innerText = `サイコロの目: ${dice1} と ${dice2}`;

    if (dice1 === dice2) {
        revertOrFlipCard(dice1); // ゾロ目の場合は該当のカードを戻すかひっくり返す
    } else {
        handleFlip(dice1, dice2);
    }
}

// ゾロ目の場合に対応するカードを元に戻すか、文字に変える
function revertOrFlipCard(dice) {
    const card = document.getElementById(`card-${dice}`);
    if (flippedCards.includes(dice)) {
        // 既にひっくり返っている場合は数字に戻す
        card.classList.remove('flipped');
        card.innerText = dice;
        flippedCards = flippedCards.filter(id => id !== dice); // リストから削除
    } else {
        // ひっくり返っていない場合は文字に変える
        const cardData = cards.find(c => c.id === dice);
        card.innerText = cardData.value;
        card.classList.add('flipped');
        flippedCards.push(dice);
    }
}

// カードをひっくり返す関数
function handleFlip(dice1, dice2) {
    const positions = [dice1, dice2, dice1 + dice2];
    let flipOccurred = false;

    positions.forEach(position => {
        if (position >= 1 && position <= 9 && !flippedCards.includes(position)) {
            const card = document.getElementById(`card-${position}`);
            const cardData = cards.find(card => card.id === position);
            card.innerText = cardData.value;
            card.classList.add('flipped');
            flippedCards.push(position);
            flipOccurred = true;
        }
    });

    checkGameOver(flipOccurred);
}

// ゲーム終了判定
function checkGameOver(flipOccurred) {
    if (flippedCards.length === 9) {
        document.getElementById('status').innerText = "ジャックポットを揃えました！";
        isGameOver = true;
    } else if (!flipOccurred) {
        document.getElementById('status').innerText = "カードをひっくり返せませんでした。あなたの負けです！";
        isGameOver = true;
    }
}

// ゲームのリセット関数
function resetGame() {
    flippedCards = [];
    isGameOver = false;
    gameStarted = false; // ゲーム開始フラグをリセット
    document.getElementById('status').innerText = "ゲームが始まりました！";
    document.getElementById('dice-result').innerText = "";
    document.querySelectorAll('.card').forEach((card, index) => {
        card.classList.remove('flipped');
        card.innerText = index + 1; // 初期状態では数字を表示
    });
}

// カードクリック時のイベント
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        // ゲーム開始前やゲーム終了後はクリックを無効化
        if (!gameStarted || isGameOver) return;

        // すでにひっくり返っているカードは無視
        if (!card.classList.contains('flipped')) {
            card.classList.add('flipped');
            const cardId = parseInt(card.id.split('-')[1]);
            const cardData = cards.find(c => c.id === cardId);
            card.innerText = cardData.value;
        }
    });
});
