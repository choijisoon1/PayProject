/*---------------------------------------------
	ready, load
---------------------------------------------*/
$(document).ready(function(){
	seSelect.init(); // 셀렉트 초기화 실행
});


/*---------------------------------------------
	Custom Select Function #셀렉트
    (기존 로직 유지)
---------------------------------------------*/
/*
	function
*/
var customSelect = function(element) {
	/* Funtion Define */
	var fnName = '[data-stove="select"]'
		$this = $(element).closest(fnName),
		$select = $this.find('select');
		$stage = $('body');

	/* Class Define */
	var	onClass = 'on',
		dimClass = 'stove-dim',
		optionLayerClass = 'stove-option-layer',
		optionLayerScrollClass = 'stove-option-scroll',
		optionLayerCloseClass = 'stove-btn-close',
		optionTitleClass = 'stove-options-title',
		optionListClass= 'stove-options',
		optionClass = 'stove-option';

	/* Extend Define */
	var	nowStatus = $this.attr('data-status'),
		statusDisabled = $select.attr('disabled'),
		statusReadonly = $select.attr('readonly'),		
		uiCase = $this.attr('data-uicase'),
		optionLength = $select.children('option').length;
		

	/* Reset */
	if ( statusDisabled == 'disabled' ||  statusReadonly == 'readonly' ) return;
	$(fnName).find('.'+dimClass+', .'+optionLayerClass+'').remove();	

	/* Option Init */
	$select.before('<div class="'+dimClass+'"></div>');	
	$select.after('<div class="'+optionLayerClass+'" role="dialog"></div>');

	var $dim = $this.find('.'+dimClass),
		$optionLayer = $this.find('.'+optionLayerClass);	
	var $optionScroll = $('<div>', {
			class: optionLayerScrollClass
		}).appendTo($optionLayer);
	var $optionList = $('<div>', {
			class: optionListClass
		}).appendTo($optionScroll);	
	for ( var i = 0; i < optionLength; i++ ) {
		var option = $select.children('option').eq(i);
		if ( option.attr('disabled') && option.attr('selected') && option.attr('hidden') ) {    
			if ( uiCase == 'slide' ) {        
				// $('<div>', {
				// 	class: optionTitleClass,
				// 	text: option.text(),
				// 	rel: option.val()
				// }).appendTo($optionList);
			}     
		} else if ( option.attr('disabled') ) {        
			$('<button>', {
				class: optionClass,
				text: option.text(),
				disabled: 'disabled'
			}).attr('data-value', option.val()).appendTo($optionList);			    
		} else if ( option.attr('hidden') ) {   
			
		} else {
			$('<button>', {
				class: optionClass,
				text: option.text(),
			}).attr('data-value', option.val()).appendTo($optionList);
		}
	}
	
	var $optionBtn = $optionList.find('button');
	var $closeBtn = $('<button>', {
		class: optionLayerCloseClass,
		title: '닫기'
	}).appendTo($optionLayer);

	var $optionTitle = $('<div>', {
		class: optionTitleClass,
		text: $this.find('.e-hidden-title').text()
	}).prependTo($optionLayer);

	setTimeout(function(){
		$optionBtn.each(function(){
			var thisRel = $(this).attr('data-value'),
				thisValue = $select.val();
				
			if ( thisRel == thisValue ) {
				$(this).addClass(onClass);
			}			
			
		})
		// $select.find('option').each(function(){
		// 	var thisOpDis = $(this).attr('disabled');

		// 	if($(this).prop('disabled')){

		// 		if($(this).val() == $optionBtn.attr('rel')){
		// 			$optionBtn.addClass('disabled')
		// 		}
				
		// 	}
		// 	// if( thisRel == thisOpDis ){
		// 	// 	$(this).addClass('disabled')
		// 	// }
		// })
	}, 0);

		
	/* Common Function */	
	function open(){		
		$optionLayer.addClass('va-'+uiCase); 			
		if ( uiCase == 'slide' ) {			
			setTimeout(function(){	
				$dim.addClass(onClass);
				$optionLayer.addClass(onClass)		
				$stage.css({'overflow':'hidden'})	
			}, 0);	
			setTimeout(function(){
				$optionLayer.attr('tabindex', 0).focus();
			},0);		
			$dim.click(function(e) {
				e.stopPropagation();
				close();
			});								
		} else {
			// $optionLayer.attr('tabindex', 0).focus();
			// $stage.on({ 
			// 	click: function(e) { 
			// 		if(!$(e.target).hasClass($this)) { 			
			// 			close();
			// 		};
			// 	}, keydown: function(e) { 
			// 		if ( e.keyCode==27 ) {
			// 			e.stopPropagation();
			// 			close();
			// 		};
			// 	}
			// });
		};
		$this.attr('data-status','open');
	};

	function close(){					
		if ( uiCase == 'slide' ) {		
			setTimeout(function(){				
				$dim.remove();
				$optionLayer.remove();
				$stage.css({'overflow':'auto'})	
				
			}, 0);
		} else {
			// $stage.off('click keydown');		
			// setTimeout(function(){			
			// 	$optionLayer.remove();
			// }, 0);			
		};
		setTimeout(function(){				
			// $select.focus();
			$this.removeAttr('data-status');	
		}, 1);				
		return;
	};

	/* Event Binding */
	$select.on({
		keydown: function(e) {
			if ( e.keyCode==27 ) {
				e.stopPropagation();
				close();
			};
		}
	});

	$optionLayer.on({ 
		click: function(e) { 
			e.stopPropagation();
		}, keydown: function(e) { 
			if ( e.keyCode==27 ) {
				e.stopPropagation();
				close();
			};
		}
	});

	$closeBtn.on({ // 닫기
		click: function(e) {
			e.stopPropagation();
			close();
		}, blur: function(e) { 	
			$optionLayer.addClass(onClass).attr('tabindex', 0).focus();		
		}
	});

	$optionBtn.on({ // 옵션선택
		click: function(e) {
			e.stopPropagation();    
			$select.val($(this).attr('data-value')).trigger('change');
			close();
			
			var $fakeSlt = $this.closest('.se-select').find('.btn-fake-slt'), 
				$fakeSltVal = $fakeSlt.find('.value');
			var sltVal = $(this).text().toString();

			$fakeSlt.focus();
			$fakeSlt.addClass('selected');
			$fakeSltVal.text( sltVal ); 
		}
	});
		
	/* Init */		
	if ( nowStatus == 'open' ) {
		close();		
	} else {
		open();
	}
}



