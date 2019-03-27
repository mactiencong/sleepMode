let isEnable = true

function start(){
  chrome.browserAction.onClicked.addListener(function(tab) {
    if(isEnable) {
        disable()
    } else enable()
  })
}

function enable(){
  isEnable = true
  setEnableIcon()
  discardAllTab()
  chrome.webNavigation.onCompleted.addListener(newTabListener)
}

function disable(){
  isEnable = false
  setDisableIcon()
  reloadAllTab()
  chrome.webNavigation.onCompleted.removeListener(newTabListener)
}

function newTabListener(tabDetail){
  discardTab(tabDetail.tabId)
  changeTabTitle(tabDetail.tabId)
}

function setEnableIcon(){
  chrome.browserAction.setIcon({
      path : "icon/enable.png"
  })
}

function setDisableIcon(){
  chrome.browserAction.setIcon({
      path : "icon/disable.png"
  })
}

function reloadAllTab(){
  chrome.tabs.query({url: "*://*/*"}, tabs => {
      tabs.forEach(tab => {
        reload(tab)
      })
  })
}

function reload(tab){
  chrome.tabs.reload(tab.id)
}

function discardTab(tabId){
  try {
    chrome.tabs.discard(tabId)
  } catch {}
}

function changeTabTitle(tabId){
  try {
    chrome.tabs.executeScript(tabId, {code:"document.title = 'Sleep Mode'"})
  } catch {}
}

function discardAllTab(){
  chrome.tabs.query({url: "*://*/*"}, tabs => {
      tabs.forEach(tab => {
        changeTabTitle(tab.id)
        discardTab(tab.id)
      })
  })
}

start()