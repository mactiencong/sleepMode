let isEnable = false
let timerValue = 0
let ignorePinnedTabs = false
function getOption(){
  return new Promise(resolve => {
    chrome.storage.local.get({
      isEnable: isEnable,
      ignorePinnedTabs: ignorePinnedTabs
    }, option => {
      resolve(option)
    })
  })
}

// function saveOption(){
//   chrome.storage.local.set({
//     isEnable: isEnable,
//     timerValue: timerValue,
//     ignorePinnedTabs: ignorePinnedTabs
//   })
// }

function run(){
  console.log('run')
  getOption().then(option => {
    isEnable = option.isEnable
    timerValue = option.timerValue
    ignorePinnedTabs = option.ignorePinnedTabs
    if(isEnable) enable()
    else disable()
  })
}

function enable(){
  isEnable = true
  setEnableIcon()
  setSleepBadge()
  discardAllTab()
  processForPinnedTab()
  chrome.webNavigation.onCompleted.addListener(newTabListener)
}

function disable(){
  isEnable = false
  setDisableIcon()
  removeSleepBadge()
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

function setSleepBadge(){
  const badge = isEnable? '☾': ''
  chrome.browserAction.setBadgeText({text: badge})
  chrome.browserAction.setBadgeBackgroundColor({color: '#F00'})
}

function removeSleepBadge(){
  chrome.browserAction.setBadgeText({text: ''})
}

function isTabHighlighted(tab){
  return tab.highlighted === true
}

function isPinnedTab(tab){
  return tab.pinned
}

function discardAllTab(){
  chrome.tabs.query({url: "*://*/*", active: false}, tabs => {
      tabs.forEach(tab => {
        if(ignorePinnedTabs && isPinnedTab(tab)) return
        if(!isChromeSettingTab(tab) && !isTabHighlighted(tab))  startSleepModeTab(tab.id)
      })
  })
}

function processForPinnedTab(){
  if(ignorePinnedTabs) {
    chrome.tabs.query({url: "*://*/*", pinned: true, discarded: true}, tabs => {
      tabs.forEach(tab => {
        reload(tab)
      })
    })
  }
}

// chrome.browserAction.onClicked.addListener(() => {
//   if(isEnable) disable()
//   else enable()
// })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message', message)
  if(message.msg === 'OPTION_START'){
    onOptionStart(message.time)
  }
  else if(message.msg === 'OPTION_DISABLE'){
    onOptionDisable()
  }
})

function onOptionStart(time){
  isEnable = true
  timerValue = getValidTimerValue(time)
  if(timerValue>0){
    timerForSleep()
  } else {
    run()
  }
}

function onOptionDisable(){
  isEnable = false
  run()
}

function getValidTimerValue(value){
  return value
}

let timerTimeout = null
function timerForSleep(){
  removeTimerForSleep()
  timerTimeout = setTimeout(()=>{
    removeTimerForSleep()
    run()
  }, timerValue*1000*60)
}

function removeTimerForSleep(){
  if(timerTimeout !== null) {
    clearTimeout(timerTimeout)
    timerTimeout = null
  }
}
run()