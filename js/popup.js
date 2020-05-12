'use strict';
window.onload = async () =>{
	chrome.storage.sync.get('status', function(data) {
		if(data.status === "stopped"){
			document.querySelector("#btnAction").removeAttribute("disabled", "");
		}else if(data.status === "running"){
			document.querySelector("#btnAction").setAttribute("disabled", "");
		}
	});
}

document.querySelector("#btnAction").addEventListener("click", evt => {
	chrome.storage.sync.get('code', function(data) {
		chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
			document.querySelector("#btnAction").setAttribute("disabled", "");
			chrome.storage.sync.set({status: 'running'}, function() {
				console.log('status updated successfully!');
			});
			await chrome.tabs.executeScript(tabs[0].id, {code: data.code});
			await new Promise(resolve => setTimeout(resolve, 1000));
			chrome.storage.sync.set({status: 'stopped'}, function() {
				console.log('status updated successfully!');
			});
			document.querySelector("#btnAction").removeAttribute("disabled", "");
		});
	});
});