/*
	event
*/
$(document).on('click','.se-select .btn-fake-slt', function() {
	if ( $(this).siblings('select').prop('disabled') ) return;
	customSelect( $(this).closest('.se-select').find('select') );
});



/*---------------------------------------------
	select #셀렉트
---------------------------------------------*/
/*
	function
*/
var seSelect = (function(){ 
	return {
		init : function() { // 초기화
			$('.se-select').each(function() {
				if( $(this).attr('data-stove') == 'select' ) { // 커스텀셀렉트
					if ( $(this).find('.btn-fake-slt').length != 0 ) return;
					$(this).append('<button type="button" class="se-btn btn-fake-slt"><span class="placeholder"></span><span class="value"></span></button>');

					var $select = $(this).find('select'),
						$fakeSlt = $(this).find('.btn-fake-slt'),
						$fakeSltPlaceholder = $fakeSlt.find('.placeholder'),
						$fakeSltVal = $fakeSlt.find('.value');
					
					if( $select.attr('disabled') ) {
						$fakeSlt.addClass('disabled');
					}

					$select.find('option').each(function() {
						if( $(this).attr('hidden') ) {
							$fakeSltPlaceholder.text( $(this).text() ); 
						} 
						if( $(this).attr('selected') ) {
							$fakeSlt.addClass('selected');
							$fakeSltVal.text( $(this).text() );
						} 
					});
				}
			});
		},
		errorChk : function( _target ) { // 에러감지
			var	$slt = $(_target),
				$sltWrap = $slt.closest('.se-select'),
				$fakeSlt = $sltWrap.find('.btn-fake-slt');
			
			if( $slt.hasClass('has-error') ) {
				$fakeSlt.addClass('has-error');
			} else {
				$fakeSlt.removeClass('has-error');
			}
		},
		/**
		 * 값을 자동으로 변경한 경우 헬퍼 fn
		 * @param _target : .se-select 의 특정 ID 
		 */
		valChk : function( _target ) { 
			var $seSlt = $(_target);
			var $select = $seSlt.find('select'),
				$fakeSlt = $seSlt.find('.btn-fake-slt'),
				$fakeSltVal = $fakeSlt.find('.value');
			
			if( $select.attr('disabled') || $select.prop('disabled') == true ) {
				$fakeSlt.addClass('disabled');
			} else {
				$fakeSlt.removeClass('disabled');
			}

			$select.find('option').each(function() {
				if( $(this).prop('selected') == true && $(this).prop('hidden') != true ) {
					$fakeSlt.addClass('selected');
					$fakeSltVal.text( $(this).text() );
				}  
				if( $(this).prop('selected') == true && $(this).prop('hidden') == true && $(this).index() == 0 ) {
					$fakeSlt.removeClass('selected');
					$fakeSltVal.text('');
				}
			});
		}
	}
})();


