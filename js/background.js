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
  discardAllTab(tabDetail.tabId)
}

function isChromeSettingTab(tabDetail){
  return tabDetail.url.includes('chrome://')
}

function startSleepModeTab(tabId){
  changeTabTitle(tabId).then(()=>{
    discardTab(tabId)
  })
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
  } catch(error){
  }
}

function changeTabTitle(tabId){
  return new Promise(resolve => {
    try {
      chrome.tabs.executeScript(tabId, {code:"if(!document.title.includes('Sleep Mode|')) document.title = 'Sleep Mode|'+document.title"}, () => {
        resolve(true)
      })
    } catch(error){
      resolve(true)
    }
  })
}

function isTabHighlighted(tab){
  return tab.highlighted === true
}

function discardAllTab(){
  chrome.tabs.query({url: "*://*/*", active: false}, tabs => {
      tabs.forEach(tab => {
        if(!isChromeSettingTab(tab) && !isTabHighlighted(tab))  startSleepModeTab(tab.id)
      })
  })
}

start()

enable()