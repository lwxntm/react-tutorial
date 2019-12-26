import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let color = props.isLineMember ? 'red' : 'white';
    return (
        <button
            className='square'
            onClick={props.onClick}
            style={{backgroundColor: color}}
        >
            {props.value}
        </button>);


}

class Board extends React.Component {

    renderSquare(i) {
        let isLineMember = false;
        for (let j = 0; j < this.props.successLineMember.length; j++) {
            if (i === this.props.successLineMember[j]) {
                isLineMember = true;
            }
        }
        return <Square
            isLineMember={isLineMember}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    renderInner(length) {
        let inner = [];
        for (let i = 0; i < length; i++) {
            let oneRow = [];
            for (let j = 0; j < length; j++) {
                oneRow.push(this.renderSquare(3 * i + j));
            }
            inner.push(<div key={i}>{oneRow}</div>);
        }
        return inner;
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
            isOrder: true,

        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares).result || squares[i]) {
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
        function revMoves() {
            let revMoves = [];
            for (let i = 0; i < moves.length; i++) {
                revMoves[i] = moves[moves.length - 1 - i];
            }
            return revMoves;
        }

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).result;
        const moves = history.map((step, move) => {
            const desc = move ?
                'go to move #' + move + this.state.moveHistory[move - 1] :
                'go to game start';
            return (
                <li key={move}>
                    <button style={{fontWeight: this.state.stepNumber === move ? "bold" : "normal"}} onClick={() => {
                        this.jumpTo(move)
                    }}>{desc}</button>
                </li>
            );
        });

        let status;
        let lineMember = [];
        if (winner) {
            lineMember = calculateWinner(current.squares).lineMember;
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        successLineMember={lineMember}
                        squares={current.squares} status={status} onClick={(i) => {
                        this.handleClick(i)
                    }}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{this.state.isOrder ? moves : revMoves()}</ol>
                </div>
                <div>
                    <button onClick={() => {
                        this.setState({isOrder: !this.state.isOrder})
                    }}>修改显示顺序
                    </button>
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
            return {result: squares[a], lineMember: lines[i]}
                ;
        }
    }
    return {result: null, lineMember: null};
}