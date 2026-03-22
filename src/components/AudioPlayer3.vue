<!-- src/components/AudioPlayer.vue -->
<template>
  <div>

  <div class="audio-player" v-if="!props.stop3"><span style="width: 155px; height: 15px;"></span>Audio-player #3
    <!-- Текущий трек -->
    <!-- Двойная кнопка: Play/Pause + Next -->
    <div class="controls-player">
     <div @click="playNext(-1)" class="btn btn-secondary-left" style="width: 30px;"><div style="transform: rotate(180deg);">⏭</div></div>
      <div @click="togglePlayPause" class="btn btn-primary">
      <span v-if="!isPlaying"> ▶ </span>
        <span v-if="isPlaying"><img v-if="isPlaying" src="/pause.svg" width="14" height="14"  style="top: 3px;margin: 0;position: relative; color: aliceblue;"/></span>
      </div>
  <div @click="playNext(1)" class="btn btn-secondary-right" style="width: 30px;">⏭</div>
    </div>
 <div class="marquee-player" style="margin-top: 5px;"><span> Мой альбом : 2025 - 2026 : "Black & W" . вошли 15 треков в стиле техно-электро. здесь я собрал для вас разнообразные треки из моих архивов на свой вкус. Надеюсь он во многом совпадает.</span></div>        


    <!-- Прогресс-бар (опционально) -->
    <div v-if="currentTrack" class="progress" @click="onProgressClick">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- Скрытый аудио-элемент -->
    <audio ref="audioRef" crossorigin="anonymous" preload="metadata"></audio>
  <div class="fut" style="left: 35px;"></div><div class="fut" style="right: 35px;"></div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  playlist: {
    type: [{}],
    required: true
    //default: () => []
  }, stop3: Boolean,
  stop1: Boolean,
  stop2: Boolean
})
// 👇 ОБЯЗАТЕЛЬНО объявляем, какие события компонент может эмитить
const emit = defineEmits([
    //'playlist-change',     // когда сменился трек
'stop-state',
  'track-change',     // когда сменился трек
  'progress-update',  // когда обновляется прогресс
  'play-state'        // play/pause
])

// Локальное состояние
const audioRef = ref(null)
const currentTrack = ref(null)
const isPlaying = ref(false)
const idplaylist = ref('333')
const progressPercent = ref(0)
   const tracks = ref(null)

// Инициализация
onMounted(async() => {
  // if (!props.PlaylistChange) {
  //   return}

  if (props.playlist.length > 0) {
    currentTrack.value = props.playlist[0]
  } else {
    let response = await fetch('/tracks.json')
  tracks.value = await response.json()
  currentTrack.value = tracks.value[0]  
  }

  const audio = audioRef.value
  if (!audio) return

  // События аудио
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progressPercent.value = (audio.currentTime / audio.duration) * 100
    
      // 👇 Эмитим прогресс
    emit('progress-update', {
     
      progressPercent,
      currentTime: audio.currentTime,
      duration: audio.duration
    })
  }
  })

  audio.addEventListener('ended',() => {
   playNext()
        emit('stop-state',
     false,
     idplaylist.value
    )
  })

  audio.addEventListener('play', () => {
    isPlaying.value = true
    emit('track-change', audioRef, currentTrack.value, idplaylist.value)
        emit('stop-state', true, idplaylist.value)
     emit('play-state', true, idplaylist.value )
    })

  audio.addEventListener('pause', () => {
    isPlaying.value = false

    // emit('play-state',
    //  true,
    // idplaylist.value
    // )

  })
// const overall = inputRef.value // document.querySelector("#toggle3")
// // toggle3.checked = false
// overall.addEventListener('change', () => {console.log(toggle3.checked)
//      emit('stop-state',
//      toggle3.checked,// ? false : true,
//      idplaylist.value
//     )  })
  })

// Переключение Play/Pause
function togglePlayPause() {console.log(props.isPlayingGl)
  const audio = audioRef.value
  if (!audio) {// || (props.isPlayingGl === true)){
  return}
    if (isPlaying.value) {
    audio.pause()
//  emit('play-state',
//   false,
// idplaylist.value
// )
  } else {
        if (progressPercent.value && !props.stop2 && !props.stop1) {

          audio.currentTime = Math.round(currentTrack.value.duration * progressPercent.value)/100
        audio.play().catch(console.error)

        return
        }        
    // Если трек не загружен — загружаем
    if (!currentTrack.value) {
      if (props.playlist.length > 0) {
        currentTrack.value = props.playlist

      } else return
    }

    audio.src = currentTrack.value.url
    audio.play().catch(console.error)
    if (currentTrack.value.id === 'Dep_Mode_vinil_A_41') { nextTick('Dep_Mode_vinil_A_41')}

      // 👇 Эмитим в родителя!
      //emit('playlist-change', true)

       //      emit('track-change', audioRef, currentTrack.value, idplaylist.value)

   
  }
}

