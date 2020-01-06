export interface TargetFunction {
  (params: object, page?: number, size?: number): Promise<{ data: any[]; total: number }>
}

export interface AsyncIteratorPropsType {
  next(): Promise<{ done: boolean; value: any[]; total: number }>
}

/**
 * 创建同步迭代去
 * @param array 数组
 * @param step 步长
 */
export const createIterator = (array: [], step = 1) => {
  let nextIndex = 0
  return {
    next() {
      if (nextIndex < array.length) {
        const startIndex = nextIndex
        const endIndex = startIndex + step
        nextIndex += step
        return {
          value: array.slice(startIndex, endIndex),
        }
      }
      return { done: true }
    },
  }
}

/**
 * 创建异步迭代器
 * @param array
 * @param step
 */
export const createAsyncIterator = (targetFunction: TargetFunction, params: object = {}, size = 10) => {
  const doneData = { done: true, value: [], total: 0 }
  let page = 1 // 页码
  let totalData: number // 数据总长度
  return {
    async next() {
      if (page === 1) {
        const { total, data } = await targetFunction(params, page, size)
        totalData = total
        if (totalData === 0) {
          return doneData
        }
        page += 1
        return { done: total <= size, value: data, total }
      }
      if (totalData - (page - 1) * size > 0) {
        const { data } = await targetFunction(params, page, size)
        page += 1
        return { done: totalData <= page * size, value: data, total: totalData }
      }
      return { ...doneData, total: totalData }
    },
  }
}

export default { createIterator, createAsyncIterator }
