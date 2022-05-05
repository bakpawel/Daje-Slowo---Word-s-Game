//Helping Classes
/////////////////////////////////////////////////////////////////////////////////////////

//1) Contstructing HTML elements

class AppElement {
  constructor(className, text, hook) {
    this.className = className;
    this.innerHTML = text;
    this.hookName = hook;
  }
}

//2) Creating page element and appending to DOM element

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

//3) Masking page

class PageMask {
  constructor(turnedOff) {
    this.turnedOff = turnedOff;
    this.mask = document.querySelector(".page-mask");
    this.maskSwitch(turnedOff);
  }

  maskSwitch(turnOnOff) {
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
      th.innerHTML = val;
      row.appendChild(th);
    }
  }

  renderTable() {
    for (let element of this.bodyData) {
      let row = this.table.insertRow();

      for (let key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
    this.renderTableHead();
  }

  addColSpan(element, colSpan) {
    element.colSpan = colSpan;
  }
}

//End of Helpig Classes
/////////////////////////////////////////////////////////////////////////////////////////

class RankingStorage {
  constructor(earnedPoints) {
    this.rank = this.getRank();
    this.playerPoints = earnedPoints;
    this.playerName;
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
      return this.playerPoints > element.points ? true : false;
    });

    isPlacedInRank ? this.getNamePrompt() : this.getNamePrompt(true);
  }

  getNamePrompt(disabled) {
    let prompt = document.querySelector(".prompt");
    let submitName = document.querySelector(".submitName");
    let description = document.getElementById("PromptDescription");
    let inputName = document.getElementById("name");

    if (disabled) {
      description.innerHTML = "Spróbuj ponownie!";
      inputName.value = "Nie tym razem :(";
      inputName.disabled = true;
      submitName.innerHTML = "Zamknij";
    } else {
      description.innerHTML = "Jesteś Zwycięzcą!";
      inputName.value = "";
      submitName.disabled = true;
      submitName.innerHTML = "Zapisz";
      inputName.addEventListener("keyup", correctName);
    }
    prompt.style.zIndex = 3;
    prompt.style.display = "flex";
    function correctName() {
      if (inputName.value === "") {
        submitName.disabled = true;
      } else {
        submitName.disabled = false;
      }
    }
    setTimeout(() => {
      prompt.classList.add("pop");
      new PageMask(true);
    }, 100);

    //referencja do powstałej funkcji, gdyż za każdym razem bind tworzy nowy obiekt i referencje do niego - gdyby bind() było w addEventListener nie można byłoby usunąć listenera (za kazdym razem powstawała by nowa referencja) -> listenery by się mnożyły za każdym kolejnym kliknięciem
    let reference = promptCallback.bind(this);
    let enterHitReference = enterHit.bind(this);

    submitName.addEventListener("click", reference);
    inputName.addEventListener("keyup", enterHitReference);

    function promptCallback(e) {
      e.stopPropagation();
      let promptValue = inputName.value;
      this.playerName = promptValue;
      setTimeout(() => {
        prompt.style.display = "none";
        prompt.classList.remove("pop");
        promptValue = "";
        inputName.disabled = false;
      }, 100);
      new PageMask(false);
      if (!disabled) {
        this.saveScore();
      }
      submitName.removeEventListener("click", reference);
      inputName.removeEventListener("keyup", enterHitReference);
    }

    function enterHit(e) {
      e.stopPropagation();
      if (e.key === "Enter") {
        submitName.click();
      }
    }
  }

  saveScore() {
    const newRecord = {
      points: this.playerPoints,
      name: this.playerName,
    };

    this.rank.push(newRecord);
    this.rank.sort((a, b) =>
      a.points < b.points ? 1 : b.points < a.points ? -1 : 0
    );
    this.rank.pop();

    localStorage.setItem("rank", JSON.stringify(this.rank));
    this.updatedRank();

    const displayedHighestScore = document.querySelector(".score");
    displayedHighestScore.innerHTML = `<i class="fas fa-trophy"></i>${this.rank[0].points}`;
  }

  updatedRank() {
    document.querySelector("table").innerHTML = "";
    new StartPage().rankingStorage();
  }
}