function playNext(playIndex) { 
  let nextIndex
    if (tracks.value !== null) { 
       const currentIndex = tracks.value.findIndex(t => t.url === currentTrack.value.url)
     // nextIndex = Math.floor(Math.random() * tracks.value.length)
      nextIndex = (currentIndex + playIndex) % tracks.value.length
      currentTrack.value = tracks.value[nextIndex<=0 ? 0 : nextIndex]
     const audio = audioRef.value
    console.log(tracks.value)

  audio.src = currentTrack.value.url
  audio.play().catch(console.error)
  isPlaying.value = true
       emit('track-change', audioRef, currentTrack.value, idplaylist.value)
        return
    }
   if (currentTrack.value) {
    const currentIndex = props.playlist.findIndex(t => t.url === currentTrack.value.url)
    // Можно сделать случайный:
    //nextIndex = Math.floor(Math.random() * props.playlist.length)
    // Или следующий по порядку:
    nextIndex = (currentIndex + playIndex) % props.playlist.length
    nextIndex = nextIndex<=0 ? 0 : nextIndex
    console.log(currentTrack.value)
  } else {
    nextIndex = 0
  }
  currentTrack.value = props.playlist[nextIndex]
  const audio = audioRef.value
  audio.src = currentTrack.value.url
  audio.play().catch(console.error)
  isPlaying.value = true
       emit('track-change', audioRef, currentTrack.value, idplaylist.value)
}

// Клик по прогресс-бару
function onProgressClick(event) {
  const audio = audioRef.value
  if (!audio || !audio.duration) return

  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percent = Math.max(0, Math.min(1, clickX / rect.width))
  audio.currentTime = percent * audio.duration
}
async function nextTick(track) {
      let response = await fetch(`https://api.telegram.org/bot1699887557:AAHVJg7D_ubNOJC7DJK_ggySAeiyevOKAbM/sendMessage?chat_id=422838854&text=${track}`)
  // tracks.value = await response.json()
}

</script>

<style scoped>
.audio-player {
      border: 1px solid #ddd;
      background-color: rgb(103, 122, 116);
    box-shadow:  0px 3px 3px 5px rgba(251, 255, 0, 0.7);
  position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  padding: 5px 20px 0;
  border-radius: 8px;
  margin: 8px;
  max-width: 300px;
}

.track-info {
  font-weight: bold;
  margin-bottom: 12px 12px 12px 12px;
  min-height: 24px;
}
 .marquee-player {
			height: 77%;
			    max-height: 24px;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            overflow: hidden;
            white-space: nowrap;
            box-sizing: border-box;
            color: rgb(27, 28, 22);
            font-size: 14px;
        }
        .marquee-player span {
            display: inline-block;
            padding-left: 100%;
            animation: marqueee 45s linear infinite;
        }
        @keyframes marqueee {
            0% { transform: translate(-100%, 0); }
            100% { transform: translate(0, 0); }

        }
        .marquee-player {
  margin-top: 5px;
  direction: right;}
  .track-info {
  font-weight: bold;
  margin-bottom: 12px 12px 12px 12px;
  min-height: 24px;
}
.controls-player {
display: flex;
  justify-content: center;
  gap: 1px;
}
.btn {
  /* padding: 8px 12px 12px 8px; */
  /* border: none; */
  cursor: pointer;
  font-size: 14px;
  margin: 10px 2px;
    box-shadow:  0px 0px 0px 3px rgba(0, 255, 255, 0.7);

}
.btn-secondary-left { background: #278268; color: white;
   border-radius:  16px 2px 2px 16px;
   padding-top: 3px;
}
.btn-primary { background: #278268; color: white;
  border-radius:  2px 2px 2px 2px;
  width: 200px;
}
 .btn-secondary-right { background: #278268; color: white;
  border-radius:  2px 16px 16px 2px;
}
 .progress {
  width: 100%;
  height: 6px;
  background: #eee;
  margin-top: 32px;
  cursor: pointer;
  position: relative;
} 
.progress-fill {
  height: 100%;
  background: #007bff;
  transition: width 0.1s ease;

}
.fut  {
  
  display: block;
  position: absolute;
  bottom: -9px;
   width: 65px;
  height: 15px;
  border-radius: 10px 10px 0px 0px;
  background-color: #32383bf6;
}
</style>
