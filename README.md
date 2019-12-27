This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Just a homework of [https://zh-hans.reactjs.org/tutorial/tutorial.html](https://zh-hans.reactjs.org/tutorial/tutorial.html)  
尽量在不看答案的前提下实现，所以代码可能比较drity。
### 1: 在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。  
解法：
* 在`Game`的构造函数中添加`moveHistory`状态，是一个空数组。
* 添加一个函数：`transXY(i)`，代码如下：  
```
transXY(i) {
          let Y = i % 3 + 1;
          let X = (i - i % 3) / 3 + 1;
  
          return ` (${X}, ${Y})`;
      }
```
* 在 `handleClick(i)`最后添加一句：
 ` this.state.moveHistory.push(this.transXY(i));`  
* 修改`desc`为如下：  
   ```   
   const desc = move ?
    'go to move #' + move + this.state.moveHistory[move-1] :
    'go to game start';
  ```
    
### 2:在历史记录列表中加粗显示当前选择的项目。
参考此文章：https://www.w3ctech.com/topic/1881 学习了如何为jsx设置样式之后，修改`Game.render()`中的一句代码搞定：
``` 
 return (
                <li key={move}>
                    <button 
                    style={{fontWeight: this.state.stepNumber===move? "bold":"normal"}} 
                    onClick={() => this.jumpTo(move)}
                    >
                    {desc}</button>
                </li>
            );
 ```
  


### 3: 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。 
 解法：这一题比较考验对jsx的熟悉程度，他需要我们用js代码渲染出具有重复性的内容，而不是直接把内容写出来，那么参考现有代码中非常明显的一个重复性内容就是`moves`了，`moves`是一个由map生成的数组，数组中的每一个元素都是一段JSX元素，所以我们也可以用代码生成一个数组然后放到div里作为棋盘。添加一个渲染函数并修改棋盘渲染相关代码：
 
    renderInner(length) {
            let inner = [];
            for (let i = 0; i < length; i++) {
                let oneRow = [];
                for (let j = 0; j < length; j++) {
                    oneRow.push(this.renderSquare(3 * i + j));
                }
                inner.push(<div>{oneRow}</div>);
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
   
   
### 4: 添加一个可以升序或降序显示历史记录的按钮。  
原本觉得很简单，历史记录应该是一个数组，直接`reverse()`就行了，然后。。。发现并不行，不知道是什么原因，猜测是无法直接修改的缘故？如果你有答案请告诉我，谢谢。然后只能想出一个很low的办法是用循环把原本的历史记录反转并存入新的数组，然后添加相关状态，添加一个按钮，根据状态判断是渲染原本的历史记录还是反转后新的历史记录。

     constructor(props) {
          super(props);
          this.state = {
            ///无变化
              isOrder:true,
          };
      }
      
      render(){
      //无变化
      //添加一个返回反转数组的函数.
         function revMoves(){
                    let revMoves=[];
                    for (let i = 0; i <moves.length; i++) {
                        revMoves[i]=moves[moves.length-1-i];
                    }
                    return revMoves;
                }
              }
        return (
                  //无变化
                  //添加按钮，历史记录显示添加判断
                       <div className="game-info">
                           <div>{status}</div>
                           <ol>{this.state.isOrder? moves:revMoves()}</ol>
                       </div>
                       <div><button onClick={()=>{this.setState({isOrder:!this.state.isOrder})}}>修改显示顺序</button></div>
                   </div>
               );

  
### 5: 每当有人获胜时，高亮显示连成一线的 3 颗棋子。  
思路：首先思考在什么地方实现这个功能，一开始想的是在外部的`calculateWinner`函数里实现，但是发现难度做实有点复杂，自己都看不懂自己写出来都什么东西。。由于代码中status存在winner的判断逻辑，所以我直接在后面加上了此功能的实现，另外，除了如何渲染出高亮效果的逻辑，首先要知道到底是哪三个棋子连成一条线了，所以还要改造一下判断`calculateWinner`函数：
    
    function calculateWinner(squares) {
    //写死的逻辑不变，修改为返回一个对象，result代表之前的返回值，添加一个lineMember是连成线的三个位置号。
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {result:squares[a],lineMember:lines[i]}
            ;
        }
    }
    return {result:null,lineMember:null};
    }
然后是修改`Game.render()`:  

        //其他不变，当存在胜利玩家时把胜利玩家的位置记录下来
        let lineMember=[];
            if (winner) {
                lineMember=calculateWinner(current.squares).lineMember;
                status = 'Winner: ' + winner;
            }
        //...........
        //然后在board类里添加一个props是刚才记录下来的位置。
        return (
                    <div className="game">
                        <div className="game-board">
                            <Board
                                successLineMember={lineMember}
                                squares={current.squares} status={status} onClick={(i) => {
                                this.handleClick(i)
                            }}/>
                        </div>
                        //其他不变
                );
然后修改`Board.renderSquare(i)`，这里是精细化square组件的最小部分：  

    renderSquare(i) {
            let isLineMember=false;
            for (let j = 0; j <this.props.successLineMember.length; j++) {
                if (i===this.props.successLineMember[j]){
                    isLineMember=true;
                }
            }
            return <Square
                isLineMember={isLineMember}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />;
        }

最后是`square`组件，添加你自己喜欢的高亮方法吧，我自己是直接把背景色改成红色：  

    function Square(props) {
        let color=props.isLineMember?'red':'white';
        return (
            <button
                className='square'
                onClick={props.onClick}
                style={{backgroundColor:color}}
            >
                {props.value}
            </button>);
    
    
    }
  
### 6: 当无人获胜时，显示一个平局的消息  
解法：这一题是比较简单的，直接修改消息相关逻辑。  这里用了个写死的10，实际上就是棋盘的下满之后的总数+1，这样做有种取巧的味道。

    if (winner) {
                lineMember = calculateWinner(current.squares).lineMember;
                status = 'Winner: ' + winner;
            } else { 
               let noWinner=(this.state.history.length === 10 && !winner);
                if (noWinner){
                    status='It is a draw';
                }else
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
然后发现了一个bug：当下满9子的时候提示平局了，但是使用时间穿越后应该是可以继续下的，结果提示没有发生变化，这显然是不合理的。  
然后发现我好像把原本简单的事情搞复杂了，如果下了9步并且没有winner就肯定是平局了： 
    
       if (winner) {
                   lineMember = calculateWinner(current.squares).lineMember;
                   status = 'Winner: ' + winner;
               } else {
                   if (this.state.stepNumber===9)
                       status='It is a draw';
                   else
                   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
               }