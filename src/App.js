import { useEffect, useState } from "react";
import BlueCandy from './images/blue-candy.png';
import GreenCandy from './images/green-candy.png';
import OrangeCandy from './images/orange-candy.png';
import PurpleCandy from './images/purple-candy.png';
import RedCandy from './images/red-candy.png';
import YellowCandy from './images/yellow-candy.png';
import blank from './images/blank.png';
import ScoreBoard from "./components/ScoreBoard";

const width = 8;
const candyColors = [
  BlueCandy, 
  GreenCandy, 
  OrangeCandy, 
  PurpleCandy, 
  RedCandy, 
  YellowCandy
];


function App() {
  // State for the current arrangement of candy colors
  const [scoreDisplay,setscoreDisplay]= useState(0);
  const [currentColorArrangement, setcurrentColorArrangement] = useState([]);
  const  [squareBeingDragged,setSquareBeingDragged] =useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced]=useState(null);



  // Function to check for a column of three

  function isvalid(start, end) {
    const startX = start % width;
    const startY = Math.floor(start / width);
    const endX = end % width;
    const endY = Math.floor(end / width);
  
    const deltaX = Math.abs(startX - endX);
    const deltaY = Math.abs(startY - endY);
  
    // Ensure that the move is one step away in both the x and y axes
    if ((deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1)) {
      return true;
    }
    return false;
  }
  
  
  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i]===blank;
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setscoreDisplay((score)=>score+3);
        columnOfThree.forEach(square => currentColorArrangement[square] = blank);
        return true;
      }
    }
    return false;
  }

  // Function to check for a column of four
  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfThree = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i]===blank;
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setscoreDisplay((score)=>score+4);
        columnOfThree.forEach(square => currentColorArrangement[square] = blank);
        return true;
      }
    }
    return false;
  }

  // Function to check for a row of three
  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i]===blank;
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      if (notValid.includes(i)) continue;
      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setscoreDisplay((score)=>score+3);
        rowOfThree.forEach(square => currentColorArrangement[square] = blank);
        return true;
      }
    }
    return false;
  }

  // Function to check for a row of four
  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i]===blank;
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
      if (notValid.includes(i)) continue;
      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setscoreDisplay((score)=>score+4);
        rowOfThree.forEach(square => currentColorArrangement[square] = blank);
        return true;
      }
    }
    return false;
  }

  //Move the squares down
  const moveIntoSquareBelow =() =>{
    for(let i=0;i<64-width;i++){
      const firstRow=i<width;
      if(firstRow && currentColorArrangement[i]===blank){
        let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
        currentColorArrangement[i]=randomColor;
      }
      if(currentColorArrangement[i+width]===blank){
        currentColorArrangement[i+width]=currentColorArrangement[i];
        currentColorArrangement[i]=blank;
      }
    }
  }

// In your dragStart function
const dragStart = (e) => {
  setSquareBeingDragged(e.target);
};

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  }

  const dragEnd = () => {
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));

    const valid=isvalid(squareBeingDraggedId,squareBeingReplacedId);

    console.log("dragged color before swap",currentColorArrangement[squareBeingDraggedId]);
    console.log("replaced color before swap",currentColorArrangement[squareBeingReplacedId]);
    currentColorArrangement[squareBeingDraggedId]=squareBeingReplaced.getAttribute('src');
    currentColorArrangement[squareBeingReplacedId]=squareBeingDragged.getAttribute('src'); 

    const isARowOfFour=checkForRowOfFour();
    const isAColumnOfFour=checkForColumnOfFour();
    const isARowOfThree=checkForRowOfThree();
    const isAColumnOfThree=checkForColumnOfThree();
    console.log("square id being dragged", squareBeingDraggedId);
    console.log("square id being replaced", squareBeingReplacedId);
    console.log("is a row of four",isARowOfFour);
    console.log("is a column of four",isAColumnOfFour);
    console.log("is a row of three",isARowOfThree);
    console.log("is a column of three",isAColumnOfThree);

    console.log("is a valid move",valid);
    
    if(valid && squareBeingReplaced &&(isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)){
      console.log("inside");
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    }
    else{
      
      currentColorArrangement[squareBeingDraggedId]=squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingReplacedId]=squareBeingDragged.getAttribute('src');
      console.log("here");
      setcurrentColorArrangement([...currentColorArrangement])
    }
    

  }




  // Function to create the initial board of random candy colors
  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setcurrentColorArrangement(randomColorArrangement);
  }

  // Effect to create the initial board and log the current arrangement
  useEffect(() => {
    createBoard();
  }, []);

  // Effect to run checks periodically and update the current arrangement
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setcurrentColorArrangement([...currentColorArrangement]);
    }, 100);

    // Cleanup function to clear the timer when the component unmounts or when dependencies change
    return () => clearInterval(timer);
  }, [currentColorArrangement]);

  return (
    <div className="app">
      <ScoreBoard score={scoreDisplay}/>
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img 
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e)=>e.preventDefault()}
            onDragEnter={(e)=>e.preventDefault()}
            onDragLeave={(e)=>e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      
    </div>
  );
}

export default App;
