$(document).ready(function() {
    if (typeof seSelect !== 'undefined') seSelect.init(); /* 셀렉트 초기화 */
    if (typeof chkAll !== 'undefined') chkAll.init(); /* 전체 동의 초기화 */
    if (typeof authValidation !== 'undefined') authValidation.init(); /* 본인인증 초기화 */

    /* 이메일 도메인 선택 */
    $('#domain-select').on('change', function() {
        var val = $(this).val();
        var $domainInput = $('.email-domain');
        if (val === 'direct' || val === '') {
            $domainInput.val('').prop('disabled', false).focus();
        } else {
            $domainInput.val(val).prop('disabled', true);
        }
    });

    /* 메인 스와이퍼 */
    if ($('.recommend-swiper').length > 0) {
        window.recommendSwiper = new Swiper('.recommend-swiper', {
            loop: true,
            /* autoplay: { delay: 3000, disableOnInteraction: false }, */
            pagination: { el: '.recommend-pagination', clickable: true },
            observer: true,
            observeParents: true 
        });
    }
	if ($('.card-main-swiper').length > 0) {
		window.cardMainSwiper = new Swiper('.card-main-swiper', {
			slidesPerView: 1,      
			centeredSlides: true,       
			spaceBetween: 12,                       
			initialSlide: 0,            

			loopedSlides: 2,            
			
			touchRatio: 1,
			resistance: false,
			
			pagination: {
				el: '.swiper-pagination-fraction',
				type: 'fraction',
			},
			navigation: {
				nextEl: '.btn-next',
				prevEl: '.btn-prev',
			},

			/* 탭 전환 시 새로고침 */
			observer: true,
			observeParents: true,
		});
	}
	/* 추천 카드 스와이퍼 */
	if ($('.recommend-card-swiper').length > 0) {
		new Swiper('.recommend-card-swiper', {
			slidesPerView: 1,   /* 한 화면에 하나씩 딱 맞게 */
			spaceBetween: 20,   /* 슬라이드 사이 간격 (안 보이더라도 벌려주는 게 좋음) */
			loop: true,         /* 무한 루프 */
			pagination: {
				el: '.recommend-dot',
				clickable: true,
			},
		});
	}
    /* 탭 전환 */
    $('.tab-list li').on('click', function() {
        var idx = $(this).index();
        $(this).addClass('on').siblings().removeClass('on');
        $('.tab-content').eq(idx).addClass('on').siblings().removeClass('on');
        
        if (idx === 0 && window.recommendSwiper) {
            window.recommendSwiper.update(); 
        }
    });

	/* 알약탭 */
	$('.pill-tab-list li').on('click', function() {
		var idx = $(this).index();

		$(this).addClass('on').siblings().removeClass('on');

		var $parent = $(this).closest('.product-list-area');
		$parent.find('.pill-content').eq(idx).addClass('on').siblings().removeClass('on');
	});

	/* 찜버튼 on off */
	$(document).on('click', '.btn-wish', function(e) {
        e.stopPropagation(); 
        $(this).toggleClass('on');
    });

    /* 금융 캘린더 날짜 클릭 */
    $('.weekly-list li').on('click', function() {
        if ($(this).hasClass('disabled')) {
            return false; 
        }
        $(this).addClass('on').siblings().removeClass('on');
        var targetDate = $(this).attr('data-date');
        var $targetGroup = $('.trans-group[data-date="' + targetDate + '"]');

        if ($targetGroup.length > 0) {
            $('.trans-group').removeClass('on');
            $targetGroup.addClass('on');
            $('.trans-empty').hide();
        } else {
            $('.trans-group').removeClass('on');
            $('.trans-empty').show();
        }
    });

    /* 아코디언 */
    $(document).on('click', '.btn-fold', function() {
        accord.toggle(this);
    });

    /* 커스텀 셀렉트 */
    $(document).on('click','.se-select .btn-fake-slt', function() {
        if ( $(this).siblings('select').prop('disabled') ) return;
        customSelect( $(this).closest('.se-select').find('select') );
    });

    $(document).on('change', '[data-stove="select"] select', function(){
        seSelect.errorChk( $(this) );
    });

	if ($('#popMainEvent').length > 0) {
        setTimeout(function() {
            openLayer('popMainEvent');
        }, 300);
    }
}); 

