import * as dat from 'dat.gui';
import FULLTILT from './fulltilt/dist/fulltilt.js';
import GyroNorm from 'gyronorm';

import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, 'http://localhost:7700/');

//screen.lockOrientation('portrait');
//lockedAllowed = window.screen.lockOrientation(orientation);

/*
var vm = new Vue({
    sockets:{
        connect: function(){
        console.log('socket connected')
        },
        customEmit: function(val){
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    methods: {
        clickButton: function(val){
            // $socket is socket.io-client instance
            this.$socket.emit('emit_method', val);

            this.$options.sockets.event_name = (data) => {
                console.log(data)
            }
        }
    }
})
*/


const gui = new dat.GUI();



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  
document.body.style = "background:"+getRandomColor();

const phoneOBJ = {
    alpha: 0,
    beta: 0,
    gamma: 0,
    x: 0,
    y: 0,
    z: 0,
    gx: 0,
    gy: 0,
    gz: 0,
    max_x: 0,
    max_y: 0,
    max_z: 0
}

var app = new Vue({
    el: '#app',
    data: {
        phoneStats: phoneOBJ,
        join: false,
        username: null,
        users: [],
        message: null,
        messages: []
    },
    methods: {
        reset: function (event) {
            app.phoneStats.max_x = 0;
            app.phoneStats.max_y = 0;
            app.phoneStats.max_z = 0;
        },
        sendPosition: function(event){
            if(event){
                this.$socket.emit('update', event);
            }
        },
        joinChat: function (username) {
            if (username) {
                this.$socket.emit('join', username);
            }
        },
        send: function (message) {
            if (message) {
                this.$socket.emit('send', message);
                //  this.$set('message', null);
                app.message = null;
            }
        }
    },
    watch: {
        messages: function () {
            setTimeout(function () {
               // $('.messages ul').scrollTop(999999999);
            }, 100)
        }
    },
    sockets: {
        users: function (users) {
            app.$set('users', users);
        },
        joined: function () {
            app.join = true;
           // this.$set('join', true);
        },
        messages: function (data) {
            console.log('messages',data);
            app.$set('messages', data);
        },
        onmessage: function (data) {
            console.log(app.messages);
            console.log('username', app.username);
            console.log('users', app.users);
            console.log('onmessage',data);          
           // app.$set(app.messages, data);
//           app.$set(messages, {'fuck': 'it'});
            this.messages.push(data);
            console.log('trace');
            console.log(app.messages);
            console.log('try messages');
           // app.messages.push(data);
        },
        adduser: function (user) {
            app.users.push(user);
        }

    }

})

loop();

function loop() {
   if(app.phoneStats.max_x > 0) { app.phoneStats.max_x -= 0.1;}
   if(app.phoneStats.max_y > 0) { app.phoneStats.max_y -= 0.1;}
   if(app.phoneStats.max_z > 0) { app.phoneStats.max_z -= 0.1;}
            
    requestAnimationFrame(loop);
}


var gn = new GyroNorm();
gn.init().then(function(){
  gn.start(function(data){

    // Process:
    // data.do.alpha	( deviceorientation event alpha value )
    // data.do.beta		( deviceorientation event beta value )
    // data.do.gamma	( deviceorientation event gamma value )
    // data.do.absolute	( deviceorientation event absolute value )

    app.phoneStats.alpha = data.do.alpha;
    app.phoneStats.beta = data.do.beta;
    app.phoneStats.gamma = data.do.gamma;

    app.phoneStats.x = data.dm.x;
    app.phoneStats.y = data.dm.y;
    app.phoneStats.z = data.dm.z;
    // data.dm.x		( devicemotion event acceleration x value )
    // data.dm.y		( devicemotion event acceleration y value )
    // data.dm.z		( devicemotion event acceleration z value )


    app.phoneStats.gx = data.dm.gx;
    app.phoneStats.gy = data.dm.gy;
    app.phoneStats.gz = data.dm.gz;


    if (app.phoneStats.x > app.phoneStats.max_x) {
        app.phoneStats.max_x = app.phoneStats.x;
    }
    if (app.phoneStats.y > app.phoneStats.max_y) {
        app.phoneStats.max_y = app.phoneStats.y;
    }
    if (app.phoneStats.z > app.phoneStats.max_z) {
        app.phoneStats.max_z = app.phoneStats.z;
    }

    // data.dm.gx		( devicemotion event accelerationIncludingGravity x value )
    // data.dm.gy		( devicemotion event accelerationIncludingGravity y value )
    // data.dm.gz		( devicemotion event accelerationIncludingGravity z value )

    // data.dm.alpha	( devicemotion event rotationRate alpha value )
    // data.dm.beta		( devicemotion event rotationRate beta value )
    // data.dm.gamma	( devicemotion event rotationRate gamma value )
  });
}).catch(function(e){
  // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
});


