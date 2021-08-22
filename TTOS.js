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
var containerNo_booked = [];
var containerNo_store = [];
var currentLocation = [];
const interval_getlistBooked = setInterval(async function() {
    let rows = await fetch("https://sheets.googleapis.com/v4/spreadsheets/17JfxIWPJsNIisQFXu_lJvn_Vjb4b2oG3EeJ_3dZMk3Q/values/TonBai?key=AIzaSyCTp0GCp6TyvlU0VGfXbjaiLV-N6LECK2Y")
    .then(r => r.json())
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
}
, 30000);

var container_color = [];
var colorOfContainer = [];
const interval_getlistCustomColor =  setInterval(async function () {

    let rows = await fetch("https://sheets.googleapis.com/v4/spreadsheets/1yzxWwqqOsPINsbWLCMOZYt2cGNddXnfaqgqZqk4TgkE/values/XuatTau?key=AIzaSyCTp0GCp6TyvlU0VGfXbjaiLV-N6LECK2Y")
    .then(r => r.json())
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
  }, 30000);

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    document.getElementById("txt-search-cont").setAttribute("type", "number"); // Gửi lệnh này ở đây để set Type của textbox tìm kiếm là số


    listContAtBay = document.getElementsByClassName("cell-yard cell-container");


    for (let i = 0; i < listContAtBay.length; i += 1) {
        containerNo = listContAtBay[i].children[1].innerHTML;
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

