# @sishuguojixuefu/iterator

> 让前端分页需求更简单

## Installation

```sh
$ yarn add @sishuguojixuefu/iterator
```

## Usage

### interface

```ts
/**
 * 异常记录
 */
static getExceptionRecordsList = async (params: {}, page, size) => {
  const result: {
    data: { id: string; studentGroupName: string; startTime: string; endTime: string; outTime: boolean }[]
    total: number
  } = await request.post('/course/exception-records', { ...params, page, size })
  return result
}
```

### iterator

```js
this.Iterator = createAsyncIterator(getExceptionRecordsList, params, 10)
```

## principle

Iterator接口的实现须满足几个条件：

1. 必须是一个函数，且返回一个对象；
2. 返回的对象须包含一个 `next()` 方法；
3. `next()` 方法执行后须返回一个对象，且对象须包含代表成员的 `value` 属性、表示遍历是否结束的 `done` 属性。
