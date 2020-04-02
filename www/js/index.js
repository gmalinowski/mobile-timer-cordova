/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    timerId: null,
    media: null,
    visualTimer: null,

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.setSliders();
        this.setButtons();
    },
    setSliders: function () {
        document.getElementById('ss').addEventListener('input', (e) => {
            document.getElementById('s').innerText = e.target.value;
            this.saveData(e.target.value);
        }, false);
        document.getElementById('sm').addEventListener('input', e => {
            document.getElementById('m').innerText = e.target.value;
        });
        document.getElementById('sh').addEventListener('input', e => {
            document.getElementById('h').innerText = e.target.value;
            document.getElementById('shh').MaterialSlider.change(0);
        });
        document.getElementById('shh').addEventListener('input', e => {
            let h = document.getElementById('h');
            h.innerText = +e.target.value + 24;
            document.getElementById('sh').MaterialSlider.change(24);
        });
    },
    setButtons: function () {
        document.getElementById('play').addEventListener('touchend', () => {
            this.toggleTimer();
        }, false);
        document.getElementById('stop').addEventListener('touchend', () => {
            this.resetTimer();
        }, false);
    },
    resetTimer: function () {
        this.clearTimer();
        this.stopAllAlarms();
        document.getElementById('s').innerText = document.getElementById('ss').value;
        document.getElementById('m').innerText = document.getElementById('sm').value;
        document.getElementById('h').innerText = document.getElementById('sh').value;
    },
    clearTimer: function () {
        clearInterval(this.timerId);
        this.timerId = null;
        document.getElementById('play').children[0].innerText = 'play_arrow';
    },
    toggleTimer: function () {
        if (this.timerId) {
            this.clearTimer();
            this.stopAllAlarms();
        } else {
            document.getElementById('play').children[0].innerText = 'pause';
            let s = document.getElementById('s');
            let m = document.getElementById('m');
            let h = document.getElementById('h');

            this.timerId = setInterval(() => {
                let time = +s.innerText + +m.innerText * 60 + +h.innerText * 60 * 60;
                time && time--;
                h.innerText = Math.floor(time / 3600);
                m.innerText = Math.floor((time % 3600) / 60);
                s.innerText = ((time % 3600) % 60);
                if (time <= 0) {
                    this.clearTimer();
                    this.startAllAlarms();
                    return;
                }
            }, 1000);
        }
    },
    startAllAlarms: function () {
        this.vibrationAlarm();
        this.soundAlarm();
        this.visualAlarm();
    },
    stopAllAlarms: function () {
        this.stopVibrationAlarm();
        this.stopSoundAlarm();
        this.stopVisiualAlarm();
    },
    vibrationAlarm: function () {
        let vibrationPattern = [100, 50, 100, 100];
        for (let i = 0; i < 10; i++) {
            vibrationPattern.push(500);
            vibrationPattern.push(500);
        }
        navigator.vibrate(vibrationPattern);
    },
    stopVibrationAlarm: function () {
        navigator.vibrate(0);
    },
    soundAlarm: function () {
        const generateMP3Path = () => {
            let aPath = window.location.pathname;
            aPath = aPath.substr(0, aPath.length - 10)
            return "file://" + aPath + "sounds/alarm.mp3";
        };
        if (this.media) this.media.release();
        this.media = new Media(generateMP3Path(),
            () => { },
            err => { alert(err.code) },
            status => { });

        this.media.play();
        this.media.setVolume(1);
    },
    stopSoundAlarm: function () {
        this.media.release();
    },
    visualAlarm: function () {
        document.body.classList.add("blinking");
        clearTimeout(this.visualTimer);
        this.visualTimer = setTimeout(() => {
            document.body.classList.remove('blinking');
        }, 10000);
    },
    stopVisiualAlarm: function () {
        document.body.classList.remove('blinking');
    },
};

app.initialize();