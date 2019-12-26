import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className='square'
            onClick={props.onClick}
        >
            {props.value}
        </button>);


}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    renderInner(length) {
        let oneRow = [];
        for (let i = 0; i < length; i++) {
            let oneSquare = [];
            for (let j = 0; j < length; j++) {
                oneSquare.push(this.renderSquare(3 * i + j));
            }
            oneRow.push(<div>{oneSquare}</div>);
        }
        return oneRow;
    }


    render() {
        return (
                <div className="board-row">
                    {this.renderInner(3)}
                </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null),}],
            moveHistory: [],
            xIsNext: true,
            stepNumber: 0,

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
            history: history.concat([{squares: squares}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });

        this.state.moveHistory.push(this.transXY(i));
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });


    }

    transXY(i) {
        let Y = i % 3 + 1;
        let X = (i - i % 3) / 3 + 1;

        return ` (${X}, ${Y})`;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);


        const moves = history.map((step, move) => {


            const desc = move ?
                'go to move #' + move + this.state.moveHistory[move - 1] :
                'go to game start';
            // const noUsedButtonTest = <button onClick={() => {
            //     alert('hello')
            // }}>Hello</button>;

            return (
                <li key={move * 2}>
                    <button style={{fontWeight: this.state.stepNumber === move ? "bold" : "normal"}} onClick={() => {
                        this.jumpTo(move)
                    }}>{desc}</button>
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
                    <Board squares={current.squares} status={status} onClick={(i) => {
                        this.handleClick(i)
                    }}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

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