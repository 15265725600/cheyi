//页面地址前缀
function preUrl(path){
    var fUrl = 'http://localhost:8080/hm_chen/hm_cy/';
    return fUrl + path;
}

/*
*  获取地址栏中的参数
*   GetQueryString('参数名1')
*   GetQueryString('参数名2')
*/
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//ajax 传参url
function reqUrl(path){
    var frontUrl = 'http://localhost:8080/hmapi_cheyi/v100/';
    var key = 'cb08bd3a57be55c375040ec59f343e8e';
    var myDate = new Date();
    var regTime = myDate.getMilliseconds() ;
 
    var hash = hex_md5(key+'|'+regTime+'|'+path);
    return frontUrl + path + '?datetime='+regTime+'&sign='+hash;
}

//设置cookie
function setCookie(name,cvalue,exdays){
    var exp = new Date();
    exp.setTime(exp.getTime()+(exdays*24*60*60*1000));
    document.cookie = name + "=" + escape(cvalue) + "; expires=" + exp.toGMTString() + ";path=/";
}

//获取cookie
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;
}

//保存永久数据
function setInfo(k,v){
    window.localStorage.setItem(k,v);
}
//读取永久数据
function getInfo(k){
    return window.localStorage.getItem(k);
}
//删除永久数据
function removeInfo(k){
    window.localStorage.removeItem(k);
}
//全部删除永久数据
function removeAllInfo(){
    window.localStorage.clear();
}


/** picker底部滑动选择数据（一列，两列）
*   arr: 数据
*   nameEl: 点击对象
*   valEl: 保存所选值
*   oper: 区分 value 和 innerHTMl
*   title: 顶部标题
*/

function pickerShow(arr, nameEl, valEl, oper, title){
    var picker = new Picker({
        data: arr,
        selectedIndex: [0,1],
        title: title
    });

    picker.on('picker.select', function (selectedVal, selectedIndex) {
        valEl.innerHTML = '';

        for(var i=0; i<arr.length; i++){
            if(oper === 0){
                valEl.value += arr[i][selectedIndex[i]].text;
            }else{
                valEl.innerHTML += arr[i][selectedIndex[i]].text;
            }   
        }
    });

    nameEl.addEventListener('click', function () {
        picker.show();
        console.log('ok');
    });
}


// 遮罩

function mask(text){
    $('.layer').remove();
    var content = '<div class="layer"> '+ text +'</div>'
    $('body').append(content);

    var w = $('.layer').width() + 40;
    var win = $(window).width();

    $('.layer').css('left', (win-w)/2 + 'px');
    $('.layer').fadeIn();
    setTimeout(function(){
        $('.layer').fadeOut();
        $('.layer').remove();
    }, 2000);
}




//切换城市
//列表中每个字母相对于顶部的距离
function alphaArr(){
    var arr=[];
    $('.am-popup-inner').find('p').each(function(){
      arr.push($(this).offset().top-49);
    });
    return arr;
}

//点击右侧字母移动到相应位置
function alphaList(){
    console.log('ok');
   $('.alpha-list').on('click','a',function(){
      var data = ($(this).attr('data'));

      var groupElement = $('.index-'+data);
      console.log(groupElement);
      if (groupElement.length>0) {
          $('.am-popup-inner').scrollTop(0);
          var oheight = groupElement.offset().top-49;
          var innerHeight = $('.am-popup-inner').scrollTop();
          console.log(innerHeight);
          console.log(oheight);
          var height = oheight  - innerHeight;//滚动的距离 = 初始化时到顶部距离减去当前到顶部的距离
          $('.am-popup-inner').stop().animate({scrollTop: '+=' + height + 'px'});
      }else{
           return;
      }
   });
}

//操作商品数量
function countOper(type,obj){       
    switch(type){
        case '-':
            var num = parseInt($(obj).next().html());
            if(num > 1){
                num--;
            }
            $(obj).next().html(num);
            break;
        case '+':
            var num = parseInt($(obj).prev().html());
            num++;
            $(obj).prev().html(num);
            break;
        default:
            break;
    }
}




// @param {string} img 图片的base64
// @param {int} dir exif获取的方向信息
// @param {function} next 回调方法，返回校正方向后的base64
function getImgData(img,dir,next){
    var image=new Image();
    image.onload=function(){
        var degree=0,drawWidth,drawHeight,width,height;
        drawWidth=this.naturalWidth;
        drawHeight=this.naturalHeight;
        //以下改变一下图片大小
        var maxSide = Math.max(drawWidth, drawHeight);
        if (maxSide > 1024) {
            var minSide = Math.min(drawWidth, drawHeight);
            minSide = minSide / maxSide * 1024;
            maxSide = 1024;
            if (drawWidth > drawHeight) {
                drawWidth = maxSide;
                drawHeight = minSide;
            } else {
                drawWidth = minSide;
                drawHeight = maxSide;
            }
        }
        var canvas=document.createElement('canvas');
        canvas.width=width=drawWidth;
        canvas.height=height=drawHeight;
        var context=canvas.getContext('2d');
        //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
        switch(dir){
            //iphone横屏拍摄，此时home键在左侧
            case 3:
                degree=180;
                drawWidth=-width;
                drawHeight=-height;
                break;
            //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
            case 6:
                canvas.width=height;
                canvas.height=width;
                degree=90;
                drawWidth=width;
                drawHeight=-height;
                break;
            //iphone竖屏拍摄，此时home键在上方
            case 8:
                canvas.width=height;
                canvas.height=width;
                degree=270;
                drawWidth=-width;
                drawHeight=height;
                break;
        }
        //使用canvas旋转校正
        context.rotate(degree*Math.PI/180);
        context.drawImage(this,0,0,drawWidth,drawHeight);
        //返回校正图片
        next(canvas.toDataURL("image/jpeg",.8));
    }
    image.src=img;
}

