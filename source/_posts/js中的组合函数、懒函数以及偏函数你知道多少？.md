---
title: 这些高阶的函数技术，你掌握了吗？
date: 2020-11-13 15:35:20
tags: javascript
---

> 在JavaScript 中，函数视为一等公民，所谓的“一等公民”，指的是函数和其他数据类型的一样，处于平等地位，可以赋值给其他变量，也可作为参数，传入另一个函数，或者作为其他函数的返回值。
### 1. 高级函数至少满足以下条件之一
+ 接受函数作为参数
+ 将函数作为输出返回
常用的高阶函数
```javascript
// Array.prototype.map 高阶函数
const arr = [1, 2, 3, 4];
const map = arr.map(x => x * 10)
// debounce函数(防止某一函数被连续调用)
const debounce = function(fn, wait) {
  var td;
  return function () {
    clearTimeout(td);
    td = setTimeout(fn, wait)
  }
}
const fun = debounce(() => {
  // 繁重、耗性能的操作
}, 250)
window.addEventListener('resize',myFunc);
// 
// 柯里化函数
const curry = function(fn, args =[]) {
  let rest = [...arguments, ...args]
  return function() {
   if (rest.length < fn.length) {
     return fn.apply(this, rest)
   } else {
     return curry.call(this, fn, rest)
   }
  }
}
```
### 2. 组合函数
>函数组合就是将一个或者一个以上的函数组合生成一个新函数的过程

```javascript
const composeFn = function (f, g) {
  return function (x) {
    return f(g(x))
  }
}
// 此处举个例子
function lowerCase(input) {
  return input && typeof input === 'string' ? input.lowerCase() : input;
}
function upperCase(input) {
  return input && typeof input === 'string' ? input.upperCase() : input;
}
function trim(input) {
  return input && typeof input === 'string' ? input.trim() : input;
}
function split(input, delimiter = ',') {
  return input && typeof input === 'string' ? input.split(delimiter) : input;
}
const compose = function(...funcs) {
  return function(input){
    return funcs.reduce((arg, fn) => (fn(arg)), input)
  }
}
const superCom =  compose(trim, upperCase, split )
superCom('a,B,C ') // ['A', 'B', 'C']
```
### 3. 偏函数
> 用于固定一个函数的一个或者多个参数，并且返回一个处理剩余参数的函数的函数

```javascript
function patial(fn) {
  let args = Array.prototype.slice(arguments, 1);
  return function () {
    const newArgs = [...args, ...arguments]
    return fn.apply(this, newArgs)
  }
}
function buildUrl(scheme, domain, path) {
  return `${scheme}://${domain}/${path}`
}
const myblogPath = patial(buildUrl, 'http', 'duoyu.pro')
const articalpath = myblogPath('articl/99');
```
### 惰性载入函数
>