/* 커스텀 셀렉트 함수 */
var customSelect = function(element) {
	var fnName = '[data-stove="select"]'
		$this = $(element).closest(fnName),
		$select = $this.find('select');
		$stage = $('body');

	var	onClass = 'on',
		dimClass = 'stove-dim',
		optionLayerClass = 'stove-option-layer',
		optionLayerScrollClass = 'stove-option-scroll',
		optionLayerCloseClass = 'stove-btn-close',
		optionTitleClass = 'stove-options-title',
		optionListClass= 'stove-options',
		optionClass = 'stove-option';

	var	nowStatus = $this.attr('data-status'),
		statusDisabled = $select.attr('disabled'),
		statusReadonly = $select.attr('readonly'),		
		uiCase = $this.attr('data-uicase'),
		optionLength = $select.children('option').length;

	if ( statusDisabled == 'disabled' ||  statusReadonly == 'readonly' ) return;
	$(fnName).find('.'+dimClass+', .'+optionLayerClass+'').remove();	

	$select.before('<div class="'+dimClass+'"></div>');	
	$select.after('<div class="'+optionLayerClass+'" role="dialog"></div>');

	var $dim = $this.find('.'+dimClass),
		$optionLayer = $this.find('.'+optionLayerClass);	
	var $optionScroll = $('<div>', { class: optionLayerScrollClass }).appendTo($optionLayer);
	var $optionList = $('<div>', { class: optionListClass }).appendTo($optionScroll);	
	
    for ( var i = 0; i < optionLength; i++ ) {
		var option = $select.children('option').eq(i);
		if ( option.attr('disabled') && option.attr('selected') && option.attr('hidden') ) {    
		} else if ( option.attr('disabled') ) {        
			$('<button>', { class: optionClass, text: option.text(), disabled: 'disabled' }).attr('data-value', option.val()).appendTo($optionList);			    
		} else if ( option.attr('hidden') ) {   
		} else {
			$('<button>', { class: optionClass, text: option.text() }).attr('data-value', option.val()).appendTo($optionList);
		}
	}
	
	var $optionBtn = $optionList.find('button');
	var $closeBtn = $('<button>', { class: optionLayerCloseClass, title: '닫기' }).appendTo($optionLayer);
	var $optionTitle = $('<div>', { class: optionTitleClass, text: $this.find('.e-hidden-title').text() }).prependTo($optionLayer);

	setTimeout(function(){
		$optionBtn.each(function(){
			var thisRel = $(this).attr('data-value'), thisValue = $select.val();
			if ( thisRel == thisValue ) { $(this).addClass(onClass); }			
		})
	}, 0);

	function open(){		
		$optionLayer.addClass('va-'+uiCase); 			
		if ( uiCase == 'slide' ) {			
			setTimeout(function(){	
				$dim.addClass(onClass);
				$optionLayer.addClass(onClass);		
				$stage.css({'overflow':'hidden'});
			}, 0);	
			setTimeout(function(){ $optionLayer.attr('tabindex', 0).focus(); }, 0);		
			$dim.click(function(e) { e.stopPropagation(); close(); });								
		}
		$this.attr('data-status','open');
	};

	function close(){					
		if ( uiCase == 'slide' ) {		
			setTimeout(function(){				
				$dim.remove();
				$optionLayer.remove();
				$stage.css({'overflow':'auto'});
			}, 0);
		}
		setTimeout(function(){ $this.removeAttr('data-status'); }, 1);				
	};

	$select.on({ keydown: function(e) { if ( e.keyCode==27 ) { e.stopPropagation(); close(); } } });
	$optionLayer.on({ click: function(e) { e.stopPropagation(); }, keydown: function(e) { if ( e.keyCode==27 ) { e.stopPropagation(); close(); } } });
	$closeBtn.on({ click: function(e) { e.stopPropagation(); close(); }, blur: function(e) { $optionLayer.addClass(onClass).attr('tabindex', 0).focus(); } });
	$optionBtn.on({ 
		click: function(e) {
			e.stopPropagation();    
			$select.val($(this).attr('data-value')).trigger('change');
			close();
			var $fakeSlt = $this.closest('.se-select').find('.btn-fake-slt'), $fakeSltVal = $fakeSlt.find('.value');
			var sltVal = $(this).text().toString();
			$fakeSlt.focus().addClass('selected');
			$fakeSltVal.text( sltVal ); 
		}
	});
			
	if ( nowStatus == 'open' ) { close(); } else { open(); }
};

