'use strict';
let printE = str =>{
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		chrome.tabs.executeScript(tabs[0].id, {code: `console.log(\`${str}\`)`});
	});
}

window.onload = async () =>{
	chrome.tabs.query({active: true, currentWindow: true}, async tabs => {
		let ret1 =  await new Promise(async (resolve, reject) => { 
			chrome.tabs.executeScript(tabs[0].id, {code: `document.querySelector("#statusElement") != null;`}, el =>{
				if (typeof el[0] === "boolean"){
					if(!el[0]){
						chrome.tabs.executeScript(tabs[0].id, {code: `
							try {
								var local = document.querySelector('#app');
							} catch(e) {
								local = document.querySelector('#app');
							}
							try {
								var statusElement = document.createElement('DIV');
							} catch(e) {
								statusElement = document.createElement('DIV');
							}
							statusElement.setAttribute('id', "statusElement");
							statusElement.setAttribute('style', "margin-left: 230px; position: absolute; z-index: 999; border: 1px solid red; visibility: hidden;");
							statusElement.innerText = "Stopped";
							local.insertBefore(statusElement, local.childNodes[0]);`
						}, async ()=>{
							setTimeout(()=>{
								resolve(true);
							},2000);
						});
					}else{
						resolve(true);
					}
				}else{
					resolve(false);
				}
			});
		});
		let ret2 = await new Promise(async (resolve, reject) => { 
			chrome.tabs.executeScript(tabs[0].id, {code: `document.querySelector("#statusPause") != null;`}, el =>{
				if (typeof el[0] === "boolean"){
					if(!el[0]){
						chrome.tabs.executeScript(tabs[0].id, {code: `
							try {
								var local = document.querySelector('#app');
							} catch(e) {
								local = document.querySelector('#app');
							}

							try {
								var statusElement = document.createElement('DIV');
							} catch(e) {
								statusElement = document.createElement('DIV');
							}
							statusElement.setAttribute('id', "statusPause");
							statusElement.setAttribute('style', "margin-left: 310px; position: absolute; z-index: 999; border: 1px solid red; visibility: hidden;");
							statusElement.innerText = "Neutral";
							local.insertBefore(statusElement, local.childNodes[0]);`
						}, async ()=>{
							setTimeout(()=>{
								resolve(true);
							},2000);
						});
					}else{
						resolve(true);
					}
				}else{
					resolve(false);
				}
			});
		});
		if(ret1){
			chrome.tabs.executeScript(tabs[0].id, {code: `document.querySelector("#statusElement").innerHTML;`}, el =>{
				if(el[0] === "Running"){
					chrome.storage.sync.set({status: 'running'});
				}else if(el[0] === "Stopped"){
					chrome.storage.sync.set({status: 'stopped'});
				}
			});	
		}
		if(ret2){
			chrome.tabs.executeScript(tabs[0].id, {code: `document.querySelector("#statusPause").innerHTML;`}, el =>{
				if(el[0] === "Running"){
					chrome.storage.sync.set({statusPause: 'running'});
				}else if(el[0] === "Stopped"){
					chrome.storage.sync.set({statusPause: 'stopped'});
				}else if(el[0] === "Neutral"){
					chrome.storage.sync.set({statusPause: 'neutral'});
				}
			});	
		}
	});
	chrome.storage.sync.get('status', function(data) {
		if(data.status === "stopped"){
			document.querySelector("#btnAction").removeAttribute("disabled", "");
			document.querySelector("#btnAction").style.backgroundColor = "";
		}else if(data.status === "running"){
			document.querySelector("#btnAction").setAttribute("disabled", "");
			document.querySelector("#btnAction").style.backgroundColor = "gray";
		}
	});

	chrome.storage.sync.get('statusPause', function(data) {
		if(data.statusPause === "stopped"){
			document.querySelector("#btnToglePause").removeAttribute("disabled", "");
			document.querySelector("#btnToglePause").style.backgroundColor = "";
			document.querySelector("#btnToglePause").innerText = "Retornar";
		}else if(data.statusPause === "running"){
			document.querySelector("#btnToglePause").removeAttribute("disabled", "");
			document.querySelector("#btnToglePause").style.backgroundColor = "";
			document.querySelector("#btnToglePause").innerText = "Pausar";
		}else if(data.statusPause === "neutral"){
			document.querySelector("#btnToglePause").setAttribute("disabled", "");
			document.querySelector("#btnToglePause").style.backgroundColor = "gray";
			document.querySelector("#btnToglePause").innerText = "Pausar";
		}
	});
}

document.querySelector("#btnAction").addEventListener("click", evt => {
	document.querySelector("#btnAction").setAttribute("disabled", "");
	document.querySelector("#btnAction").style.backgroundColor = "gray";
	//document.querySelector("#btnToglePause").removeAttribute("disabled", "");
	//document.querySelector("#btnToglePause").style.backgroundColor = "";
	chrome.storage.sync.set({status: 'running'});
	chrome.storage.local.get('code', function(data) {
		chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
			chrome.tabs.executeScript(tabs[0].id, {code: data.code});
		});
	});
});

document.querySelector("#btnToglePause").addEventListener("click", evt => {
	chrome.storage.sync.get('statusPause', function(data) {
		if(data.statusPause === "running"){
			document.querySelector("#btnToglePause").removeAttribute("disabled", "");
			document.querySelector("#btnToglePause").style.backgroundColor = "";
			document.querySelector("#btnToglePause").innerText = "Retornar";
			chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
				chrome.tabs.executeScript(tabs[0].id, {code: `document.querySelector("#statusPause").innerText = "Stopped"`});
			});
			chrome.storage.sync.set({statusPause: 'stopped'});
		}else if(data.statusPause === "stopped"){
			document.querySelector("#btnToglePause").removeAttribute("disabled", "");
			document.querySelector("#btnToglePause").style.backgroundColor = "";
			document.querySelector("#btnToglePause").innerText = "Pausar";
			chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
				chrome.tabs.executeScript(tabs[0].id, {code: `document.querySelector("#statusPause").innerText = "Running"`});
			});
			chrome.storage.sync.set({statusPause: 'running'});
		}
	});
	chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
		chrome.tabs.executeScript(tabs[0].id, {code: `toggleIsPause();`});
	});
});