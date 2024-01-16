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
    
    }
    function buildHeap(array, len, index) {

    }
    function findLargestIndex(array, len, parentIndex) {

    }

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
* @description 动态规划
**/
function nSum(array, n, target) {
    
}
console.log(nSum([1,2,6,3,7,8,9,2,0,4], 3, 10))
```

### 5. 如何判断两个链表是否相交
```

```