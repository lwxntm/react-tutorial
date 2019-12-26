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
  


### 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。 
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
   
   
### 添加一个可以升序或降序显示历史记录的按钮。  
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

  
每当有人获胜时，高亮显示连成一线的 3 颗棋子。  
当无人获胜时，显示一个平局的消息  