class InfoPages extends RenderComponent {
  infoPages = [];

  constructor(hookId) {
    super(hookId);
    this.createPages();
  }

  createPages() {
    this.infoPages = [
      new AppElement(
        "howTo",
        `<h1>Jak grać ?</h1>
            <section>
                <ol>
                    <li>Utwórz jak najwięcej słów z wylosowanych liter!</li>
                    <li>Aby sprawdzić poprawność kliknij "Sprawdź". </li>
                    <li>W każdym momencie możesz zakończyć grę z uzyskaną liczbą punktów.</li>
                </ol>
                <p>PRZYJEMNEJ ZABAWY!</p>
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

//STARTING PAGE

class StartPage extends RenderComponent {
  constructor(hookId) {
    super(hookId);
  }

  infoPages() {
    new InfoPages("#app");
  }

  buttons() {
    new StartPageButtons(".buttonsRest");
  }

  rankingStorage() {
    let renderRank = new RankingStorage();
    let rank = renderRank.getRank();

    let renderTable = new RenderTableElements(
      document.querySelector("table"),
      [`<i class="fas fa-crown"></i><br> <h1>RANKING</h1>`],
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
    this.createInfoButtons();
  }

  createInfoButtons() {
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

        let reference = hookCallback.bind(this);
        hook.addEventListener("click", reference);

        function hookCallback(e) {
          e.stopPropagation();
          hook.classList.remove("show");
          new PageMask(false);
          setTimeout(() => {
            hook.style.display = "none";
          }, 400);

          hook.removeEventListener("click", reference);
        }
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
    const rank = document.querySelector(".score");

    rank.innerHTML = JSON.parse(localStorage.getItem("rank"))
      ? `<i class="fas fa-trophy"></i> ${
          JSON.parse(localStorage.getItem("rank"))[0].points
        }`
      : `<i class="fas fa-trophy"></i> 0`;

    rank.addEventListener("click", () => {
      const hook = document.querySelector(".rank");
      hook.style.display = "block";
      new PageMask(true);
      setTimeout(() => {
        hook.classList.add("show");
      }, 1);

      let reference = hookCallback.bind(this);
      hook.addEventListener("click", reference);

      function hookCallback(e) {
        e.stopPropagation();
        hook.classList.remove("show");
        new PageMask(false);
        setTimeout(() => {
          hook.style.display = "none";
        }, 400);

        hook.removeEventListener("click", reference);
      }
    });

    this.createButtons();
    this.showBoard();
    let addBoardLogic = new GameLogic();
    addBoardLogic.getListOfCorrectWords();
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
  countPoints() {
    const pointsElement = document.querySelector("points");
    pointsElement.innerHTML = `<h1> ${this.score} / ${this.rightWords.length}</h1>`;
  }
}

class CreateBoardButtons extends RenderComponent {
  constructor(hookId) {
    super(hookId);
  }

  //drawing letters

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
    return drawedLetter;
  }

  //1. creating row and 3 empty buttons

  renderSingleRow() {
    const row = this.createRootElement("div", "row");

    const buttons = [
      this.createRootElement("button", "letter", false),
      this.createRootElement("button", "letter", false),
      this.createRootElement("button", "letter", false),
    ];
    //2. draw letter and insert into button, then place inside a row

    buttons.forEach((button) => {
      button.innerText = this.drawLetter();
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
  constructor() {
    super();

    //implementing singleton

    if (GameLogic.exists) {
      return GameLogic.instance;
    }
    GameLogic.exists = true;
    GameLogic.instance = this;

    this.guessedWord = "";
    this.rightWords;

    this.maxPossibleScore;
    this.score = 0;
    this.regExPattern = "";
    this.isFetching = false;
    this.addListenersToLetterButtons();

    return this;
  }

  async getListOfCorrectWords() {
    this.regExPattern = new RegExBuildingEngine().finalRegEx;
    this.isFetching = true; //if true background should be covered with mask

    this.loadingInfo();

    let connectionToDatabase = new ConnectToDatabase(
      "https://eu-central-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-pmhwm/service/PlWords/incoming_webhook/plWords?",
      this.regExPattern,
      "GET"
    );

    let words = await connectionToDatabase.fetchData();
    //goes further only when words are fetched

    this.isFetching = false;
    this.loadingInfo();
    this.setValues(words);
  }

  loadingInfo() {
    const loadingSpinner = document.getElementById("loading");
    const pageMaskChange = new PageMask();
    if (this.isFetching) {
      pageMaskChange.maskSwitch(true);
      loadingSpinner.style.display = "flex";
    } else {
      loadingSpinner.style.display = "none";
      pageMaskChange.maskSwitch(false);
    }
  }

  setValues(listOfCorrectWords) {
    this.rightWords = listOfCorrectWords;

    console.log(
      `These are Polish words you can create from these letters ${listOfCorrectWords}`
    );

    this.maxPossibleScore = listOfCorrectWords.length;
    this.countPoints();
  }
  createWord(letter) {
    this.guessedWord = this.guessedWord + letter;
  }

  checkWord() {
    const isCorrectWord = this.rightWords.includes(this.guessedWord);

    isCorrectWord ? this.correctWord() : this.enableButtons();
  }

  correctWord() {
    this.score += 1;
    this.removeWord(this.guessedWord);
    this.renderWordOnList();
    this.enableButtons();
    this.countPoints();
  }

  addListenersToLetterButtons() {
    const buttons = document.getElementsByClassName("letter");

    Array.from(buttons).forEach((button) => {
      button.addEventListener("click", () => {
        button.setAttribute("disabled", "true");
        this.createWord(button.innerText);
      });
    });
  }

  enableButtons() {
    const buttons = document.getElementsByClassName("letter");
    Array.from(buttons).forEach((button) => {
      button.disabled = false;
    });
    this.guessedWord = "";
  }

  removeWord(word) {
    this.rightWords = this.rightWords.filter((element) => element != word);
    // console.log(this.rightWords);
  }

  renderWordOnList() {
    const listElement = this.createRootElement("li", "wordOnList", false);
    this.hookId = document.querySelector(".wordsListElements");
    listElement.innerText = this.guessedWord;
    this.hookId.appendChild(listElement);
  }

  countPoints(list) {
    const pointsElement = document.querySelector(".points");
    if (list) {
      this.maxPossibleScore = list.length;
    }
    pointsElement.innerHTML = `<h1> ${this.score} / ${this.maxPossibleScore}</h1>`;
  }

  updateWordsList(arrayOfWords) {
    this.rightWords = arrayOfWords;
  }
}

class BoardFunctionButtons {
  boardActionButtons = Array.from(document.querySelectorAll(".actionButton"));

  addAction() {
    const clear = new ClearBoard();

    document.addEventListener("keypress", function (e) {
      if (e.key === " ") {
        const checkWordButton = document.querySelector(".checkingWord");
        checkWordButton.click();
        checkWordButton.classList.add("active");
        setTimeout(function () {
          checkWordButton.classList.remove("active");
        }, 100);
      }
    });

    this.boardActionButtons.forEach((singleButton) => {
      //1. each action button will have listener were 'on click' will be assigned to object of events (to multiple events)
      singleButton.addEventListener("click", () => {
        const events = {
          backToMenu: this.backToMenu,
          newGame: this.newGame,
          checkingWord: this.checkingWord,
          endGame: this.endGame,
        };
        //2. each button has specific className corresponding to object's method. Only method corresponding to ClassName will be called.

        events.hasOwnProperty(singleButton.classList[1])
          ? events[singleButton.classList[1]](clear)
          : console.log("for this button we don't have event");
      });
    });
  }

  backToMenu() {
    document.location.reload();
  }

  newGame(clear) {
    let buttonLogic = new GameLogic();

    clear.clearButtons();
    buttonLogic.enableButtons();
    buttonLogic.addListenersToLetterButtons();
    clear.clearList();
    clear.clearPoints();
    buttonLogic.getListOfCorrectWords();
    clear.enableActionButtons();
    document.querySelector(".newGame").blur();
  }

  checkingWord() {
    let buttonLogic = new GameLogic();
    buttonLogic.checkWord();
  }

  endGame() {
    const endButton = document.querySelector(".endGame");
    const checkButton = document.querySelector(".checkingWord");
    endButton.disabled = true;
    checkButton.disabled = true;
    const earnedPoints = new GameLogic().score;

    let wordsLeft = new GameLogic().rightWords;

    //render rest of word on list

    wordsLeft.forEach((word) => {
      const listElement = document.createElement("li");
      listElement.className = "wordOnList";
      this.hookId = document.querySelector(".wordsListElements");
      listElement.innerText = word;
      this.hookId.appendChild(listElement);
    });

    new RankingStorage(earnedPoints).checkPosition();
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
    new CreateBoardButtons(".lettersContainer");
  }

  clearPoints() {
    const gameLogic = new GameLogic();
    gameLogic.score = 0;
    gameLogic.countPoints();
  }

  enableActionButtons() {
    document.querySelector(".endGame").disabled = false;
    document.querySelector(".checkingWord").disabled = false;
  }
}

class ConnectToDatabase {
  constructor(url, pattern, method) {
    this.url = url;
    this.regExPattern = pattern;
    this.method = method;
  }

  async fetchData() {
    let arr = [];
    await fetch(this.url + new URLSearchParams({ regex: this.regExPattern }), {
      method: this.method,
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          arr.push(item.PL);
        });
        console.dir(`Fetched from server ${arr}`);
      });
    return arr;
  }
}

class RegExBuildingEngine {
  constructor() {
    this.drawedLetters = this.lettersOnBoard();
    this.baseRegEx = "^[]{2,9}$";
    this.finalRegEx = "";
    this.buildRegEx();
  }

  lettersOnBoard() {
    let letterButtons = document.getElementsByClassName("letter");
    let lettersOnBoard = [];
    Array.from(letterButtons).forEach((button) => {
      lettersOnBoard.push(button.innerText);
    });
    return lettersOnBoard;
  }

  howManyOfEachLetter(drawedLetters) {
    //creating object where each letter is separate property with assigned quantity value - how many times appears on board expl: {L: 3, P: 2}

    let quantityLetters = {};
    drawedLetters.forEach((value) => {
      quantityLetters[`${value}`] = drawedLetters.filter(
        (v) => v === value
      ).length;
    });
    return quantityLetters;
  }

  buildRegEx() {
    let regTemp = "";
    let regTemp2 = "";

    let lettersBase = this.howManyOfEachLetter(this.drawedLetters);

    //first part of regEx

    for (let letter in lettersBase) {
      // expected result example ---> (?!([^A]*A){3})

      regTemp += `(?!([^${letter}]*${letter}){${lettersBase[letter] + 1}})`;
    }

    //second part of regEx

    for (let letter in lettersBase) {
      regTemp2 += `${letter}`;
    }
    this.baseRegEx =
      this.baseRegEx.slice(0, 2) + regTemp2 + this.baseRegEx.slice(2);

    this.finalRegEx =
      this.baseRegEx.slice(0, 1) + regTemp + this.baseRegEx.slice(1);

    //expected result (?!([^A]*A){3})(?!([^B]*B){2})...[AB...]{2,9}$)
    return this.finalRegEx;
  }
}

class App {}

const app = new StartPage("#app");
app.render();
