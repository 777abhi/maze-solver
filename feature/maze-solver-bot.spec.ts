//maze-solver-bot.spec.ts
const { test, expect } = require("@playwright/test");

let upW = "text=arrow_upward";
let downW = "text=arrow_downward";
let leftW = "text=arrow_back";
let rightW = "text=arrow_forward";

let mazePointer;
let mazePointerX, mazePointerY;

let backTrack = [];
let twoWaytrackerPosition = [];
let allMoves = [];
let moveBackBy = 1;

let greenPresent = true;


test("Automation Bot should complete the treseure hunt", async ({ page }) => {
  await page.goto("/c/crystal_maze");


  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  while (greenPresent) {
    mazePointer = await getLocationDetails(
      page,
      "//td[contains(@class, 'deep-purple')]"
    );

  
    if (mazePointer.length < 18) {
      //example - x0 y2 deep-purple
      mazePointerX = mazePointer.substring(1, 2);
      mazePointerY = mazePointer.substring(4, 5);
    } else if (mazePointer.length == 18) {
      if (Array.from(mazePointer.substring(1, 3))[1] == " ") {
        //example - x0 y20 deep-purple
        mazePointerX = mazePointer.substring(1, 2);
        mazePointerY = mazePointer.substring(4, 6);
      } else {
        //example - x10 y8 deep-purple
        mazePointerX = mazePointer.substring(1, 3);
        mazePointerY = mazePointer.substring(5, 6);
      }
    } else if (mazePointer.length > 18 && mazePointer.length < 100) {
      //example - x10 y20 deep-purple
      mazePointerX = mazePointer.substring(1, 3);
      mazePointerY = mazePointer.substring(5, 7);
    }

    let lookDown = await observeAround(page, mazePointerX, mazePointerY, 0, 1);
    let lookRight = await observeAround(page, mazePointerX, mazePointerY, 1, 0);
    let lookLeft = await observeAround(page, mazePointerX, mazePointerY, -1, 0);
    let lookUp = await observeAround(page, mazePointerX, mazePointerY, 0, -1);

    backTrack.forEach((element) => {
      //check if the current position is in the backtrack array
      if (element == lookUp) lookUp = "0";
      else if (element == lookDown) lookDown = "0";
      else if (element == lookLeft) lookLeft = "0";
      else if (element == lookRight) lookRight = "0";
    });

    if (lookUp.includes("grey") || lookUp.includes("green")) {
      await page.click(upW);
      allMoves.push("up");
      backTrack.push(lookUp);
      moveBackBy = 1;
    } else if (lookRight.includes("grey") || lookRight.includes("green")) {
      await page.click(rightW);
      allMoves.push("right");
      backTrack.push(lookRight);
      moveBackBy = 1;
    } else if (lookLeft.includes("grey") || lookLeft.includes("green")) {
      await page.click(leftW);
      allMoves.push("left");
      backTrack.push(lookLeft);
      moveBackBy = 1;
    } else if (lookDown.includes("grey") || lookDown.includes("green")) {
      await page.click(downW);
      allMoves.push("down");
      backTrack.push(lookDown);
      moveBackBy = 1;
    } else {
      if (allMoves[allMoves.length - moveBackBy] == "right") {
        await page.click(leftW);
        moveBackBy = moveBackBy + 1;
      } else if (allMoves[allMoves.length - moveBackBy] == "left") {
        await page.click(rightW);
        moveBackBy = moveBackBy + 1;
      } else if (allMoves[allMoves.length - moveBackBy] == "up") {
        await page.click(downW);
        moveBackBy = moveBackBy + 1;
      } else if (allMoves[allMoves.length - moveBackBy] == "down") {
        await page.click(upW);
        moveBackBy = moveBackBy + 1;
      }
    }

    let counter = 0;
    let twoWaytracker = [lookUp, lookDown, lookLeft, lookRight];
    twoWaytracker.forEach((element) => {
      if (element.includes("grey")) {
        counter = counter + 1;
        if (counter == 2) {
          twoWaytrackerPosition.push(element);
        }
      }
      if (element.includes("green")) {
        greenPresent = false;
      }
    });
  }
  await page.click('button:has-text("Submit")');
});

//All functions
async function getLocationDetails(page, locator) {
  return await page.getAttribute(locator, "class");
}

async function getLocator(xValue: unknown, yValue: number) {
  let locator =
    "//td[contains(@class, " + "'x" + xValue + " " + "y" + yValue + "'" + ")]";

  return locator;
}

async function observeAround(
  page,
  valueForlocatorCurrentPositionX,
  valueForlocatorCurrentPositionY,
  arg0: number,
  arg1: number
) {
  let xValue, yValue;
  if (arg0 < 0 && valueForlocatorCurrentPositionX == 0) {
    xValue = valueForlocatorCurrentPositionX;
  } else {
    xValue = +valueForlocatorCurrentPositionX + arg0;
  }
  if (arg1 < 0 && valueForlocatorCurrentPositionY == 0) {
    yValue = valueForlocatorCurrentPositionY;
  } else {
    yValue = +valueForlocatorCurrentPositionY + arg1;
  }

  let locator = await getLocator(xValue, yValue);
  let value = await getLocationDetails(page, locator);
  return value;
}
