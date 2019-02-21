// カルーセル処理
var slider = function(obj) {
	var top = 0;
	var old = 0;
	var num = obj.length - 1;
	var fade = 1200;
	var interval = 5000;
	var check = 40; // スワイプ判定距離
	var mark = null;
	var direction, position;
	// マーカー現在地処理
	var marker = function() {
		mark.find("li").removeClass("current");
		mark.find("li").eq(top).addClass("current");
	}
	// アイテム切り替え
	var change = function() {
		if(mark) marker();
		obj.eq(old).css("z-index", 0).stop().animate({ opacity: 0}, { "duration": fade, "easing": "swing"});
		obj.eq(top).css({
			display: "block",
			opacity: 0,
			zIndex: 1
		}).stop().animate({ opacity: 1}, { "duration": fade, "easing": "swing"});
		if(top) {
			$(".option").css({
				display: "block"
			}).stop().animate({ opacity: 1}, { "duration": fade, "easing": "swing"});
		} else {
			$(".option").stop().animate({ opacity: 0}, { "duration": fade, "easing": "swing", complete: function() {
				$(this).css({
					display: "none",
					opacity: 0
				});
			}});
		}
	}
	//スワイプ開始時の横方向の座標を格納
	var onTouchStart = function(event) {
		position = getPosition(event);
		direction = ''; //一度リセットする
	}
	//スワイプの方向（left／right）を取得
	var onTouchMove = function(event) {
		if (position - getPosition(event) > check) {
			direction = 'left'; //左と検知
		} else if (position - getPosition(event) < -check){
			direction = 'right'; //右と検知
		}
		console.log(getPosition(event));
	}
	//横方向の座標を取得
	var getPosition = function(event) {
		return event.originalEvent.touches[0].pageX;
	}
	// フリック時の処理
	function onTouchEnd(event) {
		if (direction == 'right'){
			old = top;
			top = (top >= num) ? 0: top + 1;
			change();
		} else if (direction == 'left'){
			old = top;
			top = (top == 0) ? num: top - 1;
			change();
		}
	}
	// タイマーループ
	var loop = function () {
		old = top;
		top = (top >= num) ? 0: top + 1;
		change();
		setTimeout(function () {
			loop();
		}, fade + interval);
	}
	return {
		count: function() {
			return num;
		},
		// アニメーション開始
		start: function() {
			if(num > 0) {
				setTimeout(function () {
					loop();
				}, interval);
			}
		},
		// 前へ戻る
		prev: function() {
			old = top;
			top = (top >= num) ? 0: top + 1;
			change();
		},
		// 次へ
		next: function() {
			old = top;
			top = (top == 0) ? num: top - 1;
			change();
		},
		// ドット生成
		dotted: function(dot) {
			if(num > 0) {
				mark = dot;
				for(var i = 0; i <= num; i++) {
					dot.append("<li></li>");
				}
				dot.find("li").eq(0).addClass("current");
				dot.find("li").on("click", function() {
					old = top;
					top = dot.find("li").index(this);
					change();
				});
			} else {
				dot.css("display", "none");
			}
		},
		// クリック切り替え
		clickChange: function(maker, target) {
			old = top;
			top = maker.index(target);
			change();
		},
		// サムネイル変更
		thum: function(index) {
			old = top;
			top = index;
			change();
		},
		// フリック処理
		flick: function() {
			var show = obj.parent();
			show.on('touchstart', onTouchStart);
			show.on('touchmove', onTouchMove);
			show.on('touchend', onTouchEnd);
		}
	}
}

$(function(){

	// scroll
	smoothScroll.init({
		//offset: 64
	});

	//sp画像差し替え
	var ww = $(window).width();
	var wh;
	var risezeset = function() {
		ww = $(window).width();
		wh = $(window).height();
		if(ww <= 1060) {
			$(".spimg").each(function(index, element) {
				var src = $(this).attr("src");
				src = src.replace("img/","img_sp/");
				 $(this).attr("src", src);
			});
		} else {
			$(".spimg").each(function(index, element) {
				var src = $(this).attr("src");
				src = src.replace("img_sp/","img/");
				 $(this).attr("src", src);
			});
		}
	}
	risezeset();
	$(window).resize(function() {
		risezeset();
	});

	// SP menu
	$("header .menu").on("click", function() {
		var t = $("#gnavi");
		if(t.is(":hidden")) {
			$("body").addClass("lock");
			$(this).addClass("active");
			var h = t.height();
			t.css({
				display: "block",
				opacity: 0
			}).stop().animate({ opacity: 1}, { "duration": 500, "easing": "easeOutQuart"});
		} else {
			$(this).removeClass("active");
			$("body").removeClass("lock");
			t.stop().animate({ opacity: 0}, { "duration": 500, "easing": "easeOutQuart", complete: function() {
				$(this).css({
					display: "none"
				});
			}});
		}
	});

	//SNS
	$(".snsbtn").on('click', function() {
		var url = $(this).attr("href");
		window.open( url, '', 'width=600, height=300, menubar=no, toolbar=no, scrollbars=yes');
		return false;
	});

	//リンクボックス
	$(".linkbox").each(function(index, element) {
		$(this).on("click", function() {
			var target = $(this).find("a").attr("target");
			var url = $(this).find("a").attr("href");
			if(target) {
				window.open(url,'_blank');
				return false;
			} else {
				location.href = url;
			}
		});
	});

	$(window).on("scroll", function() {
		if(ww > 1060) {
			var st = $(window).scrollTop();
			if(st > 0) {
				$(".pagetop").stop().animate({ opacity: 1}, { "duration": 500, "easing": "easeOutQuart"});
			} else {
				$(".pagetop").stop().animate({ opacity: 0}, { "duration": 500, "easing": "easeOutQuart"});
			}
		}
	});

	$('#zip').jpostal({
		postcode : [
			'#zip'
		],
		address : {
			'#address' : '%3%4%5'
		}
	});

	$(".thum a").on("click", function(){
		var parent = $(".show");
		var url = $(this).attr("href");
		var thumbImg = new Image();
		$(thumbImg).on("load",function(e) {
			//イベントのソース元をクローン（thumbImg）
			$this = $(this);
			//埋め込み時初期設定を実施
			$this.attr("width","100%");
			$this.css({
				position: "absolute",
				top: 0,
				left: 0,
				opacity: 0,
				height:"auto",
				width:"100%",
				maxHeight:"none"
			});
			//アニメーションナシでmain_imgに突っ込む
			parent.append($this).stop();
			//表示用アニメーション
			//高さを取得する
			var height = $this.height();
			//フェードイン
			$this.animate({opacity: 1}, {duration: "slow", easing: "linear",queue: false });
			//高さアコーディオン
			parent.animate({ height: height + "px"}, {duration: "slow", easing: "linear",queue: false });

			//前にいた画像の除去
			$this.prev().remove();
		});
		thumbImg.src = url;
		return false;
	});

	// 
	try {
		$(".carouselbox").each( function(i, e) {
			var slide = slider($(this).find(".item"));
			if(slide.count() > 0) {
				$(this).find(".prev").on("click", function() {
					slide.next();
					return false;
				});
				$(this).find(".next").on("click", function() {
					slide.prev();
					return false;
				});
			} else {
				$(this).find(".prev").css("display", "none");
				$(this).find(".next").css("display", "none");
			}
			slide.start();
			slide.flick();
			slide.dotted($(this).find(".marker"));
		});
	} catch(e) {}
});