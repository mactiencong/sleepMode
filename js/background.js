let isEnable = false

function getIsEnableStorage(){
  return new Promise(resolve => {
    chrome.storage.local.get(['key'], result => {
      resolve(result.key)
    })
  })
}

function setIsEnableStorage(value){
  chrome.storage.local.set({key: value})
}

function run(){
  getIsEnableStorage().then(value => {
    isEnable = value? true: false
    if(isEnable) enable()
    else disable()
  })
  chrome.browserAction.onClicked.addListener(() => {
    if(isEnable) disable()
    else enable()
  })
}

function enable(){
  isEnable = true
  setIsEnableStorage(isEnable)
  setEnableIcon()
  changeBadge()
  discardAllTab()
  chrome.webNavigation.onCompleted.addListener(newTabListener)
}

function disable(){
  isEnable = false
  setIsEnableStorage(isEnable)
  setDisableIcon()
  changeBadge()
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
  chrome.tabs.query({url: "*://*/*", discarded: true }, tabs => {
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
      chrome.tabs.executeScript(tabId, {code:"if(!document.title.includes('☾ ')) document.title = '☾ '+document.title"}, () => {
        resolve(true)
      })
    } catch(error){
      resolve(true)
    }
  })
}

function changeBadge(){
  const badge = isEnable? '☾': ''
  chrome.browserAction.setBadgeText({text: badge})
  chrome.browserAction.setBadgeBackgroundColor({color: '#F00'})
}

function isTabHighlighted(tab){
  return tab.highlighted === true
}

function discardAllTab(){
  chrome.tabs.query({url: "*://*/*", active: false, pinned: false}, tabs => {
      tabs.forEach(tab => {
        if(!isChromeSettingTab(tab) && !isTabHighlighted(tab))  startSleepModeTab(tab.id)
      })
  })
}
setIsEnableStorage(isEnable)
run()