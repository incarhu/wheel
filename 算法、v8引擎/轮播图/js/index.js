window.onload = function() {
	new Carousel({
		el: '#carousel',
		delay: 3000,
		callBack: function(currentSrc){
			console.log(currentSrc)
		}
	})
}


// 轮播图
class Carousel {
	constructor(options) {
		this.$options = options
		// 初始化延时时间
		this.$timer = null
		// 初始化下标
		this.$index = 1
		// 初始化整体图片列表
		this.$list = null
		// 初始化复制图片列表
		this.ImgCopyArr = null
		// 初始化dom节点
		this.$el = this.selector(this.$el ? this.$el : '#carousel')
		// 延时时间
		this.$delay = this.$options.delay || 2000
		// 获取$el的实际宽度
		this.$wid = this.$el.clientWidth
		// 回调函数
		this.$callBack = this.$options.callBack || function() {}
		// 图片是否可点击
		this.$isImgClick = this.$options.isImgClick === undefined || this.$options.isImgClick
		this.init()
		this.bind()
	}

	// 初始化
	init() {
		// 初始化就清除一次定时器
		clearInterval(this.$timer)
		this.copyImg()
		this.$timer = setInterval(
			this.autoPlay.bind(this, true),
			this.$delay
		)			
		this.dynamicCreateMoveNode()
		this.dynamicCreatePaginationNode()	
	}

	// 事件操作
	bind() {
		this.moveOut()
		this.paginationEvent()
		this.picHandleClick()
	}

	// 复制图片
	copyImg() {
		this.ImgCopyArr = this.$el.children[0]		
		// 克隆第一张
		let firstImg = this.ImgCopyArr.firstElementChild.cloneNode()
		// 克隆最后一张
		let lastImg = this.ImgCopyArr.lastElementChild.cloneNode()
		this.ImgCopyArr.append(firstImg)

		this.ImgCopyArr.insertBefore(lastImg, this.ImgCopyArr.firstElementChild)
		
		// 获取图片列表
		this.$img = Array.prototype.slice.call(this.$el.children[0].getElementsByTagName('img'))
	}

	// 自动轮播
	autoPlay(flag) {
		this.$list = this.$el.firstElementChild

		// 默认进行++
		if(flag) {
			this.$index++
		}

		if(this.$index <= 0){
			this.$index = this.$img.length - 2
		} else if(this.$index == this.$img.length - 1){
			this.$index = 1
		} else if(this.$index >= this.$img.length) {
			this.$index = 2
			this.toZero()
		}

		this.$list.style.transform = 'translate3d(' + this.$index * - this.$wid + 'px, 0, 0)'
		this.$list.style.transitionDuration = '.3s'
		
		this.changePagination()
	}

	// 去零
	toZero(){
		this.$list.style.transform = 'translate3d(' + 0 - this.$wid + 'px, 0, 0)'
		this.$list.style.transitionDuration = '0s'
	}

	// 切换pagination原点分页
	changePagination() {
		let _paginateList = this.selector('.pagination')
		_paginateList = Array.prototype.slice.call(_paginateList.getElementsByTagName('i'))
		_paginateList.map(function(item, index){
			return index+1 === this.$index ? item.classList.add('active') : item.classList.remove('active')
		}.bind(this))
	}	

	// 动态生成上一页，下一页节点
	dynamicCreateMoveNode() {
		let filpOver = document.createElement('div')
		filpOver.className = 'flip-over'

		let span = `
			<span class="prev"></span>
			<span class="next"></span>
		`
		filpOver.innerHTML = span
		this.$el.append(filpOver)
		this.handleClick(filpOver)
	}

	// 动态生成分页器
	dynamicCreatePaginationNode() {
		let _paginationGroup = document.createElement('div')
		_paginationGroup.className = 'pagination'
		
		for(let i = 1; i < this.$img.length - 1; i++) {
			let $i = document.createElement('i')		
			_paginationGroup.appendChild($i)
			i === this.$index ? $i.className = 'active circle' : $i.className = 'circle'
		}
		// 分页器居中
		setTimeout(function() {
			let pageWid = _paginationGroup.clientWidth
			_paginationGroup.style.left = (this.$wid - pageWid) / 2 +'px'
		}.bind(this), 30)
		this.$el.append(_paginationGroup)
	}

	// 上一页 下一页
	handleClick(el) {
		el.onclick = function(event){
			let e = event.target
			e.className == 'prev' ? this.$index-- : this.$index++
			this.autoPlay()
		}.bind(this)
	}

	// 移入移出
	moveOut() {
		this.$el.onmouseover = function(){
			clearInterval(this.$timer)
		}.bind(this)

		this.$el.onmouseout = function(){
			this.$timer = setInterval(
				this.autoPlay.bind(this, true),
				this.$delay
			)
		}.bind(this)
	}

	// 点击图片
	picHandleClick() {
		if(this.$isImgClick) {
			this.$img.forEach(item => {
				item.onclick = function(event){
					let src = event.target.src
					this.$callBack(src)
				}.bind(this)
			})
		}
	}

	// 点击分页按钮
	paginationEvent() {
		let _paginateBtn = this.selector('.pagination')
		_paginateBtn = Array.prototype.slice.call(_paginateBtn.getElementsByTagName('i'))
		_paginateBtn.forEach(function(item, index) {
			item.onclick = function() {
				this.$index = index+1
				this.autoPlay()
			}.bind(this)
		}.bind(this))
	}

	// 选择器
	selector(ele) {
		if(!!ele && ele.indexOf('.') !== -1 || !!ele && ele.indexOf('#') !== -1) {
            return document.querySelector(ele)
        } else {
            return document.querySelectorAll(ele)
        }
	}

}