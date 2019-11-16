let sleep_timer = document.getElementById("sleep_timer")
let timer_value = document.getElementById("timer_value")
let ignore_pinned_tabs=document.getElementById("ignore_pinned_tabs")
let ignore_audio_playback = document.getElementById("ignore_audio_playback")
let ignore_office_tabs = document.getElementById("ignore_office_tabs")
let timer_value_after = document.getElementById("timer_value_after")
let timer_value_mins = document.getElementById("timer_value_mins")
timer_value.innerHTML = ""
timer_value.append(sleep_timer.value)
sleep_timer.oninput = display_sleep_timer

function display_sleep_timer(){
  let timer_value_after_txt = "after"
  let timer_value_mins_txt = "mins"
  let value = "immediately"
  if(this.value==="0"){
    timer_value_after_txt = timer_value_mins_txt = ""
  }
  else {
    value = this.value
  }
  timer_value_after.innerHTML = ""
  timer_value_after.append(timer_value_after_txt)
  timer_value_mins.innerHTML = ""
  timer_value_mins.append(timer_value_mins_txt)
  timer_value.innerHTML = ""
  timer_value.append(value)
}

function save_options(on_save) {
    chrome.storage.local.set({
      timerValue: sleep_timer.value,
      ignorePinnedTabs: ignore_pinned_tabs.checked? true: false,
      ignoreAudioPlayback: ignore_audio_playback.checked? true: false,
      ignoreOfficeTabs: ignore_office_tabs.checked? true: false
    }, on_save)
    close_popup()
}

function close_popup(){
  setTimeout(()=>{
    window.close()
  }, 0)
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
      ignorePinnedTabs: false,
      ignoreAudioPlayback: false,
      ignoreOfficeTabs: false
    }, init_data)
}

function init_data(items) {
  ignore_pinned_tabs.checked = items.ignorePinnedTabs
  ignore_audio_playback.checked = items.ignoreAudioPlayback
  ignore_office_tabs.checked = items.ignoreOfficeTabs
  sleep_timer.value = items.timerValue
  sleep_timer.oninput() 
}

document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('start').addEventListener('click', save_options.bind(this, options_start_msg))
document.getElementById('disable').addEventListener('click', save_options.bind(this, options_disable_msg))