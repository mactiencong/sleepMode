let sleep_timer = document.getElementById("sleep_timer")
let timer_value = document.getElementById("timer_value")
timer_value.innerHTML = sleep_timer.value

sleep_timer.oninput = function() {
    timer_value.innerHTML = this.value
}

function save_options(on_save) {
    let ignore_pinned_tabs=document.getElementById("ignore_pinned_tabs").checked
    chrome.storage.local.set({
      timerValue: sleep_timer.value,
      ignorePinnedTabs: ignore_pinned_tabs? true: false
    }, on_save)
}

function options_start_msg(){
  chrome.runtime.sendMessage({msg: 'OPTION_START', time: sleep_timer.value})
}

function options_disable_msg(){
  chrome.runtime.sendMessage({msg: 'OPTION_DISABLE'})
}

function restore_options() {
    chrome.storage.local.get({
      timerValue: 0,
      ignorePinnedTabs: false
    }, init_data)
}

function init_data(items) {
  document.getElementById('timer_value').value = items.timerValue
  document.getElementById('ignore_pinned_tabs').checked = items.ignorePinnedTabs
  sleep_timer.value = items.timerValue
  timer_value.innerHTML = items.timerValue
}

document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('start').addEventListener('click', save_options.bind(this, options_start_msg))
document.getElementById('disable').addEventListener('click', save_options.bind(this, options_disable_msg))