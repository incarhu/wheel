// 穿梭框
function Shuttle(options) {
    this.$options = options
    this.data = this.$options.data
    this.$el = this.selector(this.$options.el)
    this.$callBack = this.$options.callBack || function() {}
    this.isShowAllSelect = true // 是否显示全选
    this.flag = true
    this.newArr = []
    if (!!this.data && Object.prototype.toString.call(this.data) === "[object Array]") {
        this.initData()
        this.initDom()
        this.bindClick()
        this.listenerInput()
    }
}

// 初始化data数据
Shuttle.prototype.initData = function() {
    for (var i = 0; i < this.data.length; i++) {
        this.data[i].checked = false
    }
}

// 初始化dom
Shuttle.prototype.initDom = function(val) {
    var val = val || ''
    this.$el.innerHTML = ''
    var div = document.createElement('div')
    var $opera = document.createElement('div')
    var $afterData = document.createElement('div')
    var str = '';
    str += '<div class="beforeData identical_style">'
    if (this.isShowAllSelect) {
        str += '<div>'
        str += '<input type="checkbox" class="all_select" value="all" />全选'
        str += '</div>'
    }
    str += '<div>'
    str += '<input type="search" class="search" value="' + val + '">'
    str += '</div>'
    str += '<div class="content brefore_content">'
    if (this.flag) {
        for (var i = 0; i < this.data.length; i++) {
            if (!this.data[i].checked) {
                str += '<div class="list">'
                str += '<input type="checkbox" class="before_check" id="' + this.data[i].id + '" value="' + this.data[i].value + '" />'
                str += '<span>' + this.data[i].label + '</span>'
                str += '</div>'
            }
        }
    } else {
        for (var i = 0; i < this.newArr.length; i++) {
            if (!this.data[i].checked) {
                str += '<div class="list">'
                str += '<input type="checkbox" class="before_check" id="' + this.data[i].id + '" value="' + this.data[i].value + '" />'
                str += '<span>' + this.data[i].label + '</span>'
                str += '</div>'
            }
        }
    }

    str += '</div>'
    str += '</div>'
    div.innerHTML = str;

    var str2 = '';
    str2 += '<div class="operate">'
    str2 += '<button class="opera_style opera_right" disabled="true">'
    str2 += '>'
    str2 += '</button>';
    str2 += '<button class="opera_style opera_left" disabled="true">'
    str2 += '<'
    str2 += '</button>'
    str2 += '</div>'
    $opera.innerHTML = str2;

    var $after = '';
    $after += '<div class="afterData identical_style">'
    $after += '<div class="content">'
    for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].checked) {
            $after += '<div class="list">'
            $after += '<input type="checkbox" class="after_check" id="' + this.data[i].id + '" value="' + this.data[i].value + '"  />'
            $after += '<span>' + this.data[i].label + '</span>'
            $after += '</div>'
        }
    }
    $after += '</div>'
    $after += '</div>'
    $afterData.innerHTML = $after
    this.$el.appendChild(div)
    this.$el.appendChild($opera)
    this.$el.appendChild($afterData)
}

// 公共事件绑定
Shuttle.prototype.bindClick = function() {
    this.$el.onclick = function(e) {
        var currentNode = e.target
        if (currentNode.className == 'all_select') {
            // 全选
            this.publicCheck(currentNode)
            this.allSelect(currentNode)
        }
        if (currentNode.classList.contains('before_check')) {
            // 左侧选框
            this.publicCheck(currentNode)
            this.btnStyle(currentNode)
            this.allSelect(currentNode)
        };

        if (currentNode.classList.contains('after_check')) {
            // 右侧选框
            this.publicCheck(currentNode)
            this.btnStyle(currentNode)
        };

        if (currentNode.classList.contains('opera_right')) {
            // 右箭头
            this.publicData('before_check')
        }

        if (currentNode.classList.contains('opera_left')) {
            // 左箭头
            this.publicData('after_check')
        }
    }.bind(this)
}

