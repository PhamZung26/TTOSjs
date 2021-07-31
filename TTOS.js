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
console.log(containerNo_booked);

(async () => {
    var response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRjJHPVrQ17-TI1ayu7AQLNoPW8PeegAb9vv7b4qvzPuK1IPtcSqFVK29CxojeeF_WpgFUNSH5vKX1T/pubhtml');
    switch (response.status) {
        // status "OK"
        case 200:
            var template = await response.text();


            var htmlObject = document.createElement('div');
            htmlObject.innerHTML = template;
            //htmlObject.getElementById("myDiv").style.marginTop = "10px";

            var containerBooked = htmlObject.getElementsByTagName("td");

            for (let i = 0; i < containerBooked.length; i += 1) {
                containerNo_booked[i] = containerBooked[i].children[0].innerHTML;
            }

            htmlObject.remove();
            console.log(containerBooked);
            break;
        // status "Not Found"
        case 404:
            console.log('Not Found');
            break;
    }
})();





const interval = setInterval(function() {

    var listContAtBay, listMethodAtList, listContAtList, containerNo;


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
    }
 }, 3000);

