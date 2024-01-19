###  1. 输出 100 以内的菲波那切数列
```
function fib(n) {
    if (n < 3) return 1;
    return fib(n - 1) + fib(n - 2);
}
console.log(fib(5))
```

### 2. TopK 问题
```
function topK(array, top) {
    function heapSort(array) {
        // 构建最大堆
        const len = array.length;
        for(let i = Math.floor((len - 1) / 2); i >= 0; i --) {
            buildHeap(array, len, i);
        }
        // 数组首尾交换，最大值至数组尾部，且递归对剩余数组进行堆排序
        let n = len;
        while(n > 1) {
            [array[0], array[n - 1]] = [array[n - 1], array[0]];
            n --;
            buildHeap(array, n, 0)
        }
        return array;
    }

    function buildHeap(array, len, index) {
        const largestIndex = findLargestIndex(array, len, index);
        if (largestIndex !== index) {
            [array[index], array[largestIndex]] = [array[largestIndex], array[index]]
            buildHeap(array, len, largestIndex);
        }  
    }

    function findLargestIndex(array, len, parentIndex) {
        let leftChildIndex = 2 * parentIndex + 1;
        let rightChildIndex = 2 * parentIndex + 2;
        let largestIndex = parentIndex;
        if (leftChildIndex < len && array[leftChildIndex] > array[parentIndex]) {
            largestIndex = leftChildIndex
        }
        if (rightChildIndex < len && array[rightChildIndex] > array[largestIndex]) {
            largestIndex = rightChildIndex
        }
        return largestIndex;
    }
    console.log(heapSort(array))
    return heapSort(array).slice(0, top)
}

const array = [1,2,2,3,4,5,6,3,3,4,5,6,7,3,4,5,7,8]
console.log(topK(array, 5))
```

### 3. 求正序增长的正整数数组中，其和为 N 的两个数
```
/**
* @description 双指针实现
**/
function twoSum(array, target) {
    let left = 0;
    let right = array.length - 1;
    let result = [];
    while(left < right) {
        const sum = array[left] + array[right];
        if (sum === target) {
            result.push([{ index: left, value: array[left]}, { index: right, value: array[right]}]);
            left ++;
            right --;
        } else if (sum < target) left ++
        else if (sum > target) right --
    }
    return result;
}
console.log(twoSum([1,2,3,4,5,6,7,8,9], 10))
```

### 4. 求给定数组中 N 个数相加之和为 sum 所有可能集合
```
/**
* @description 组合算法：快速排序 + 递归 + 双指针
**/
function nSum(array, n, target) {
    function sort(array, len) {
        if (len <= 1) return array;
        const baseIndex = Math.floor(Math.random() * len);
        const base = array[baseIndex];
        const leftArray = [], rightArray = [];
        for (let i = 0; i < len; i++) {
            if (i === baseIndex) continue;
            if (array[i] < base) leftArray.push(array[i])
            else rightArray.push(array[i])
        }
        return [...sort(leftArray, leftArray.length), base, ...sort(rightArray, rightArray.length)]
    }
    
    // 排序
    const len = array.length;
    array = sort(array, len);

    // twoSum实现
    function twoSum(array, sum) {
        const len = array.length;
        let left = 0, right = len - 1, result = [];
        while(left < right) {
            if (array[left] + array[right] === sum) {
                result.push([array[left], array[right]]);
                left ++;
            } else if (array[left] + array[right] > sum) right --
            else if (array[left] + array[right] < sum) left ++
        }
        return result;
    }
    // 查找
    function calc(array, n, target) {
        if (n === 2) return twoSum(array, target);
        let result = [];
        for (let i = 0, len = array.length; i < len; i ++) {
            const first = array[i];
            const remainSum = target - first;
            if (remainSum < 0) return null;
            const r = calc(array.slice(i + 1), n - 1, remainSum)
            if (!r || !r.length) continue;
            r.forEach(item => result.push(Array.isArray(item) ? item.concat(first) : [item, first]))
        }
        return result;
    }

    return calc(array, n, target);
}
console.log(nSum([1,2,6,3,7,8,9,0,4], 4, 10))
```

### 5. 如何判断两个链表是否相交
```
var getIntersectionNode = function(headA, headB) {
    const memory = new Set();
    let temp = headA;
    while(temp) {
         memory.add(temp);
         temp = temp.next;
    }
    temp = headB;
    while(temp) {
        if(memory.has(temp)) {
            return temp;
        }
        temp = temp.next
    }
    return null
};

```