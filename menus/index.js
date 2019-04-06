let ignoreTabs = []

chrome.contextMenus.create({
    title: 'Ignore this tab (current session)',
    onclick: ignoreTab
})

chrome.contextMenus.create({
    title: 'Allow sleep this tab (current session)',
    onclick: allowTab
})

function isIgnored(tabId){
    return ignoreTabs[tabId]? true: false
}

function ignoreTab(info, tab){
    addTabToIgnoreList(tab.id)
}

function addTabToIgnoreList(tabId){
    if(!isIgnored(tabId)){
        ignoreTabs[tabId] = true
    }
}

function removeTabToIgnoreList(tabId){
    if(isIgnored(tabId)){
        delete ignoreTabs[tabId]
    }
}

function allowTab(info, tab){
    removeTabToIgnoreList(tab.id)
}