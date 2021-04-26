---
title: 彻底搞懂javascript中高级函数之柯里化
date: 2020-11-09 13:42:44
tags: javascript
---

## 请解析下面这道
1. 实现函数_curry(fn)使之具有以下功能：fn是一个三元函数，fn(a, b, c)，
   const _fn = _curry(fn) _fn(a)(b) 的结果和 fn(a, b, c)的结果一致
   即将fn转化为柯里化函数
```javascript
function fn(a, b, c) {
   return [].slice.apply(arguments, 0).recude(function(a, b) { return a + b }, 0);
}
// 实现一
const _curry1 = function(fn, args=[]){
	return function() {
		let rest = [...arguments, ...args];
		// 如果参数个数小于最初的fn.length，则递归调用，继续收集参数
		if (rest.length < fn.length){
			return _curry1.call(this, fn, rest);
		}
		return fn.call(this, ...rest);
	}
}
// 实现二
const _curry2 = (fn) => {
	const curried = (...args) => {
      if(args.length >= fn.length) {
      	return fn.apply(this, args)
      } else {
      	return (...args2) => {
      		let temp = args.concat(args2);
           return curried(...temp)
      	}
      }
	}
	return curried;
}
let _fn = _curry2(fn)
let sum1 = _fn(1, 2, 3);
let sum2 = _fn(1, 2)(3);
let sum3 = _fn(1)(2)(3);
let sum4 = _fn(1, 2)(3);
console.log('sum1==', sum1)
console.log('sum2==', sum2)
console.log('sum3==', sum3)
console.log('sum4==', sum4)
```
## 开始详解函数的柯里化
1. 概念：
> 柯里化是指这样一个函数(假设叫做createCurry)，他接收函数A作为参数，运行后能够返回一个新的函数。并且这个新的函数能够处理函数A的剩余参数。
2. 原理解析
> 柯里化函数的运行过程其实是一个参数的收集过程，我们将每一次传入的参数收集起来，并在最里层里面处理
3. 聪明的读者可能已经发现，把函数经过createCurry转化为一个柯里化函数，最后执行的结果，不是正好相当于执行函数自身吗？柯里化是不是把简单的问题复杂化了？如果你能够提出这样的问题，那么说明你确实已经对柯里化有了一定的了解。柯里化确实是把简答的问题复杂化了，但是复杂化的同时，我们使用函数拥有了更加多的自由度。而这里对于函数参数的自由处理，正是柯里化的核心所在

## 柯里化函数的使用场景
1. 输入场景校验
```javascript
// 实现方式1
function check (targetString, reg) {
	console.log(arguments)
	return reg.test(targetString);
}
check(/^1[34578]\d{9}$/, '14900000088');
check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com');

// 实现方式2 将其柯里化
const _check = function(check, args =[]) {
    return function() {
    	let rest = [...args, ...arguments]
   	    if (rest.length < check.length) {
   	   		return _check.apply(this, check, rest)
   	    }
   	    return _check.apply(this, ...args);
    }
};
var checkPhone = _check(/^1[34578]\d{9}$/);
var checkEmail = _check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);
checkPhone('183888888');
checkEmail('xxxxx@test.com');
```