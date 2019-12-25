This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Just a homework of [https://zh-hans.reactjs.org/tutorial/tutorial.html](https://zh-hans.reactjs.org/tutorial/tutorial.html)

1:在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。  
解法：
* 在`Game`的构造函数中添加`moveHistory`状态，是一个空数组。
* 添加一个函数：`transXY(i)`，代码如下：  
```
transXY(i) {
          let Y = i % 3 + 1;
          let X = Math.floor((i - i % 3) / 3) + 1;
  
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
    
