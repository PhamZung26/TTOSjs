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
 var sf = "https://docs.google.com/spreadsheets/d/17JfxIWPJsNIisQFXu_lJvn_Vjb4b2oG3EeJ_3dZMk3Q/gviz/tq?tqx=out:json";
$.ajax({url: sf, type: 'GET', dataType: 'text'})
.done(function(data) {
  const r = data.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);

  if (r && r.length == 2) {
    const obj = JSON.parse(r[1]);
    const table = obj.table;
    const header = table.cols.map(({label}) => label);
    const rows = table.rows.map(({c}) => c);
      containerNo_booked = [];
      for(const row of rows){
          if(row[16] != null){
              containerNo_booked.push(row[0].v);
          }
      }

 // console.log(containerNo_booked );

  }
})
.fail((e) => console.log(e.status));


}, 15000);

var container_color = [];
var colorOfContainer = [];
const interval_getlistCustomColor = setInterval(function () {
    var sf = "https://docs.google.com/spreadsheets/d/1yzxWwqqOsPINsbWLCMOZYt2cGNddXnfaqgqZqk4TgkE/gviz/tq?tqx=out:json";
$.ajax({url: sf, type: 'GET', dataType: 'text'})
.done(function(data) {
  const r = data.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);

  if (r && r.length == 2) {
    const obj = JSON.parse(r[1]);
    const table = obj.table;
    //console.log(table );
    const header = table.cols.map(({label}) => label);

    const rows = table.rows.map(({c}) => c);
//console.log(rows );
  //const socont = 	rows.map(({v}) => v[2]);
    //console.log(socont );


   // console.log(table.rows[0].c[0].v);
    container_color = [];
    colorOfContainer = [];
      for(const row of rows){
          //console.log(row[0].v);
          if(row[2] == null){
              container_color.push("");
          } else{
              container_color.push(row[2].v);
}

          if(row[0] == null){
              colorOfContainer.push("");
          } else{
              colorOfContainer.push(row[0].v);
          }


}
  //console.log(container_color );
  //console.log(colorOfContainer );
  }
})
.fail((e) => console.log(e.status));

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