/*
	event
*/
$(document).on('change', '[data-stove="select"] select', function(){
	seSelect.errorChk( $(this) );
});

/* ==========================================================================
   Accordion (약관 동의 등)
   ========================================================================== */
var accord = (function() {
    return {
        toggle: function(element) {
            var $this = $(element);
            // data-stove="accordion" 속성을 가진 가장 가까운 부모 찾기
            var $target = $this.closest('[data-stove="accordion"]');
            
            if ($target.hasClass('on')) {
                $target.removeClass('on');
                // 접근성: 텍스트 변경 (필요시)
                $this.find('span').text('펼치기');
            } else {
                $target.addClass('on');
                $this.find('span').text('접기');
            }
        }
    }
})();

/* 이벤트 바인딩 (문서 로드 후 작동) */
$(document).on('click', '.btn-fold', function() {
    accord.toggle(this);
});


/* Checkbox All Check (약관 전체 동의) */
var chkAll = (function() {
    return {
        init: function() {
            //전체 동의 체크박스 클릭 시
            $(document).on('change', '.terms-head input[type="checkbox"]', function() {
                var isChecked = $(this).prop('checked');
                var $pack = $(this).closest('.terms-pack');
                
                //하위 체크박스들을 모두 체크/해제
                $pack.find('.terms-body input[type="checkbox"]').prop('checked', isChecked);
                
                //버튼 활성화 체크
                chkAll.checkBtn();
            });

            //하위 체크박스 개별 클릭 시
            $(document).on('change', '.terms-body input[type="checkbox"]', function() {
                var $pack = $(this).closest('.terms-pack');
                var total = $pack.find('.terms-body input[type="checkbox"]').length;
                var checked = $pack.find('.terms-body input[type="checkbox"]:checked').length;
                
                //전부 체크되었으면 전체동의도 체크, 하나라도 빠지면 해제
                if (total === checked) {
                    $pack.find('.terms-head input[type="checkbox"]').prop('checked', true);
                } else {
                    $pack.find('.terms-head input[type="checkbox"]').prop('checked', false);
                }

                //버튼 활성화 체크
                chkAll.checkBtn();
            });
        },
        
        //버튼 활성화/비활성화 로직
        checkBtn: function() {
            var totalRequired = $('.terms-body input[type="checkbox"]').length; 
            var checkedRequired = $('.terms-body input[type="checkbox"]:checked').length;
            
            var $submitBtn = $('.btn-fixed-bottom .btn-primary');

            //모든 항목이 체크되었을 때
            if (totalRequired > 0 && totalRequired === checkedRequired) {
                //<button> 태그용
                $submitBtn.prop('disabled', false); 
                //<a> 태그용 (클래스 제거)
                $submitBtn.removeClass('disabled'); 
            } else {
                //<button> 태그용
                $submitBtn.prop('disabled', true);  
                //<a> 태그용 (클래스 추가)
                $submitBtn.addClass('disabled');    
            }
        }
    }
})();

/* 문서 로드 후 초기화 실행 */
$(document).ready(function(){
    chkAll.init();
});

