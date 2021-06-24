//Klasy Pomocniczne
/////////////////////////////////////////////////////////////////////////////////////////

//1) do tworzenia szkieletu HTML

class AppElement {
  constructor(className, text, hook) {
    this.className = className;
    this.innerHTML = text;
    this.hookName = hook;
  }
}

//2) do tworzenia elemtenu i jego umiejscowienie w DOM

class RenderComponent {
  constructor(hookId) {
    this.hookId = hookId;
  }

  createRootElement(tag, cssClass, appendToHook = true) {
    const rootElement = document.createElement(tag);
    if (cssClass) {
      rootElement.className = cssClass;
    }
    if (appendToHook) {
      document.querySelector(this.hookId).appendChild(rootElement);
    }
    return rootElement;
  }
}

class PageMask {
  constructor(turnedOff) {
    this.turnedOff = turnedOff;
    this.mask = document.querySelector(".page-mask");
    this.maskSwitch(turnedOff);
  }

  maskSwitch(turnOnOff) {
    console.log(turnOnOff);
    if (turnOnOff) {
      this.mask.style.display = "block";
      setTimeout(() => {
        this.mask.classList.add("page-mask-active");
      }, 1);
    } else {
      this.mask.classList.remove("page-mask-active");
      setTimeout(() => {
        this.mask.style.display = "none";
      }, 500);
    }

    // turnOnOff ? this.mask.classList.remove('page-mask-active') : this.mask.classList.add('page-mask-active');
  }
}

class RenderTableElements {
  constructor(table, headData, bodyData) {
    this.table = table;
    this.headData = headData;
    this.bodyData = bodyData;
    this.renderTable();
  }

  renderTableHead() {
    let thead = this.table.createTHead();
    let row = thead.insertRow();
    for (let val of this.headData) {
      let th = document.createElement("th");
      let text = document.createTextNode(val);
      th.appendChild(text);
      row.appendChild(th);
    }
  }

  renderTable() {
    // let tbody = this.table.createTBody();
    for (let element of this.bodyData) {
      let row = this.table.insertRow();
      for (let key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
      console.log(row);
    }
    this.renderTableHead();
  }

  addColSpan(element, colSpan) {
    element.colSpan = colSpan;
  }
}

//Koniec Klas Pomocniczych
/////////////////////////////////////////////////////////////////////////////////////////

class RankingStorage {
  constructor() {
    this.rank = this.getRank();
    console.log(this.rank);
    // this.saveScore();
    this.playerPoints = 12;
    this.playerName;
    this.checkPosition();
  }

  getRank() {
    if (localStorage.getItem("rank")) {
      return JSON.parse(localStorage.getItem("rank"));
    } else {
      return [
        { points: 0, name: "..." },
        { points: 0, name: "..." },
        { points: 0, name: "..." },
      ];
    }
  }

  checkPosition() {
    let isPlacedInRank = this.rank.some((element) => {
      console.log(element.points);
      return this.playerPoints > element.points ? true : false;
    });
    console.log(isPlacedInRank);
    isPlacedInRank ? this.getNamePrompt() : console.log(`nie tym razem`);
  }

  getNamePrompt() {
    let prompt = document.querySelector(".prompt");
    let submitName = document.querySelector(".submitName");
    let inputName = document.getElementById("name");
    prompt.style.zIndex = 1;
    prompt.style.display = "flex";

    setTimeout(() => {
      prompt.classList.add("pop");
      new PageMask(true);
    }, 100);

    // prompt.style.width = '60vw';
    submitName.addEventListener("click", () => {
      this.playerName = document.getElementById("name").value;
      setTimeout(() => {
        prompt.style.display = "none";
      }, 100);
      new PageMask(false);
      this.saveScore();
    });

    inputName.addEventListener("keyup", function (e) {
      console.log(e);
      if (e.key === "Enter") {
        submitName.click();
      }
    });
  }

  saveScore() {
    // this.playerName = prompt('Podaj swoje imię!');
    // console.log(this.playerName);
    // this.rank.push();
    const newRecord = {
      points: this.playerPoints,
      name: this.playerName,
    };

    console.log(newRecord);

    this.rank.push(newRecord);
    this.rank.sort((a, b) =>
      a.points < b.points ? 1 : b.points < a.points ? -1 : 0
    );
    this.rank.pop();

    console.dir(this.rank);

    localStorage.setItem("rank", JSON.stringify(this.rank));
  }

