import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Row from './Row';

class App extends Component {
  constructor(props) {
    super(props);
    // preparation of gamescreen
    let x = 15;
    let y = 15; 
    let game=[];
    let toRender=[];
    for(var iy = 0; iy<y;iy++){
      let row = [];
      for(var ix = 0; ix <x ;ix++){
        row.push(false);
      }
      game.push([...row]);
      toRender.push([...row]);
    }

    this.state = {
      game: game,
      toRender:toRender,
      x:x,
      y:y,
      block:{}
    };
  } 

  componentDidMount() {
    // generate random game element (e.g. z, pipe, square, etc.)
    let block = this.getRandomBlock()
    // plot the block to game canvas
    this.addBlockToGame(block);
    // update state 
    this.setState({
      block:block
    })
    this.timer = setInterval(function(){this.moveItDown(this.state.block)}.bind(this), 500);
    // prepare event listeners for arrow keys
    var mLeft = function(){this.moveItLeft(this.state.block)}.bind(this)
    var mRight = function(){this.moveItRight(this.state.block)}.bind(this)
    var mDown = function(){this.moveItDown(this.state.block)}.bind(this);
    var rotate = function(){this.rotate(this.state.block)}.bind(this) // up arrow key
    window.onkeyup = function(e) {
      var key = e.keyCode ? e.keyCode : e.which;
      switch(key){
        case 37:
        mLeft();
        break;
        case 38:
        rotate()
        break;
        case 39:
        mRight();
        break;
        case 40:
        mDown()
        break;
      }

   }

  }
  addBlockToGame(block){
    //test if is possible to draw it in canvas. if so than draw it, otherwise show game over
    if(this.isPosibleToPlay(block.x,block.y,block.data)){
      this.play(block.x,block.y,block)
    }
    else{
      this.gameOver();
    }
  }

  // function to test if indeded move is possible to play
  isPosibleToPlay(x,y,block){
    let isPosible = true;
    block.map((el, idy)=>{
      el.map((elCell, idx)=>{
        if(this.state.game[y+idy] === undefined ||this.state.game[y+idy][x+idx] === undefined || elCell===true && elCell ===this.state.game[y+idy][x+idx]){
          //alert(this.state.game)
          isPosible = false;
        }
      })
    })
    return isPosible;
  }

  play(x,y,block){
    // dont know how to clone it - this works
    let playIt =JSON.parse(JSON.stringify(this.state.game));
    block.data.map((el, idy)=>{
      el.map((elCell, idx)=>{
        if(elCell===true){
        playIt[y+idy][x+idx] = elCell;
        }
      })
    })
    this.setState({toRender:playIt});
  }
  
  moveItDown(block){
    if(this.isPosibleToPlay(block.x,block.y+1,block.data)){
      block.y++;
      this.play(block.x,block.y,block);
    }
    else{
      let finalState = this.state.toRender;
      let rowsDestroyed = 0;
      finalState.reverse().map((el,idy)=>{
        let readyToRemove = true;
        el.map((elCell,idx)=>{
          readyToRemove = (readyToRemove && elCell)? true:false;
        })



        //move down if rows was destroyed
        if(rowsDestroyed>0){
          el.map((elem,idxCell)=>{
            //finalState[idy][idxCell]=false;
            finalState[idy-rowsDestroyed][idxCell]=elem;
          })
        }
        if(readyToRemove){
          el.map((e,idxCell)=>{
            finalState[idy][idxCell]=false;
          })
          rowsDestroyed++;
        }
        

      })
      finalState.reverse();
      let block = this.getRandomBlock();

      this.setState({
        game:finalState,
        block: block
      })


      this.addBlockToGame(block)
      
    }
  }

  moveItLeft(block){
    if(this.isPosibleToPlay(block.x-1,block.y,block.data)){
      block.x--;
      this.play(block.x,block.y,block);
    }
  }

  moveItRight(block){
    if(this.isPosibleToPlay(block.x+1,block.y,block.data)){
      block.x++;
      this.play(block.x,block.y,block);
    }
  }
  rotate(block){
    let output = [];

    block.data.map((el,idy)=>{
      el.map((elCell,idx)=>{
        if(output[idx]===undefined)
        output[idx]=[]
        output[idx][idy]=elCell;
      })
    })
    block.invertNextTime=true
    if(block.invertNextTime){
      output.map((el,idy)=>{
        el.reverse();
      })
    }
    block.invertNextTime = block.invertNextTime&&!block.alwaysInvert?false:true

    if(this.isPosibleToPlay(block.x,block.y,output)){
      block.data=output
      this.setState({block:block})
      this.play(block.x,block.y,block)
    }
  }

  gameOver(){
    clearInterval(this.timer);
    alert("GameOver!!!!");
  }
  getRandomBlock(){
    switch (Math.floor((Math.random() * 6) + 1)){
      case 1:
      return this.getMidleFinger();
      break;
      case 2:
      return this.getBrick();
      break;
      case 3:
      return this.getPipe();
      break;
      case 4:
      return this.getZ();
      break;
      case 5:
      return this.getInvertedZ();
      break;
      case 6:
      return this.getL();
      break;
    }
    
    
  }
  getMidleFinger(){
    return this.createObject([
      [false,true,false],
      [true,true,true]
    ]);
  }
  getBrick(){
    return this.createObject([
      [true,true],
      [true,true]
    ]);
  }
  getPipe(){
    return this.createObject([
      [true,true,true,true]
    ]);
  }
  
    getZ(){
      return this.createObject([
        [true,true,false],
        [false,true,true]
      ]);
    }
    
      getInvertedZ(){
        return this.createObject([
          [false,true,true],
          [true,true,false]
        ]);
      }
      getL(){
        return this.createObject([
          [true,false],
          [true,false],
          [true,true]
        ]);
      }
  createObject(matrix, alwaysInvert=false){
    let xPos = Math.floor(this.state.x/2)-1;
    return {
      x:xPos,
      y:0,
      invertNextTime:true,
      alwaysInvert:alwaysInvert,
      data:matrix
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Tetris</h1>
        </header>
        <p className="App-intro">
          <div className="gameContainer">
          {this.state.toRender.map((el, idx) => 
          <Row row={this.state.toRender[idx]}/>
          )}
          
          </div>
        </p>
      </div>
    );
  }
}

export default App;
