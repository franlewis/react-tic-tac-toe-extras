import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(row) {

        const squaresPerRow = 3;
        const squares = [];
        const offset = row * squaresPerRow; // this makes sure first row is 0,1,2, second row is 3,4,5, etc.
        for (let s = 0; s < squaresPerRow; s++) {
          squares.push(
            this.renderSquare(offset + s)
          );
        }
        return (
          <div className="board-row">
            {squares}
          </div>
        )
      }
    
 
    render() {
        // these can also be passed in as `props` 
        // if you want to use them like `<Board totalRows={3} squaresPerRow={3} squares={...}/>`
        const totalRows = 3;

        const rows = [];
        for (let r = 0; r < totalRows; r++) {
            rows.push(
            this.renderRow(r)
            );
        }
        return <div>{rows}</div>;
    }
          
}
  
class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: null,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {    
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                location: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
        
    }
    
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
      console.log(step);
      
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]; // array index
        const winner = calculateWinner(current.squares);
        const currentStep = this.state.stepNumber;
        
        const moves = history.map((step, move, moves) => {
            
            const desc = move ?
            'Go to move #' + move + ': col ' + (step.location % 3 + 1) + ' , row '  + Math.floor(step.location / 3 + 1) :
            'Go to game start';
            return (
            <li key={move}>
                {move === currentStep ? (
                    <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
                ) : (
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                )}
            </li>
            );
        });
        
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (

            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}
  
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  