// WebClient에서 WebSocket 서버로 통신을 연결하고 서버에서 온 데이터를 웹페이지에 보여줄 수 있도록 해주는 노드입니다.

// 노드 로직 순서
// 1. 서버에서 온 메시지를 웹페이지에 전달
// 2. 버튼 클릭시 호출되는 함수


const socket = io();

socket.on('disconnect', function()  {
    console.log('disconnected form server_client.');
});

// 로직 1. 서버에서 온 메시지를 웹페이지에 전달
socket.on('sendSafetyStatus', function(message) {
    console.log('sendSafetyStatus', message);
    document.querySelector('#tSafetyStatus').value = message;
});

socket.on('sendPatrolStatus', function(message) {
    console.log('sendPatrolStatus', message);
    document.querySelector('#tPatrolStatus').value = message;
});

// 로직 2. 버튼 클릭시 호출되는 함수

function btn_patrol_on() {

    console.log('btn_patrol_on');

    let data = 1;

    socket.emit('PatrolOnToServer', data);
};

function btn_patrol_off() {

    console.log('btn_patrol_off');

    let data = 0;

    socket.emit('PatrolOffToServer', data);
};

function btn_turn_left() {

    console.log('btn_left');

    let data = 1;

    socket.emit('turnleftToServer', data);
};

function btn_go_straight() {

    console.log('btn_go_straight');

    let data = 2;

    socket.emit('gostraightToServer', data);
};

function btn_turn_right() {

    console.log('btn_turn_right');

    let data = 3;

    socket.emit('turnrightToServer', data);
};
function btn_aircon_on() {

    console.log('btn_aircon_on');

    let data = 3;

    socket.emit('airconOnToServer', data);
};
function btn_aircon_off() {

    console.log('btn_aircon_off');

    let data = 3;

    socket.emit('airconOffToServer', data);
};
function btn_light1_on() {

    console.log('btn_light1_on');

    let data = 3;

    socket.emit('Light1OnToServer', data);
};
function btn_light1_off() {

    console.log('btn_light1_off');

    let data = 3;

    socket.emit('Light1OffToServer', data);
};

function btn_light2_on() {

    console.log('btn_light2_on');

    let data = 3;

    socket.emit('Light2OnToServer', data);
};
function btn_light2_off() {

    console.log('btn_light2_off');

    let data = 3;

    socket.emit('Light2OffToServer', data);
};
function modeOnToServer() {

    console.log('modeOnToServer');

    let data = '08162200';

    socket.emit('modeOnToServer', data);
};



// //앱에서 연결 해제
// function disconnect() {

//     console.log('연결해제~');
//     socket.disconnect();
// };
// //앱과 서버 연결
// function connect() {

//     console.log('연결~');
//     var option={'forceNew:':false};
//     var url='http://localhost:12001';
//     const socket = io(url,option);
//     socket.on('connect',()=>{
//         console.log("웹소켓 서버에 연결되었습니다.: "+url)
//         console.log('socket.id:' + socket.id)
//     })
// };