/* 본인인증 페이지 로직 */
var authValidation = (function() {
    return {
        init: function() {
            if ($('#btnReqAuth').length === 0) return;

            //인증번호 요청 버튼 클릭
            $('#btnReqAuth').on('click', function() {
                var phoneVal = $('#userPhone').val();
                
                //번호 길이 체크 (10자리 미만)
                if (phoneVal.length < 10) {
                    alert('휴대폰 번호를 올바르게 입력해주세요.');
                    return;
                }

                //버튼 UI 변경
                $(this).text('요청완료').addClass('disabled');
                
                // 인증번호 입력창 노출
                $('#authBox').show();
                $('#authNum').focus();

                //유효성 검사 즉시 실행
                authValidation.check();
            });

            //실시간 입력 감지
            //input, select 값이 변할 때마다 체크
            $('.PAY-AUTH-003 input, .PAY-AUTH-003 select').on('input change', function() {
                authValidation.check();
            });
        },

        //유효성 검사 및 버튼 제어 함수
        check: function() {
            var name = $('#userName').val().trim();
            var res1 = $('#resNum1').val().trim();
            var res2 = $('#resNum2').val().trim();
            var telecom = $('#telecom').val();
            var phone = $('#userPhone').val().trim();
            var authNum = $('#authNum').val().trim();
            
            //인증번호 창이 열려있는지 확인
            var isAuthOpen = $('#authBox').is(':visible');

            //gk단 버튼 (ID가 없으면 클래스로 찾음)
            var $btnNext = $('.btn-fixed-bottom .btn-primary');

            //조건 확인
            if (name.length > 0 && 
                res1.length === 6 && 
                res2.length === 7 && 
                telecom !== "" && telecom !== null && 
                phone.length >= 10 && 
                isAuthOpen && 
                authNum.length === 6 
            ) {
                $btnNext.removeClass('disabled'); 
                $btnNext.prop('disabled', false); 
            } else {
                $btnNext.addClass('disabled');
                $btnNext.prop('disabled', true);
            }
        }
    }
})();

/* 문서 로드 후 실행 */
$(document).ready(function(){
    if(typeof seSelect !== 'undefined') seSelect.init();
    if(typeof chkAll !== 'undefined') chkAll.init();
    
    authValidation.init();
});
/* 이메일 */
$(document).ready(function() {
    $('#domain-select').on('change', function() {
        var val = $(this).val();
        var $domainInput = $('.email-domain'); //오른쪽 인풋

        if (val === 'direct' || val === '') {
            $domainInput.val('');
            $domainInput.prop('disabled', false);
            $domainInput.focus();
        } else {
            $domainInput.val(val);
            $domainInput.prop('disabled', true); //오른쪽 인풋만 잠금
        }
    });
});
$(document).ready(function() {
	/* 스와이퍼 초기화 */
    window.recommendSwiper = new Swiper('.recommend-swiper', {
        loop: true,
        /* autoplay: { delay: 3000, disableOnInteraction: false }, */
        pagination: { el: '.recommend-pagination', clickable: true },
        observer: true,
        observeParents: true 
    });

    /* 탭 로직 */
    $('.tab-list li').on('click', function() {
        var idx = $(this).index();

        $(this).addClass('on').siblings().removeClass('on');

        $('.tab-content').eq(idx).addClass('on').siblings().removeClass('on');

        if (idx === 0 && window.recommendSwiper) {
            window.recommendSwiper.update(); 
        }
    });

});

$(document).ready(function() {
    //금융 캘린더 날짜 클릭 이벤트
    $('.weekly-list li').on('click', function() {

		if ($(this).hasClass('disabled')) {
            return false; 
        }
		
        $(this).addClass('on').siblings().removeClass('on');

        var targetDate = $(this).attr('data-date');
        var $targetGroup = $('.trans-group[data-date="' + targetDate + '"]');

        if ($targetGroup.length > 0) {
            //내역이 있는 경우
            $('.trans-group').removeClass('on');
            $targetGroup.addClass('on');
            $('.trans-empty').hide();
        } else {
            //내역이 없는 경우
            $('.trans-group').removeClass('on');
            $('.trans-empty').show();
        }
    });
});