  renderRankTable() {}

  clearRank() {}
}

class InfoPages extends RenderComponent {
  infoPages = [];

  constructor(hookId) {
    super(hookId);
    this.createPages();
  }

  //tworzenie dwóch stron z informacjami 'extra' - instrukacja gry oraz ranking

  createPages() {
    this.infoPages = [
      new AppElement(
        "howTo",
        `<h1>Jak grać ?</h1>
            <section>
                <ol>
                    <li>Utwórz słowa z podanych liter</li>
                    <li>Aby zatwierdzić kliknij w dowolne miejsce poza planszą</li>
                    <li>Nie musisz grać do odganięcia wszystkich słów! Zawsze możesz kliknąć zakończ!</li>
                </ol>
                <p>PRZYJMENEJ ZABAWY!</p>
            </section>`
      ),
      new AppElement(
        "rank",
        `
            <section>
                <table>
                
            </table>
            </section>`
      ),
    ];
    this.render();
  }

  render() {
    for (const arrEl of this.infoPages) {
      const page = this.createRootElement("div", arrEl.className);
      page.innerHTML = `${arrEl.innerHTML}`;
    }
  }
}
{
  /* <tr>
                    <th colspan="3">Ranking</th>
                </tr>
                <tr>
                    <td class="rankPlace">1</td>
                    <td class="rankName">BAQ</td>
                    <td class="rankPoints">35</td>
                </tr>
                <tr>
                    <td class="rankPlace">2</td>
                    <td class="rankName">SAM</td>
                    <td class="rankPoints">33</td>
                </tr>
                <tr>
                    <td class="rankPlace">3</td>
                    <td class="rankName">To miejsce czeka na Ciebie</td>
                    <td class="rankPoints">0</td>
                </tr> */
}
//renderowanie strony startowej

class StartPage extends RenderComponent {
  constructor(hookId) {
    super(hookId);
  }

  infoPages() {
    new InfoPages("#app");
  }

  buttons() {
    new StartPageButtons(".buttonsRest");
    const rankButton = document.querySelector(".bRank");
    // rankButton.addEventListener('click', this.rankingStorage);
    // console.log('czy to jest rank ? ' + rankButton);
  }

  rankingStorage() {
    let renderRank = new RankingStorage();
    let rank = renderRank.getRank();
    console.log(rank);
    let renderTable = new RenderTableElements(
      document.querySelector("table"),
      ["Ranking"],
      rank
    );
    renderTable.addColSpan(document.querySelector("th"), 3);
  }

  hideStartPage() {
    const container = document.querySelector(".container");
    container.classList.add("visuallyHidden");
    setTimeout(() => {
      container.style.display = "none";
    }, 400);
    new BoardPageSkeleton("#app");
  }

  render() {
    const mainPage = this.createRootElement("div", "container");

    mainPage.innerHTML = `<div class="title">
            <h1>Daję Słowo!</h1>
        </div>
        <div class="buttons">
            <div class="buttonStart">
            <button id="start">START</button>
        </div>
        <div class="buttonsRest"></div>
        </div>
        <footer class="footer">
            <a href="#">Li</a>
            <a href="#">Git</a>
        </footer>
        <div class="prompt">        
            <label for="name">
                <p>Jesteś zwycięzcą!</p> 
                <p>Podaj imię!</p>
            </label>
            <input id="name" type="text" maxlength="10">
            <button class="submitName">Zapisz</button>
        </div>`;

    const startButton = document.getElementById("start");
    startButton.addEventListener("click", this.hideStartPage);

    this.infoPages();
    this.buttons();
    this.rankingStorage();
  }
}

class StartPageButtons extends RenderComponent {
  buttons = [];

  constructor(hookId) {
    super(hookId);
    this.fetchButtons();
  }

  fetchButtons() {
    this.buttons = [
      new AppElement("bHowTo", "JAK GRAĆ?", ".howTo"),
      new AppElement("bRank", "RANKING", ".rank"),
    ];
    this.render();
  }

