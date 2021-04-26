
---
title: 理解async函数.md
date: 2021-04-13 10:29:18
tags: js异步
---
### js异步（终极）解决方案 async/await
ES7 提出的`async` 函数，终于让 JavaScript 对于异步操作有了终极解决方案。`No more callback hell`。
`async` 函数是 `Generator` 函数的语法糖。使用 关键字 async 来表示，在函数内部使用 await 来表示异步。
想较于 Generator，Async 函数的改进在于下面四点：
+ 内置执行器。Generator 函数的执行必须依靠执行器，而 Aysnc 函数自带执行器，调用方式跟普通函数的调用一样
+ 更好的语义。async 和 await 相较于 * 和 yield 更加语义化
+ 更广的适用性。co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise对象。而 async 函数的 await 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作）
+ 返回值是 Promise。async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用

### Async 与其他异步操作的对比
#### 1.callback
先定义一个 Fetch 方法用于获取 github user 的信息：
``` javascript
function foo(callback){//定义函数的时候将另一个函数（回调函数）作为参数传入定义的函数中。
    $ajax({
        //...
        success:callback//异步操作执行完毕后，再执行该回调函数，确保回调在异步操作之后执行。
    });
}
function myCallback(result){
    //...
}
foo(myCallback);
```
回调函数本身是我们约定俗成的一种叫法，我们定义它，但是并不会自己去执行它，它最终被其他人执行了。
优点：比较容易理解；
缺点：1.高耦合，维护困难，回调地狱;2.每个任务只能指定一个回调函数;3.如果几个异步操作之间并没有顺序之分，同样也要等待上一个操作执行结束再进行下一个操作。
![An image](./images/1618303425464.jpg)
#### 2.Promise 方式
```javascript
/**
 * Promise 方式
 */
function fetchUser() { 
    return new Promise((resolve, reject) => {
        fetch('https://api.github.com/users/superman66')
        .then((data) => {
            resolve(data.json());
        }, (error) => {
            reject(error);
        })
    });
}
function getUserByPromise() {
    fetchUser()
        .then((data) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        })
}
getUserByPromise();
```

Promise 的方式虽然解决了 callback hell，但是,
+ 这种方式充满了 Promise的 then() 方法，如果处理流程复杂的话，整段代码将充满 then。
+ 语义化不明显，代码流程不能很好的表示执行流程。
+ 当处于未完成状态时，无法确定目前处于哪一阶段。
+ 如果不设置回调函数，Promise内部的错误不会反映到外部。
+ 无法取消Promise，一旦新建它就会立即执行，无法中途取消。

#### 3. Generator 方式
```javascript
/**
 * Generator 方式
 */
function* fetchUserByGenerator() {
    const user = yield fetchUser();
    return user;
}

const g = fetchUserByGenerator();
const result = g.next().value;
result.then((v) => {
    console.log(v);
}, (error) => {
    console.log(error);
})
```
Generator 的方式解决了 Promise 的一些问题，流程更加直观、语义化。但是 Generator 的问题在于，函数的执行需要依靠执行器，每次都需要通过 g.next() 的方式去执行。

#### 4.async 方式
```javascript
/**
 * async 方式
 */
 async function getUserByAsync(){
     let user = await fetchUser();
     return user;
 }
getUserByAsync()
.then(v => console.log(v));
```
async 函数完美的解决了上面两种方式的问题。流程清晰，直观、语义明显。操作异步流程就如同操作同步流程。同时 async 函数自带执行器，执行的时候无需手动加载。
##### 只要在函数名之前加上async关键字，就表明这个函数内部有异步操作。这个异步操作返回一个Promise对象，前面用await关键字注明。函数执行的时候，一旦遇到await，就会先执行await后面的表达式中的内容（异步），不再执行函数体后面的语句。等到异步操作执行完毕后，再自动返回到函数体内，继续执行函数体后面的语句。
```javascript
async function getABC(){
    let A = await getValueA(); // getValueA 花费 2 秒
    let B = await getValueB(); // getValueA 花费 4 秒
    let C = await getValueC(); // getValueA 花费 3 秒
    return A*B*C
}
```
每次遇到 await 关键字时，Promise 都会停下在，一直到运行结束，所以总共花费是 2+4+3 = 9 秒。await 把异步变成了同步。
Async 的价值在于用写同步的方式写异步，1避免了阻塞，2必免写回调

### [学习语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 