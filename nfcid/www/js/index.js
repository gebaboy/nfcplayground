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
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.getElementById('touchable').addEventListener('touchstart', hello, false);
        document.getElementById('touchable').addEventListener('touchend', bye, false);
	window.addEventListener("batterystatus", displayBatteryStatus, false);
	nfc.addTagDiscoveredListener(nfcTagDetected, 
				     function() {console.log("NFC listener up.");},
	 			     function() {console.log("NFC listener error.");}
	 			    );

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var nfclistmap = new Object();
var nfclastactive;

function hello() { 
    this.classList.add('zigzag');
    this.innerHTML = "Squeeezed!";
    console.log('Squeezed.');
}
	  
function bye() {
    this.classList.remove('zigzag');
    this.innerHTML = "Much better!";
}

function displayBatteryStatus(info) {
    var parentElement = document.getElementById('deviceready');
    parentElement.innerHTML = 'Battery is now at ' + info.level + '%';
}

function nfcTagDetected(nfcEvent) {
    var domparent = document.getElementById('nfclist');

    var idreceived = nfc.bytesToHexString(nfcEvent.tag.id);

    //if got the first time
    if(typeof nfclistmap[idreceived] == "undefined"){
	console.log("newnfc");
	var docfrag = document.createDocumentFragment();
	var para=document.createElement("P");
	var t=document.createTextNode(nfc.bytesToHexString(nfcEvent.tag.id));
	
	para.classList.add('event');
	para.classList.add('received');
	para.setAttribute('style', 'display:block;');

	para.appendChild(t);
	docfrag.appendChild(para);
	domparent.appendChild(docfrag);

	nfclistmap[idreceived] = para;
	if(typeof nfclastactive != "undefined"){
	    nfclastactive.classList.remove('received');
	    nfclastactive.classList.add('listening');
	}
	nfclastactive = para;
    }
    else {
	console.log("oldnfc");
	if (nfclistmap[idreceived] != nfclastactive) {
	    nfclastactive.classList.remove('received');
	    nfclastactive.classList.add('listening');

	    nfclastactive = nfclistmap[idreceived];
	    nfclastactive.classList.remove('listening');
	    nfclastactive.classList.add('received');
	    nfclastactive.setAttribute('style', 'display:block;');   
	}
    }


    //alert(ndef.bytesToHexString(tag.id));
    //alert("Nfc working!");
    console.log('Read NFC card');
    console.log(nfcEvent.tag.id);
    console.log(nfc.bytesToHexString(nfcEvent.tag.id));
}