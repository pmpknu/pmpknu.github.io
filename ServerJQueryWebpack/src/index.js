import _ from 'lodash';
import * as $ from 'jquery';
import { io, Socket } from "socket.io-client"

let socket;
let chat_name = '';

function sendMsg() {
    let msg = { username: document.getElementById("input_name").value, message: document.getElementById("input_msg").value };

    if (msg.message.trim() != '' && msg.username != '') {
        socket.emit('smsg', msg);
        document.getElementById("input_msg").value = '';
        setCookie('name', document.getElementById('input_name').value);
    }
}

function enterKeySendForm(e) {
    if (e.keyCode == 13) {
        sendMsg();
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

/*
function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function onLoad() {
    socket = io();
    document.getElementById('input_name').value = chat_name = getCookie('name');
}
*/

function onLoad() {
    $("body").empty();
    $("body").append("<div class='cont'></div>");
    $(".cont").append("<p id='header'>chat</p>");
    $(".cont").append("<div id='text_box_scroll'></div>");
    $("#text_box_scroll").append("<p id='text_box'></p>");
    $(".cont").append("<div id='inputs'></div>");
    $("#inputs").append("<input id='input_name' placeholder='nickname' maxlength='30'>");
    $("#inputs").append("<input id='input_msg' placeholder='message' maxlength='1024'>");
    $("#inputs").append("<input id='send_msg_bttn' type='button' value='Send'>");

    $("#send_msg_bttn").on('click', () => { sendMsg(); });
    $("#input_msg").on("keypress", (event) => { enterKeySendForm(event); });

    socket = io();

    socket.on('lmsg', (msgs_string) => {
        let msgs = JSON.parse(msgs_string);

        $("text_box").empty();

        for (el of msgs)
            $("text_box").append(`<div class="new_msg"><a class="el_username">${el.username}</a> ${el.message}</div><br>`);
    });

    socket.on('gmsg', (msg_string) => {
        let msg = JSON.parse(msg_string);

        $("text_box").append(`<div class="new_msg"><a class="el_username">${msg.username}</a> ${msg.message}</div><br>`);
    });

    document.getElementById('input_name').value = chat_name = getCookie('name');
}

$(onLoad)