  render() {
    for (const arrEl of this.buttons) {
      const button = this.createRootElement("button", arrEl.className);
      button.innerHTML = `${arrEl.innerHTML}`;

      button.addEventListener("click", () => {
        const hook = document.querySelector(arrEl.hookName);
        hook.style.display = "block";
        new PageMask(true);
        setTimeout(() => {
          hook.classList.add("show");
        }, 1);

        //SPRAWDZIĆ ZAWIJANIE STRON POWODUJE POJAWIENIE SIE SCROLLA

        hook.addEventListener("click", () => {
          hook.classList.remove("show");
          new PageMask(false);
          setTimeout(() => {
            hook.style.display = "none";
          }, 400);
        });
      });
    }
  }
}

class BoardPageSkeleton extends RenderComponent {
  constructor(hookId) {
    super(hookId);
    this.render();
  }

  render() {
    const boardGamePage = this.createRootElement("div", "board");
    boardGamePage.innerHTML = `
            <div class="topBar">
                <button class="actionButton backToMenu">Back</button>
                <div class="points">
                    <h1>0/0</h1>
                </div>
                <div class="score">34</div>
            </div>
            <div class="boardLetters">
                <div class="lettersContainer">
                </div>
            </div>
            <div class="functionBar">
                <div class="functionButtons">
                    <button class="actionButton newGame">New Game</button>
                    <button class="actionButton checkingWord">Sprawdź</button>
                    <button class="actionButton endGame">Zakończ Grę</button>
                </div>
                <div class="media">
                    <a href="#">Li</a>
                    <a href="#">Git</a>
                </div>
            </div>
            <div class="wordsList">
                <div>
                    <ul class = "wordsListElements">
                    </ul>
                </div>
            </div>
            <!-- <footer class="footer">
                <a href="#">Li</a>
                <a href="#">Git</a>
            </footer> -->
        `;

    const rank = document.querySelector(".score");

    rank.addEventListener("click", () => {
      const hook = document.querySelector(".rank");
      hook.style.display = "block";
      setTimeout(() => {
        new PageMask(true);
        hook.classList.add("show");
      }, 1);

      hook.addEventListener("click", () => {
        hook.classList.remove("show");
        new PageMask(false);
        setTimeout(() => {
          hook.style.display = "none";
        }, 400);
      });
    });

    this.createButtons();
    this.showBoard();
  }
  showBoard() {
    const board = document.querySelector(".board");
    const lettersContainer = document.querySelector(".lettersContainer");
    const wordsList = document.querySelector(".wordsList");
    board.style.display = "flex";
    setTimeout(() => {
      board.style.opacity = 1;
      lettersContainer.style.transform = "scale(1)";
      wordsList.style.transform = "scale(1)";
    }, 1);
  }
  createButtons() {
    new CreateBoardButtons(".lettersContainer");
    const buttons = new BoardFunctionButtons();
    buttons.addAction();
  }
}

class CreateBoardButtons extends RenderComponent {
  constructor(hookId) {
    super(hookId);
    console.log(this.createdRows);
    this.gamelogic = new GameLogic([
      "po",
      "ta",
      "to",
      "ma",
      "mam",
      "mu",
      "za",
      "do",
    ]);
  }

  //losowanie litery

  drawLetter() {
    const Pl = [
      "A",
      "Ą",
      "B",
      "C",
      "Ć",
      "D",
      "E",
      "Ę",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "Ł",
      "M",
      "N",
      "Ń",
      "O",
      "Ó",
      "P",
      "R",
      "S",
      "Ś",
      "T",
      "U",
      "W",
      "Y",
      "Z",
      "Ź",
      "Ż",
    ];

    let num = Math.floor(Math.random() * Pl.length);
    let drawedLetter = Pl[num];
    console.log("wylosowany index to " + num + " a litera to: " + drawedLetter);
    return drawedLetter;
  }

  renderSingleRow() {
    const row = this.createRootElement("div", "row");

    const buttons = [
      this.createRootElement("button", "letter", false),
      this.createRootElement("button", "letter", false),
      this.createRootElement("button", "letter", false),
    ];

    buttons.forEach((button) => {
      button.innerText = this.drawLetter();
      button.addEventListener("click", () => {
        console.log(`Wybrano przycisk z literą ${button.innerText}`);
        button.setAttribute("disabled", "true");
        this.gamelogic.createWord(button.innerText);
      });
      row.appendChild(button);
    });
    return row;
  }