/* 셀렉트 초기화 */
var seSelect = (function(){ 
	return {
		init : function() {
			$('.se-select').each(function() {
				if( $(this).attr('data-stove') == 'select' ) {
					if ( $(this).find('.btn-fake-slt').length != 0 ) return;
					$(this).append('<button type="button" class="se-btn btn-fake-slt"><span class="placeholder"></span><span class="value"></span></button>');
					var $select = $(this).find('select'), $fakeSlt = $(this).find('.btn-fake-slt'), $fakeSltPlaceholder = $fakeSlt.find('.placeholder'), $fakeSltVal = $fakeSlt.find('.value');
					if( $select.attr('disabled') ) { $fakeSlt.addClass('disabled'); }
					$select.find('option').each(function() {
						if( $(this).attr('hidden') ) { $fakeSltPlaceholder.text( $(this).text() ); } 
						if( $(this).attr('selected') ) { $fakeSlt.addClass('selected'); $fakeSltVal.text( $(this).text() ); } 
					});
				}
			});
		},
		errorChk : function( _target ) {
			var	$slt = $(_target), $sltWrap = $slt.closest('.se-select'), $fakeSlt = $sltWrap.find('.btn-fake-slt');
			if( $slt.hasClass('has-error') ) { $fakeSlt.addClass('has-error'); } else { $fakeSlt.removeClass('has-error'); }
		},
		valChk : function( _target ) { 
			var $seSlt = $(_target), $select = $seSlt.find('select'), $fakeSlt = $seSlt.find('.btn-fake-slt'), $fakeSltVal = $fakeSlt.find('.value');
			if( $select.attr('disabled') || $select.prop('disabled') == true ) { $fakeSlt.addClass('disabled'); } else { $fakeSlt.removeClass('disabled'); }
			$select.find('option').each(function() {
				if( $(this).prop('selected') == true && $(this).prop('hidden') != true ) { $fakeSlt.addClass('selected'); $fakeSltVal.text( $(this).text() ); }  
				if( $(this).prop('selected') == true && $(this).prop('hidden') == true && $(this).index() == 0 ) { $fakeSlt.removeClass('selected'); $fakeSltVal.text(''); }
			});
		}
	}
})();

/* 아코디언 객체 */
var accord = (function() {
    return {
        toggle: function(element) {
            var $this = $(element), $target = $this.closest('[data-stove="accordion"]');
            if ($target.hasClass('on')) { $target.removeClass('on'); $this.find('span').text('펼치기'); } 
            else { $target.addClass('on'); $this.find('span').text('접기'); }
        }
    }
})();

/* 체크박스 전체동의 객체 */
var chkAll = (function() {
    return {
        init: function() {
            $(document).on('change', '.terms-head input[type="checkbox"]', function() {
                var isChecked = $(this).prop('checked'), $pack = $(this).closest('.terms-pack');
                $pack.find('.terms-body input[type="checkbox"]').prop('checked', isChecked);
                chkAll.checkBtn();
            });
            $(document).on('change', '.terms-body input[type="checkbox"]', function() {
                var $pack = $(this).closest('.terms-pack'), total = $pack.find('.terms-body input[type="checkbox"]').length, checked = $pack.find('.terms-body input[type="checkbox"]:checked').length;
                if (total === checked) { $pack.find('.terms-head input[type="checkbox"]').prop('checked', true); } 
                else { $pack.find('.terms-head input[type="checkbox"]').prop('checked', false); }
                chkAll.checkBtn();
            });
        },
        checkBtn: function() {
            var totalRequired = $('.terms-body input[type="checkbox"]').length, checkedRequired = $('.terms-body input[type="checkbox"]:checked').length, $submitBtn = $('.btn-fixed-bottom .btn-primary');
            if (totalRequired > 0 && totalRequired === checkedRequired) { $submitBtn.prop('disabled', false).removeClass('disabled'); } 
            else { $submitBtn.prop('disabled', true).addClass('disabled'); }
        }
    }
})();

/* 본인인증 유효성 검사 객체 */
var authValidation = (function() {
    return {
        init: function() {
            if ($('#btnReqAuth').length === 0) return;
            $('#btnReqAuth').on('click', function() {
                var phoneVal = $('#userPhone').val();
                if (phoneVal.length < 10) { alert('휴대폰 번호를 올바르게 입력해주세요.'); return; }
                $(this).text('요청완료').addClass('disabled');
                $('#authBox').show(); $('#authNum').focus();
                authValidation.check();
            });
            $('.PAY-AUTH-003 input, .PAY-AUTH-003 select').on('input change', function() { authValidation.check(); });
        },
        check: function() {
            var name = $('#userName').val().trim(), res1 = $('#resNum1').val().trim(), res2 = $('#resNum2').val().trim(), telecom = $('#telecom').val(), phone = $('#userPhone').val().trim(), authNum = $('#authNum').val().trim();
            var isAuthOpen = $('#authBox').is(':visible'), $btnNext = $('.btn-fixed-bottom .btn-primary');
            if (name.length > 0 && res1.length === 6 && res2.length === 7 && telecom !== "" && phone.length >= 10 && isAuthOpen && authNum.length === 6) { $btnNext.removeClass('disabled').prop('disabled', false); } 
            else { $btnNext.addClass('disabled').prop('disabled', true); }
        }
    }
})();

/* 팝업 열기 함수 */
function openLayer(id) {
    $('#' + id).addClass('on');
    $('body').css('overflow', 'hidden');
}

/* 팝업 닫기 함수 */
function closeLayer(el) {
    $(el).closest('.layout-slide').removeClass('on');
    $('body').css('overflow', ''); 
}