# Vue Function-based API Implementation

- [Vue Function-based API RFC 原文](https://github.com/vuejs/rfcs/blob/function-apis/active-rfcs/0000-function-api.md)

- [Vue Function-based API RFC 翻译](https://zhuanlan.zhihu.com/p/68477600)

## Notice

1. **Value Unwraping** is is available yet. So you have to use `somethingReactive.value` `@click="somethingReactive.value++"` in your render function (or template).

- value/computed: not supported
- inject: not supported
- state: partial support (not deep nested)

2. Functional Components are not supported yet.

## Usage

Just replace every `import Vue from 'vue'` in your files with `import Vue from 'vue-functional-api'`.

Since `import Vue from 'vue'` also occurs in the es module bundle of this package, a webpack alias may not work.

## API

Take a look at [vue-functional-api/blob/master/src/index.js](https://github.com/AngusFu/vue-functional-api/blob/master/src/index.js).