// 公用checked
Shuttle.prototype.publicCheck = function(currentNode) {
    if (currentNode.getAttribute('checked') != 'true') {
        currentNode.setAttribute('checked', true)
    } else {
        currentNode.removeAttribute('checked')
    }
}

// 公用触发方法
Shuttle.prototype.publicData = function(ele) {
    var hasCheck = document.getElementsByClassName(ele)
    for (var i = 0; i < hasCheck.length; i++) {
        if (ele === 'before_check') {
            // 向右
            if (hasCheck[i].getAttribute('checked')) {
                // 表示选中
                this.data[i].checked = true
            }
        } else {
            var id;
            if (hasCheck[i].getAttribute('checked')) {
                // 表示选中
                id = hasCheck[i].getAttribute('id')
                this.data.forEach(function(item) {
                    if (id == item.id) {
                        item.checked = false
                    }
                })
            }
        }
    }
    this.initDom()
    this.$callBack(this.data)
}

// 按钮样式
Shuttle.prototype.btnStyle = function(currentNode) {
    var allBeforeChecked = this.selector('before_check')
    var allAfterChecked = this.selector('after_check')
    var rightBtn = this.selector('.opera_right')
    var leftBtn = this.selector('.opera_left')

    // 左边
    if (currentNode.className == 'before_check') {
        this.dispostPublicStyle(allBeforeChecked, rightBtn)
    } else if (currentNode.className == 'after_check') {
        // 右边
        this.dispostPublicStyle(allAfterChecked, leftBtn)
    }
}

// 统一处理穿梭款按钮禁用、显示
Shuttle.prototype.dispostPublicStyle = function(arrList, btnType) {
    var hasArr = []
    arrList.forEach(function(item) {
        hasArr.push(item.getAttribute('checked'))
        if (hasArr.includes('true')) {
            btnType.removeAttribute('disabled')
        } else {
            btnType.setAttribute('disabled', true)
        }
    })
}

// 处理全选
Shuttle.prototype.allSelect = function(ele) {
    var allBeforeChecked = this.selector('before_check')
    var rightBtn = this.selector('.opera_right')
    var allSelect = this.selector('.all_select')
    var isAllSelect = []
    if (ele.className == 'all_select') {
        for (var i = 0; i < allBeforeChecked.length; i++) {
            if (ele.getAttribute('checked') == 'true') {
                allBeforeChecked[i].setAttribute('checked', true)
                allBeforeChecked[i].checked = true
            } else {
                allBeforeChecked[i].removeAttribute('checked')
                allBeforeChecked[i].checked = false
            }
        }
    } else if (ele.className == 'before_check') {
        for (var i = 0; i < allBeforeChecked.length; i++) {
            isAllSelect.push(allBeforeChecked[i].getAttribute('checked'))
            if (isAllSelect.includes(null)) {
                allSelect.checked = false
                allSelect.removeAttribute('checked')
            } else {
                allSelect.checked = true
                allSelect.setAttribute('checked', true)
            }
        }
    }
    this.dispostPublicStyle(allBeforeChecked, rightBtn)
}

// 监听input输入值
Shuttle.prototype.listenerInput = function() {
    var inputVal = this.selector('.search')
    var val;
    inputVal.oninput = function(e) {
        val = e.target.value
        this.throole(this.data, val, function(arr, flag) {
            this.flag = flag
            if (!this.flag) {
                this.newArr = arr
            } else {
                this.data = arr
            }
            this.initDom(val)
            this.bindClick()
            this.listenerInput()
        }.bind(this))
    }.bind(this)
}

Shuttle.prototype.throole = function(arrList, val, callBack) {
    var arr = []
    var flag = false
    setTimeout(function() {
        arrList.forEach(function(item) {
            if (val == item.value) {
                arr.push(item)
                flag = false
            } else if (val == '') {
                arr = arrList
                flag = true
            }
        })
        callBack(arr, flag)
    }, 500)
}

// 选择器
Shuttle.prototype.selector = function(ele) {
    if (!!ele && ele.indexOf('.') !== -1) {
        return document.querySelector(ele)
    } else {
        // 不传.的class走querySelectorAll
        return document.querySelectorAll('.' + ele)
    }
}