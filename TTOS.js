// ==UserScript==
// @name         TTOS_highlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Phạm Dũng
// @include      https://ttos.tcis.co/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// ==/UserScript==


'use strict';
document.getElementById("txt-search-cont").setAttribute("type", "number"); // Gửi lệnh này ở đây để set Type của textbox tìm kiếm là số
document.getElementById("search-workinstruction").setAttribute("type", "number"); // Gửi lệnh này ở đây để set Type của textbox tìm kiếm là số
var containerNo_booked = [];
var containerNo_store = [];
var currentLocation = [];
const interval_getlistBooked = new timer();
interval_getlistBooked.start(async function() {
    let rows = await fetch("https://sheets.googleapis.com/v4/spreadsheets/17JfxIWPJsNIisQFXu_lJvn_Vjb4b2oG3EeJ_3dZMk3Q/values/TonBai?key=AIzaSyCTp0GCp6TyvlU0VGfXbjaiLV-N6LECK2Y")
    .then( r => r.json())
    if (containerNo_store.length > 1){
    	interval_getlistBooked.set_interval(900000);
    	// nếu có dữ liệu rồi thì 15 phút mới lấy dữ liệu 1 lần
    }else{
    	interval_getlistBooked.set_interval(1000);
    }
    containerNo_booked = [];
    containerNo_store = [];
    currentLocation = [];
    for(const row of rows.values){

        containerNo_store.push(row[0]);
        currentLocation.push(row[2]);
        if(row[16] != ""){
            containerNo_booked.push(row[0]);
        }
      }
      console.log(new Date());
      console.log(containerNo_store);

}
, 1000, true);




var container_color = [];
var colorOfContainer = [];

const interval_getlistCustomColor = new timer();
interval_getlistCustomColor.start(
	async function () {

    let rows = await fetch("https://sheets.googleapis.com/v4/spreadsheets/1yzxWwqqOsPINsbWLCMOZYt2cGNddXnfaqgqZqk4TgkE/values/XuatTau?key=AIzaSyCTp0GCp6TyvlU0VGfXbjaiLV-N6LECK2Y")
    .then(r => r.json())

    if (container_color.length > 1){
    	interval_getlistCustomColor.set_interval(15000);
    	// nếu có dữ liệu rồi thì 15 s mới lấy dữ liệu 1 lần
    }else{
    	interval_getlistCustomColor.set_interval(1000);
    }
    container_color = [];
    colorOfContainer = [];
      for(const row of rows.values){

          if(row[2] == null){
              container_color.push("");
          } else{
              container_color.push(row[2]);
        }

          if(row[0] == null){
              colorOfContainer.push("");
          } else{
              colorOfContainer.push(row[0]);
          }
        }
      console.log(new Date());
      console.log(container_color);
  }, 1000, true);

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


function timer()
{
var timer = {
    running: false,
    iv: 5000,
    timeout: false,
    cb : function(){},
    start : function(cb,iv,sd){
        var elm = this;
        clearInterval(this.timeout);
        this.running = true;
        if(cb) this.cb = cb;
        if(iv) this.iv = iv;
        if(sd) elm.execute(elm);
        this.timeout = setTimeout(function(){elm.execute(elm)}, this.iv);
    },
    execute : function(e){
        if(!e.running) return false;
        e.cb();
        e.start();
    },
    stop : function(){
        this.running = false;
    },
    set_interval : function(iv){
        clearInterval(this.timeout);
        this.start(false, iv);
    }
};
return timer;
}
  var searchCont = document.createElement("BUTTON");
  searchCont.setAttribute("id", "searchCont");
  searchCont.innerHTML = "Tìm cont";
  searchCont.setAttribute("class", "btn btn-primary");

  var oldElement = document.getElementById("txt-search-cont");
  insertAfter(oldElement,searchCont);

  searchCont.onclick = function(){
      let textOfSearch = document.getElementById("txt-search-cont").value;

      let resultSearch = [];
      for(let i=0; i < containerNo_store.length; i++){

          if(containerNo_store[i].substr(containerNo_store[i].length - textOfSearch.length) == textOfSearch){
              resultSearch.push(currentLocation[i]);
          }
      }
      if(resultSearch.length == 0 ){
          searchCont.innerHTML = "Không tìm thấy";
          sleep(2000).then(() => {
              searchCont.innerHTML = "Tìm cont";
          });
      }
      else if(resultSearch.length > 1){
          searchCont.innerHTML = "Nhập chi tiết hơn";
          sleep(2000).then(() => {
              searchCont.innerHTML = "Tìm cont";
          });
      }else{
          searchCont.innerHTML = resultSearch[0];
          sleep(15000).then(() => {
              searchCont.innerHTML = "Tìm cont";
          });

      }

  }



const interval = setInterval(function() {

    var listContAtBay, listMethodAtList, listContAtList, containerNo;
    var listContForBreakLine = document.getElementsByClassName("container-no");
    for (let i=0; i<listContForBreakLine.length; i++){
        if(listContForBreakLine[i].innerHTML.length == 11){
             listContForBreakLine[i].innerHTML = "<div style='text-align: left; font-size: 15px;'>" + listContForBreakLine[i].innerHTML.substring(0,4) + "</div>" +"<br>" + "<div style='text-align: right; font-size: 15px;'>" + listContForBreakLine[i].innerHTML.substring(4,11) + "</div>";
        }
    }




    listContAtBay = document.getElementsByClassName("cell-yard cell-container");


    for (let i = 0; i < listContAtBay.length; i += 1) {
        containerNo = listContAtBay[i].getAttribute("item-no");
        if(containerNo_booked.includes(containerNo)){
            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "#ffcc99";
        }
        listMethodAtList = document.getElementsByClassName("chat-list-item-photo");
        listContAtList = document.getElementsByClassName("chat-list-item-header");
        for(let j=0; j<listContAtList.length; j += 1){
            if (containerNo == listContAtList[j].children[0].children[0].children[0].innerHTML) {
                //console.log(containerNo);
                for(let k=0; k<5; k +=1){
                    if(listMethodAtList[j].children[k].className == ""){
                        //Neu Class của method at list là "" thì đó là index của phương án đó
                        // k = 0 là lệnh qua cổng
                        // k = 1 là lệnh yard đảo chuyển
                        // k = 2 là lệnh xuất tàu
                        // k = 3 là lệnh nhập tầu
                        // k = 4 là lệnh depot
                        //console.log(containerNo);
                        //console.log(k);
	                    switch(k) {
	                        case 0:
	                            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "yellow";
	                            break;
	                        case 1:
	                            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "green";
	                            break;
	                        case 2:
	                            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "#ff00ea";
	                            break;
	                        case 3:
	                            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "red";
	                            break;
	                        case 4:
	                            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "lightblue";
	                            break;
	                        default:
	                            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "black";
	                    }
                   break;
                    }


                }
            }
        }
        if (container_color.indexOf(containerNo) != -1) {
            // Nếu containerNo tồn tại trong list người dùng custom thì tô màu theo ý người dùng
            if (colorOfContainer[container_color.indexOf(containerNo)] != "#ffffff") {
                // Nếu người dùng tô màu trắng thì không tô lại, để màu mặc định của TTOS
                document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = colorOfContainer[container_color.indexOf(containerNo)];
            }

        }

    }
 }, 3000);

