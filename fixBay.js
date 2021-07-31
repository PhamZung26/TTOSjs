// ==UserScript==
// @name         TTOS_fixBay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Phạm Dũng
// @include      https://ttos.tcis.co/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// ==/UserScript==


 'use strict';

 function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}


function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var ghimmBay = document.createElement("BUTTON");
ghimmBay.setAttribute("id", "ghimBay");
ghimmBay.innerHTML = "Cố Định";
ghimmBay.setAttribute("class", "btn btn-success");
var oldElement = document.getElementById("txt-search-cont");
insertAfter(oldElement,ghimmBay);

var listOflineBay = document.getElementsByClassName("line-bay");
var fixBay = "";
ghimmBay.onclick = function(){
	if (ghimmBay.innerHTML == "Cố Định") {
		if(listOflineBay.length < 3){
			// Nếu có ít hơn 3 line-bay chứng tỏ Bay thứ 2 chưa được chọn
            ghimmBay.innerHTML = "Chưa chọn bay";
            ghimmBay.setAttribute("class", "btn btn-warning");
            sleep(2000).then(() => {
                ghimmBay.innerHTML = "Cố Định";
                ghimmBay.setAttribute("class", "btn btn-success");
            });

        }else{
        	    // Nếu không thì chứng tỏ hiển thị Bay thứ 2
        	    // Set fixBay


				//Get name of fixBay
				fixBay	= listOflineBay[2].children[0].innerHTML;
				ghimmBay.innerHTML = "Đã cố định " + fixBay;
				ghimmBay.setAttribute("class", "btn btn-primary");
            }

	} else{
		ghimmBay.innerHTML = "Cố Định";
		ghimmBay.setAttribute("class", "btn btn-success");
		fixBay = "";
	}
};


const interval_fixBay = setInterval(function() {
	if(fixBay != ""){
		var linebay = document.getElementsByClassName("line-bay"); // Danh sách bay đang hiển thị mặc định sẽ có 1 bay bị hidden
		var block_fixBay = fixBay.split("-")[0]; // Get Block ex: "A04"
		var bay_fixBay = fixBay.split("-")[1]; // Get Block ex: "A04"
		var exist = false;
		for(let k = 0; k < linebay.length; k++){
			// Duyệt nhưng bay đang hiển thị xem có bay nào là fixbay hay không
			if(linebay[k].children[0].innerHTML == fixBay){
				exist = true;
				break;
			}
		}

		if(!exist && linebay.length == 1){
			// Nếu không tồn tại fixBay và không có bay nào đang hiển thị
			// Trường hợp này chắc không xảy ra
			if(document.getElementById("blockId-selected").innerHTML != block_fixBay ){
				// Nếu block seleclted khác block của fixBay thì chọn lại
				document.getElementById(block_fixBay).click(); // select block fix
			}
			document.getElementById(fixBay).click(); // select bay
		}else if(!exist && linebay.length == 2){
			//Nếu không tồn tại fixBay và có 1 bay hiển thị
			//Đơn giản là chọn cho hiển thị bay thứ 2
			if(document.getElementById("blockId-selected").innerHTML != block_fixBay ){
				// Nếu block seleclted khác block của fixBay thì chọn lại
				document.getElementById(block_fixBay).click(); // select block fix
			}

			document.getElementById("block_" + block_fixBay + "-bay_" + bay_fixBay).click(); // select bay

            console.log("block_" + block_fixBay + "-bay_" + bay_fixBay);

		}//else if(!exist && linebay.length == 3){
			//Nếu không tồn tại fixBay và đang có 2 bay hiển thị
			// Coi như người dùng bỏ ghim Bay
			//ghimmBay.innerHTML = "Cố Định";
			//ghimmBay.setAttribute("class", "btn btn-success");
			//fixBay = "";

		//}
	}

 }, 3000);

