class Node {
  constructor(value) {
    this.item = value;
    this.next = null;
  }
}
class SingleLinkList {
  constructor() {
    this._head = null;
  }
  // 判断是否为空
  is_empty() {
    return this._head === null;
  }
  // 长度
  length() {
    let cur = this._head;
    let count = 0;
    while (cur != null) {
      count += 1;
      cur = cur.next;
    }
    return count;
  }
  // 获取链表数据迭代器
  items() {
    let cur = this._head;
    while (cur != null) {
      yield cur.item;
      cur = cur.next
    }
  }
  // 链表头部添加元素
  add(item) {
    let node = new Node(item);
    node.next = this._head;
    this._head = node;
  }
  // 链表尾部添加元素
  append(item) {
    let node = new Node(item)
    if (this.is_empty) {
      this._head = node;
    } else {
      cur = this._head;
      while (cur != null) {
        cur = cur.next;
      }
      cur.next = node;
    }
  }
  // 指定位置添加元素
  insert(index, item) {
    if (index <= 0) {
      this.add(item)
    } else if (index > this.length() - 1) {
      this.append(item)
    } else {
      let node = new Node(item);
      cur = this._head;
      for (let i = 0; i < index - 1; i++) {
        cur = cur.next
      }
      node.next = cur.next;
      cur.next = node;
    }
  }
  // 删除节点
  remove(item) {

  }
  // 查找节点是否存在
  find(item) {
    return item in self.items()
  }
}

let appKey = "";
if (params.smsTaskId) {
  mockJson = {
    error_code: "201",
    error: "success",
    data: { "result": true }
  };
} else {
  mockJson = {
    error_code: "1",
    error: "failed",
    data: { "result": false }
  };
}