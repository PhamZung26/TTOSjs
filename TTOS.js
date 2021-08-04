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
const interval_getlistBooked = setInterval(function() {
(async () => {
    fetch("https://spreadsheets.google.com/feeds/list/17JfxIWPJsNIisQFXu_lJvn_Vjb4b2oG3EeJ_3dZMk3Q/1/public/values?alt=json")
  .then(res => res.json())
  .then(json => {
     /* this array will eventually be populated with the contents of the spreadsheet's rows */
      const data = [];
      containerNo_booked = [];
    const rows = json.feed.entry;

    for(const row of rows) {
      const formattedRow = {};

      for(const key in row) {
        if(key.startsWith("gsx$")) {

          /* The actual row names from your spreadsheet
           * are formatted like "gsx$title".
           * Therefore, we need to find keys in this object
           * that start with "gsx$", and then strip that
           * out to get the actual row name
           */

          formattedRow[key.replace("gsx$", "")] = row[key].$t;

        }
      }

      data.push(formattedRow);
    }

      var tieude = Object.getOwnPropertyNames(data[0])[0];
      var isbooked = Object.getOwnPropertyNames(data[0])[16];
      var m = 0;
    for(let n =0; n<data.length; n++){
        if (data[n][isbooked] != "") {
            containerNo_booked[m] = data[n][tieude];
            m++;
        }
    }
    console.log(containerNo_booked);
  })
})();
}, 15000);

var container_color = [];
var colorOfContainer = [];
const interval_getlistCustomColor = setInterval(function () {
    (async () => {
        fetch("https://spreadsheets.google.com/feeds/list/1yzxWwqqOsPINsbWLCMOZYt2cGNddXnfaqgqZqk4TgkE/1/public/values?alt=json")
            .then(res => res.json())
            .then(json => {
                /* this array will eventually be populated with the contents of the spreadsheet's rows */
                const data = [];
                container_color = [];
                colorOfContainer = [];
                const rows = json.feed.entry;

                for (const row of rows) {
                    const formattedRow = {};

                    for (const key in row) {
                        if (key.startsWith("gsx$")) {

                            /* The actual row names from your spreadsheet
                             * are formatted like "gsx$title".
                             * Therefore, we need to find keys in this object
                             * that start with "gsx$", and then strip that
                             * out to get the actual row name
                             */

                            formattedRow[key.replace("gsx$", "")] = row[key].$t;

                        }
                    }

                    data.push(formattedRow);
                }

                var colorHex = Object.getOwnPropertyNames(data[0])[0];
                var containerUserCustumColor = Object.getOwnPropertyNames(data[0])[2];
                for (let n = 0; n < data.length; n++) {
                    container_color[n] = data[n][containerUserCustumColor];
                    colorOfContainer[n] = data[n][colorHex];
                }
                console.log(colorOfContainer);
                console.log(container_color);
            })
    })();
}, 15000);





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
                console.log(containerNo);
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
	                            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "#fce5cd";
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

