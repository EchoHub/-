/**
 * @introduction 冒泡、选择、插入、归并、快排、堆
 * */ 

/**
* @name 冒泡排序
* @description：两两相邻比较，如果第一个元素大于第二个元素则互换位置，依次类推比对完数组，这样尾部为最大数据；针对所有数据重复上述操作，直到整个数组有序排列
* @info 时间复杂度 O(n^2); 空间复杂度 O(1)
**/
function sort(array) {
    for(let i = 0, len = array.length; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j ++) {
            if (array[j] > array[j + 1]) {
                const temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
    return array;
}

/**
* @name 选择排序
* @description 把当前没有排序的数组的第一个元素作为最小元素，遍历数组若元素小于当前最小元素，则设置当前元素为最小元素，直到* 数组遍历完成，与第一个元素互换位置，即每次遍历未排序数组都会找出一个最小值，直到排序完成
* @info 时间复杂度O(n^2) 空间复杂度O(1)
**/
function sort(array) {
    for(let i = 0, len = array.length; i < len - 1; i ++) {
        let minIndex = i;
        let minValue = array[i];
        for  (let j = i + 1; j < len; j ++) {
            if (array[j] < minValue) {
                minIndex = j;
                minValue = array[j];
            }
        }
        if (minIndex !== i) {
           [array[i], array[minIndex]] = [array[minIndex], array[i]]
        }
    }
    return array;
}

/**
* @name 插入排序
* @description 从当前位置的下一个元素开始比较，若比前面的数组大则不动，反之则继续向前比较，直到大于前一个元素后插入当前元素，依次类推遍历完所有未排序数据
* @info 时间复杂度O(n^2) 空间复杂度O(1)
**/
function sort(array) {
    for (let i = 1, len = array.length; i < len; i ++) {
        const temp = array[i];
        let j = i;
        while(j > 0) {
            if (array[j - 1] > temp) {
                array[j] = array[j - 1]
            } else break;
            j --;
        }
        array[j] = temp
    }
    return array;
}

/**
 * @name 归并排序
 * @description 先分：将数组左右拆分，并递归拆分子数组，直到一个个独立的元素；后合：从单元素开始两两合并成有序数组，直到合并完整个数组为有序数组
 * @info 时间复杂度O(n*logn) 空间复杂度O(n)
 */
function sort(array) {
    const rec = function(array) {
        if (array.length === 1) return array;
        let midIndex = Math.floor(array.length / 2);
        let leftArray = rec(array.slice(0, midIndex));
        let rightArray = rec(array.slice(midIndex));
        let result = []
        while(leftArray.length || rightArray.length) {
            if (leftArray.length && rightArray.length) {
                result.push(leftArray[0] < rightArray[0] ? leftArray.shift() : rightArray.shift())
            } else if (leftArray.length) {
                result.push(leftArray.shift())
            } else if (rightArray.length) {
                result.push(rightArray.shift())
            }
        }
        return result;
    }
    return rec(array)
}

/**
 * @name 快速排序
 * @description 从数组中选择任意元素为基数，比基数小的放到左边，反之放到右边，递归对左右数组进行分区比对
 * @info 时间复杂度O(n*logn ) 空间复杂度O(logn)
 */
function sort(array) {
    const rec = function(array) {
        if (array.length <= 1) return array;
        const baseIndex = Math.floor(array.length * Math.random());
        const base = array[baseIndex];
        const left = [];
        const right = [];
        for (let i = 0, len = array.length; i < len; i ++) {
            if (i === baseIndex) continue;
            if (array[i] < base) {
                left.push(array[i])
            } else {
                right.push(array[i])
            }
        }
        return [...rec(left), base, ...rec(right)]
    }
    return rec(array);
}

/**
 * @name 堆排序
 * @description 
 * @info 
 */
function sort(array) {
     
    // 对指定索引处的元素进行向上调整操作
    function maxHeapify(arr, n, index) {
        const largestIndex = findLargestChildIndex(arr, n, index);
        
        if (largestIndex !== index) {
            [arr[index], arr[largestIndex]] = [arr[largestIndex], arr[index]];
            
            maxHeapify(arr, n, largestIndex);
        }
    }
     
    // 查找当前节点及其两个子节点中的最大值所在的索引
    function findLargestChildIndex(arr, n, parentIndex) {
        const leftChildIndex = 2 * parentIndex + 1;
        const rightChildIndex = 2 * parentIndex + 2;
        
        let largestIndex = parentIndex;
        
        if (leftChildIndex < n && arr[leftChildIndex] > arr[parentIndex]) {
            largestIndex = leftChildIndex;
        }
        
        if (rightChildIndex < n && arr[rightChildIndex] > arr[largestIndex]) {
            largestIndex = rightChildIndex;
        }
        
        return largestIndex;
    }

    // 构建最大堆（从第一个非叶子节点开始）
    for (let i = Math.floor((array.length - 1) / 2); i >= 0; i--) {
        maxHeapify(array, array.length, i);
    }
    
    let n = array.length;
  
    while (n > 1) {
      // 将根元素与最后一个元素交换位置并移除最后一个元素
      [array[0], array[n-1]] = [array[n-1], array[0]];
      
      n --;
      
      // 调整最大堆性质
      maxHeapify(array, n, 0);
    }
    return array;
}
const array = [2,5,43,6,1,32,5,7,7,9,2,4,90,9,0]
console.log(sort(array));
