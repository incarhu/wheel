window.onload = function() {
	new BackToTop({
		el: 'to-top'
	})
}


class BackToTop {
	constructor(options) {
		// 要传入的节点
		this.$el = document.getElementById(options.el ? options.el : '')
		// 初始化回到顶部的dom节点
		this.$topEv = null
		// 定时器
		this.$timer = null
		// 获取可视区域的高度
		this.$clientHeight = document.documentElement.clientHeight
		// 标志，是否到达顶部
		this.$isTop = true
		this.init()
		this.bindEvent()
	}

	// 初始化dom
	init() {
		let _top = `
			<div class="top-wrap">
				<img src="./images/top.png" alt="">
			</div> 
		`
		this.$el.innerHTML = _top
	}

	// 公共事件处理
	bindEvent() {
		this.showHide()
		// 获取回到顶部的图标dom节点
		this.$topEv = document.querySelector('.top-wrap')
		this.$topEv.onclick = function() {
			this.toTop()
		}.bind(this)
	}

	// 显示操作
	showHide() {
		window.onscroll = function() {
			// 如果滚动条的top > 可视区的高度
			let _scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        
            if(_scrollTop >= this.$clientHeight) {
            	this.$topEv.style.display = 'block'
            } else {
            	this.$topEv.style.display = 'none'
            }

            // 第二次拖动滚动条时，需设置为true
            if(!this.$isTop) {
            	clearInterval(this.$tiemr)
            	this.$isTop = true
            }
		}.bind(this)
	}

	// 回到顶部操作
	toTop() {
		if(this.$isTop) {
			this.$timer = setInterval(function(){
		        let _scrollTop = document.body.scrollTop || document.documentElement.scrollTop
		        // 计算速度
		        let speed = Math.floor(-_scrollTop / 5)

		        document.documentElement.scrollTop = document.body.scrollTop = _scrollTop + speed

		        if(_scrollTop == 0) {
		        	this.$isTop = false
		            clearInterval(this.$timer)
		        }
		    }.bind(this), 30)
		}	
	}
}