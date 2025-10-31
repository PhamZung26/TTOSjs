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
var pod = [];
var vessel = [];
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
    pod = [];
    vessel = [];
    for(const row of rows.values){

        containerNo_store.push(row[0]);
        currentLocation.push(row[2]);
        pod.push(row[34]);

        vessel.push(row[21]);

        if(row[18] != ""){
            containerNo_booked.push(row[0]);
        }
      }
      //console.log(vessel);
      //console.log(pod);

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
    listContAtBay = document.getElementsByClassName("cell-yard cell-container");
    var listContForBreakLine = document.getElementsByClassName("container-no");

    for (let i=0; i<listContForBreakLine.length; i++){
        if(listContForBreakLine[i].innerHTML.length == 11){
             listContForBreakLine[i].innerHTML = "<div style='text-align: left'>" + listContForBreakLine[i].innerHTML.substring(0,4) + "</div>" +"<br>" + "<div style='text-align: right'>" + listContForBreakLine[i].innerHTML.substring(4,11) + "</div>";

            }
    }







    for (let i = 0; i < listContAtBay.length; i += 1) {
        containerNo = listContAtBay[i].getAttribute("item-no");
        let podOfCont = "";
        let vesselOfCont = "";
        // Get index of ContainerNo in store
        let indexOfCont = containerNo_store.indexOf(containerNo);
        if(indexOfCont != -1){
            podOfCont = pod[indexOfCont].substring(2,5);
            console.log(pod[indexOfCont]);
            vesselOfCont = vessel[indexOfCont];
        }
        console.log(indexOfCont);
        if(typeof(listContAtBay[i].children[2]) != "undefined"){
            if(!listContAtBay[i].children[2].innerHTML.includes(podOfCont)){
                listContAtBay[i].children[2].style.fontSize = "10px";
                listContAtBay[i].children[2].innerHTML = listContAtBay[i].children[2].innerHTML + " - " + podOfCont;
            }

            if(!listContAtBay[i].innerHTML.includes(vesselOfCont)){
                listContAtBay[i].innerHTML = listContAtBay[i].innerHTML + "<span style='font-size:10px;'>" + vesselOfCont + "</span>";
            }

        }



        if(containerNo_booked.includes(containerNo)){
            document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "#ffcc99";
        }
        listMethodAtList = document.getElementsByClassName("chat-list-item-photo");
        listContAtList = document.getElementsByClassName("wi-item workinstruction");
        for(let j=0; j<listContAtList.length; j += 1){
            if (containerNo == listContAtList[j].getAttribute("item-no")) {
                console.log(containerNo);
                var action = listContAtList[j].getAttribute("action");
                var wqtype = listContAtList[j].getAttribute("wqtype");
                if(wqtype == "GATE"){
                    // Lệnh qua cổng
                    document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "yellow";
                }else if(wqtype == "YARDCONSOL"){
                    // Lệnh đảo chuyển
                    document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "green";
                }else if(wqtype == "VESSEL"){
                    if(action == "PICKUP"){
                        // Lệnh xuất tàu
                        document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "#ff00ea";
                    }else{
                        // Lệnh nhập tàu
                        document.getElementsByClassName("cell-yard cell-container")[i].style.backgroundColor = "red";
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

var thongbao = document.createElement("span");
 thongbao.setAttribute("id","thongbao");
 var div = document.createElement("div");
 div.style.position = 'relative';
 div.style.display = 'block';
 var oldElement1 = document.getElementById("bat-selected");
 var chatlist = document.getElementById("wi-selected-id");
 document.getElementById("wi-selected-panel").style.height = '150px'
 //oldElement1.parentNode.parentNode.appendChild(div);
 //div.appendChild(thongbao);
 insertAfter(oldElement1,thongbao);
 thongbao.innerHTML = "";
 thongbao.style.marginInlineStart = "10px";
 thongbao.style.fontSize = "1.6rem";
 thongbao.style.color = 'white';

// Dùng Set thay vì mảng để tra cứu nhanh hơn O(1)
const danhSachTinhtrangVSCont = new Set();

/**
 * 🧩 Thêm một container mới vào danh sách (tối đa 100 phần tử)
 * @param {string} moiThanhVien - Chuỗi mô tả tình trạng (vd: "CAIU9981692 đã VS")
 */
function themThanhVien(moiThanhVien) {
    // Nếu đã tồn tại thì bỏ qua
    if (danhSachTinhtrangVSCont.has(moiThanhVien)) return;

    // Nếu vượt quá 100 phần tử → xóa phần tử cũ nhất
    if (danhSachTinhtrangVSCont.size >= 100) {
        const firstItem = danhSachTinhtrangVSCont.values().next().value;
        danhSachTinhtrangVSCont.delete(firstItem);
    }

    // Thêm mới
    danhSachTinhtrangVSCont.add(moiThanhVien);
    console.log(`🟢 Thêm: ${moiThanhVien} (${danhSachTinhtrangVSCont.size}/100)`);
}

/**
 * 🔍 Kiểm tra xem container đã có trong danh sách chưa
 * @param {string} tenThanhVien - Chuỗi cần kiểm tra
 * @returns {boolean} - true nếu đã tồn tại
 */
function kiemTraThanhVien(tenThanhVien) {
    return danhSachTinhtrangVSCont.has(tenThanhVien);
}


 const CheckClean = setInterval(async function () {
    const containerNo = document.getElementById("item-no-selected").innerHTML.trim();
    const iso = document.getElementById("item-iso-selected").innerHTML.trim();
    const plan = document.getElementById("planloc-selected").innerHTML.trim();
    const thongbao = document.getElementById("thongbao");
    console.log("Số cont đang kiểm tra: ", containerNo);
    // Chỉ xử lý khi điều kiện phù hợp
    if (iso.includes("E") && plan.includes("Y")) {
        try {
            console.log("Gửi request đến API mới...");
            var myHeaders = new Headers();
            myHeaders.append("Cookie", ".AspNetCore.Antiforgery.KK6xcoXdd8M=CfDJ8OsZ6q8EGv1Jg7DR69NjOiKedywNvHi1hVxTsz4P3_Uz7PTPgtKUSZJycxKFufe08AA9ZN70H4kmc9RcVzosFnVssGBZ8ukkvAuCqdQINtXYjymdJ-dHyWkmOV7RsgCKDUklQTbFts5vnYU_MkJ2OcI");

            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };
            const response = await fetch(`https://tc128hp.hopto.org/api/container/GetInFor?ContainerNo=${containerNo}`,requestOptions);
            if (!response.ok) throw new Error("Không thể kết nối API");

            const data = await response.json();
            console.log("Kết quả:", data);

            // Giải thích logic:
            // - isDirty = true => container cần vệ sinh
            // - isCleaned = true => container đã được vệ sinh
            // - grade: có thể dùng để xác định chất lượng

            if (data.isCleaned) {
                hienThongBao(thongbao, containerNo, "đã VS", "success", data.grade);
                if (!kiemTraThanhVien(containerNo + " đã VS")) {
                    themThanhVien(containerNo + " đã VS");
                }
            }
            else if (data.isDirty) {
                hienThongBao(thongbao, containerNo, "chưa VS", "error", data.grade);
            }
            else {
                hienThongBao(thongbao, containerNo, "không VS", "info", data.grade);
                if (!kiemTraThanhVien(containerNo + " không VS")) {
                    themThanhVien(containerNo + " không VS");
                }
            }

        }
        catch (error) {
            console.error("Lỗi:", error);
            hienThongBao(thongbao, containerNo, "Lỗi kết nối API", "warning");
        }

    } else {
        thongbao.innerHTML = "";
        thongbao.style.backgroundColor = "white";
    }

}, 3000);

function hienThongBao(element, containerNo, text, type, grade = "") {
    Object.assign(element.style, {
        position: "relative",
        zIndex: "9999",
        padding: "10px 18px",
        borderRadius: "12px",
        fontWeight: "600",
        color: "white",
        display: "inline-block",
        transition: "all 0.3s ease",
        boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
        fontSize: "15px",
        textAlign: "center",
        minWidth: "220px",
        marginTop: "6px",
        marginBottom: "20px",
        opacity: "0.97",
        border: "1px solid rgba(255,255,255,0.2)",
        backgroundClip: "padding-box",
        overflow: "visible"
    });

    const gradePart = grade
        ? `<span style="background:rgba(255,255,255,0.15);padding:2px 6px;border-radius:8px;margin-left:6px;">${grade}</span>`
        : "";

    const isDangerGrade = /^D/i.test(grade);

    if (isDangerGrade) {
        element.style.background = "linear-gradient(90deg, #ff5252, #b71c1c)";
        element.style.animation = "blinkRed 1s infinite alternate";
        element.innerHTML = `⚠️ ${containerNo} ${text} - Cảnh báo chất lượng ${gradePart}`;
    } else {
        element.style.animation = "none";
        switch (type) {
            case "success":
                element.style.background = "linear-gradient(90deg, #43a047, #2e7d32)";
                element.innerHTML = `✅ ${containerNo} đã VS ${gradePart}`;
                break;
            case "error":
                element.style.background = "linear-gradient(90deg, #e53935, #c62828)";
                element.innerHTML = `❌ ${containerNo} chưa VS ${gradePart}`;
                break;
            case "info":
                element.style.background = "linear-gradient(90deg, #1e88e5, #1565c0)";
                element.innerHTML = `ℹ️ ${containerNo} không VS ${gradePart}`;
                break;
            case "warning": // ⚠️ thêm kiểu cảnh báo lỗi API
                element.style.background = "linear-gradient(90deg, #f9a825, #f57f17)";
                element.style.animation = "blinkYellow 1.2s infinite alternate";
                element.innerHTML = `⚠️ ${text}`;
                break;
            default:
                element.innerHTML = "";
                element.style.background = "transparent";
                break;
        }
    }

    // Thêm hiệu ứng cảnh báo nếu chưa có
    if (!document.getElementById("blinkRedStyle")) {
        const style = document.createElement("style");
        style.id = "blinkRedStyle";
        style.innerHTML = `
            @keyframes blinkRed {
                0% { box-shadow: 0 0 10px rgba(255,0,0,0.3); }
                100% { box-shadow: 0 0 25px rgba(255,0,0,0.8); }
            }
            @keyframes blinkYellow {
                0% { box-shadow: 0 0 8px rgba(255,193,7,0.4); }
                100% { box-shadow: 0 0 20px rgba(255,193,7,0.9); }
            }
        `;
        document.head.appendChild(style);
    }
}
