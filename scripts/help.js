//retrieves and DOM elements relating to the help popup and adds listener events
//pages: a string array with the content segmented into pages/paragraphs
function GenerateContextHelp(pages) {
  let helpIcon = document.getElementById("helpIcon");
  let helpBox = document.getElementById("help-box");
  let nextButton = document.getElementById("nextBtn");
  let skipButton = document.getElementById("skipBtn");
  let pageNum = document.getElementById("pageNum");
  let helpContent = document.querySelector(".help-content");
  let pageIndex = 0;

  //help icon was pressed
  helpIcon.addEventListener("keydown", (event) => {
    if (event.code == "Enter") {
      showHelp();
    }
  });

  //help icon was pressed
  helpIcon.addEventListener("click", () => {
    showHelp();
  });

  //clicked next button
  nextButton.addEventListener("click", () => {
    pageIndex++;
    if (pageIndex < pages.length) displayExplanation(pageIndex);
    else helpBox.style.display = "none";
  });

  //resets index and hides help box
  skipButton.addEventListener("click", () => {
    pageIndex = 0;
    helpBox.style.display = "none";
  });

  function showHelp() {
    pageIndex = 0;
    helpBox.style.display = "flex";
    displayExplanation(pageIndex);
  }

  //displays text (and renders HTML elements)  from the helpContent array
  function displayExplanation(index) {
    //display content in a <p> tag
    helpContent.innerHTML = `<p>${pages[index]}</p>`;
    //update page number
    pageNum.innerText = `${index + 1}/${pages.length}`;
    //if on last page, change text to say 'close'
    if (index == pages.length - 1) nextButton.textContent = "close";
    else nextButton.textContent = "next";
  }
}

/*
 * HELP HTML TEMPLATE

<div class="help-icon" id="help-icon" accesskey="h" tabindex="15">
    <span class="icon">?</span>
</div>

<div class="help-box" id="help-box">
  <div class="help-content">
      <p>This is where each page shows up.</p>
  </div>
  <div class="help-actions">
      <label id="pageNum" style="margin-right: 10px">1/1</label>
      <button id="skipBtn" tabindex="15">Skip</button>
      <button id="nextBtn" tabindex="15">Next</button>
  </div>
</div>
*/