  createdRows = [
    this.renderSingleRow(),
    this.renderSingleRow(),
    this.renderSingleRow(),
  ];
}

class GameLogic extends RenderComponent {
  constructor(listOfWords) {
    super();
    if (GameLogic.exists) {
      return GameLogic.instance;
    }
    GameLogic.exists = true;
    GameLogic.instance = this;

    this.rightWords = listOfWords;
    this.ammountOfWords = this.rightWords.length;
    this.guessedWord = "";
    this.score = 0;
    console.log(
      this.rightWords,
      this.ammountOfWords,
      this.guessedWord,
      this.score
    );
    return this;
  }

  createWord(letter) {
    this.guessedWord = this.guessedWord + letter;
    console.log(this.guessedWord);
    // this.checkWord();
  }

  checkWord() {
    const isCorrectWord = this.rightWords.includes(
      this.guessedWord.toLocaleLowerCase()
    );
    console.log(
      "czy " +
        this.guessedWord +
        "  jest poprawne z " +
        this.rightWords +
        " ? odp: " +
        isCorrectWord
    );
    isCorrectWord ? this.correctWord() : this.enableButtons();
  }

  correctWord() {
    this.score += 1;
    this.removeWord(this.guessedWord);
    this.renderWordOnList();
    this.enableButtons();
  }

  enableButtons() {
    const buttons = document.getElementsByClassName("letter");
    Array.from(buttons).forEach((button) => {
      button.disabled = false;
    });
    this.guessedWord = "";
  }

  removeWord(word) {
    this.rightWords = this.rightWords.filter(
      (element) => element != word.toLocaleLowerCase()
    );
    console.log(this.rightWords);
  }

  renderWordOnList() {
    const listElement = this.createRootElement("li", "wordOnList", false);
    this.hookId = document.querySelector(".wordsListElements");
    console.log(this.hookId);
    listElement.innerText = this.guessedWord;
    console.log(listElement);
    this.hookId.appendChild(listElement);
  }
}

class BoardFunctionButtons {
  boardActionButtons = Array.from(document.querySelectorAll(".actionButton"));

  addAction() {
    const clear = new ClearBoard();
    console.log("zrobiono array");
    this.boardActionButtons.forEach((singleButton) => {
      singleButton.addEventListener("click", () => {
        console.log(singleButton.classList[1]);
        const events = {
          backToMenu: this.backToMenu,
          newGame: this.newGame,
          checkingWord: this.checkingWord,
          endGame: this.endGame,
        };

        events[singleButton.classList[1]](clear) ?? "to nie żaden button";
      });
    });
  }

  backToMenu(clear) {
    console.log(`button back to menu `);
    document.location.reload();
  }

  newGame(clear) {
    console.log(`button new game`);
    clear.clearButtons();
    clear.clearList();
  }

  checkingWord(clear) {
    console.log(`button check `);

    let buttonLogic = new GameLogic();
    buttonLogic.checkWord();
    // clear.clearButtons();
  }

  endGame(clear) {
    console.log(`button end game`);
  }
}

class ClearBoard {
  clearList() {
    document.querySelector(".wordsListElements").innerHTML = "";
  }

  clearButtons() {
    const buttons = Array.from(document.querySelectorAll(".row"));
    buttons.forEach((row) => {
      row.parentNode.removeChild(row);
    });
    console.log(buttons);
    new CreateBoardButtons(".lettersContainer");
  }

  clearPoints() {}

  clearWordsArray() {}
}

class App {}

const app = new StartPage("#app");
app.render();

// const but = new CreateBoardButtons('.lettersContainer');
// but.renderButtons();

// const buttonRank = document.querySelector('.bRank');
// console.log(buttonRank);
// buttonRank.addEventListener('click', ()=>{
//     const rank = document.querySelector('.rank');
//     console.log(rank);
//     rank.classList.add('show');
//     rank.addEventListener('click',()=>{
//         rank.classList.remove('show');
//     })
// })
// const buttonHowTo = document.querySelector('.bHowTo');
// buttonHowTo.addEventListener('click', ()=>{
//     const howTo = document.querySelector('.howTo');
//     console.log(howTo);
//     howTo.classList.add('show');
//     howTo.addEventListener('click',()=>{
//         howTo.classList.remove('show');
//     })
// })
