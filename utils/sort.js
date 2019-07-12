// 希尔排序
function shellSort(arr = []) {
  var len = arr.length,
    temp,
    gap = 1
  while (gap < len / 3) {
    gap = gap * 3 + 1
  }
  for (gap; gap > 0; gap = Math.floor(gap / 3)) {
    for (var i = gap; i < len; i++) {
      temp = arr[i]
      for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j]
        // console.log(arr)
      }
      arr[j + gap] = temp
    }
  }
  return arr
}

// 快速排序
function quickSort(arr) {
  if (arr.length < 2) { return arr }
  // 定义左指针
  var left = 0
  // 定义右指针
  var right = arr.length - 1
  //开启每一轮的排序
  while (left < right) {
    // 寻找右边比arr[0]小的数的下标
    while (arr[right] >= arr[0] && left < right) {
      right = right - 1
    }
    // 寻找左边比arr[0]大的数的下标
    while (arr[left] <= arr[0] && left < right) {
      left++
    }
    //当左边指针与右边指针相遇后，交换arr[0]与当前两个指针所在的元素
    if (right == left) {
      let mid = arr[right]
      arr[right] = arr[0]
      arr[0] = mid
      console.log(arr)
      break
    }
    // 当左指针小于右指针的位置，交换两个指针当前位置的元素
    let tem = arr[right]
    arr[right] = arr[left]
    arr[left] = tem
  }
  //递归实现
  return quickSort(arr.slice(0, left)).concat(arr.slice(left, right + 1)).concat(quickSort(arr.slice(right + 1)));
}
