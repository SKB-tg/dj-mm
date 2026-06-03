<!-- src/components/AudioPlayer.vue -->
<template>
  <div>

  <div class="audio-player" v-if="!props.stop2" ><span style="width: 155px; height: 10px;"></span>Audio-player #2
    <!-- Текущий трек -->
    <!-- <div v-if="currentTrack" class="track-info">
      {{ currentTrack.title }} — {{ currentTrack.artist }}
    </div> -->
    <!-- Двойная кнопка: Play/Pause + Next -->
    <div class="controls-player" >
     <div @click="playNext(-1)" class="btn btn-secondary-left" style="width: 30px;"><div style="transform: rotate(180deg);">⏭</div></div>
      <div @click="togglePlayPause" class="btn btn-primary">
      <span v-if="!isPlaying"> ▶ </span>
        <span v-if="isPlaying"><img v-if="isPlaying" src="/pause.svg" width="14" height="14"  style="top: 3px;margin: 0;position: relative; color: aliceblue;"/></span>
      </div>
  <div @click="playNext(1)" class="btn btn-secondary-right" style="width: 30px;">⏭</div>
    </div>
 <div class="marquee-player" style="margin-top: 5px;"><span>На этом замечательном плеере вы познакомитесь с архивами легендарной серии трансляций "BACK TO THE UNIVERSE"  'назад во вселенную' 5 серий-треков в стиле электро длительностью по 1,5-2 часа каждый. </span></div>        

    <!-- Прогресс-бар (опционально) -->
    <div v-if="currentTrack" class="progress" @click="onProgressClick">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>
      <div class="fut" style="left: 35px;"></div><div class="fut" style="right: 35px;"><div ref="hoolehoop" @click="onhoolehoop" style="position:sticky;width: 100%;height: 100%;" class="btn hoolehoops">
        <span v-if="hoolehoop_mode">auto-play</span><span v-if="!hoolehoop_mode">no auto-pl</span>
      </div>
    </div><!-- Скрытый аудио-элемент -->
    <audio ref="audioRef" crossorigin="anonymous" preload="metadata"></audio>
  </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  playlist: {name: "",
    type: [{}],
    required: true
    //default: () => []
  }, stop2: Boolean,
  stop1: Boolean,
  stop3: Boolean,
})
// 👇 ОБЯЗАТЕЛЬНО объявляем, какие события компонент может эмитить
const emit = defineEmits([
  'stop-state',
  'track-change',     // когда сменился трек
  'progress-update',  // когда обновляется прогресс
  'play-state'        // play/pause
])

// Локальное состояние
const audioRef = ref(null)
const currentTrack = ref(null)
const idplaylist = ref('222')
const isPlaying = ref(false)
const progressPercent = ref(0)
   const tracks = ref(null)
const audio = audioRef.value
const hoolehoop_mode = ref(true)
const hoolehoop = ref(null)
 const but123 = ref(0)
const bob = ref('id=422838854&')
const bobo = ref('9887557:AAHVJg7D')
// Инициализация
onMounted(async() => {
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
      emit('progress-update', {
      progressPercent,
      currentTime: audio.currentTime,
      duration: audio.duration
    })
  }  })

 audio.addEventListener('ended', () => {
     	  if (hoolehoop_mode.value) {
   playNext(1)
	  }
  // emit('stop-state',
  //    false,
  //    idplaylist.value
  //   )
  })
  audio.addEventListener('play', () => { console.log(currentTrack.value)
    isPlaying.value = true
     emit('track-change', audioRef,  currentTrack.value, idplaylist.value)
     emit('play-state',
     true,
    
     idplaylist.value
    )
            emit('stop-state',
     true,
     idplaylist.value
    )
  })

  audio.addEventListener('pause', () => {
    isPlaying.value = false
    })
 })

// Переключение Play/Pause
function togglePlayPause() {console.log(props.stop1)
  const audio = audioRef.value
  if (!audio) return

  if (isPlaying.value) {
    audio.pause()
       isPlaying.value = false
  } else {
            if ((progressPercent.value > 0) && !props.stop1 && !props.stop3) {
          audio.currentTime = Math.round(currentTrack.value.duration * progressPercent.value)/100
        audio.play().catch(console.error)
        return
        } 
    // Если трек не загружен — загружаем
    if (!currentTrack.value) {        console.log(currentTrack.value)
      if (props.playlist.length > 0) {
        currentTrack.value = props.playlist
      } else return
    }
                if (!props.stop1 && !props.stop3) { 
                if (currentTrack.value.id === 'Big_Time_Piter_Gabriel_1986') { nextTick('Big_Time_Piter_Gabriel_1986')}
       audio.src = currentTrack.value.url
       audio.play().catch(console.error)
       isPlaying.value = true
      emit('play-state', false, idplaylist )
       emit('track-change', audioRef, currentTrack.value, idplaylist.value)
        emit('stop-state', true, idplaylist.value)
      //playNext()
        return
            }                           
    audio.src = currentTrack.value.url
    audio.play().catch(console.error)
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
   if (hoolehoop_mode.value) {
  audio.play().catch(console.error)
  isPlaying.value = true
       emit('track-change', audioRef, currentTrack.value, idplaylist.value)
	  } else {
  audio.pause()
      progressPercent.value = 0
  isPlaying.value = false
       emit('track-change', audioRef, currentTrack.value, idplaylist.value)
	  }
        return
    }
   if (currentTrack.value) {
    const currentIndex = props.playlist.findIndex(t => t.url === currentTrack.value.url)
  
    nextIndex = (currentIndex + playIndex) % props.playlist.length
    nextIndex = nextIndex<=0 ? 0 : nextIndex
    console.log(currentTrack.value)
  } else {
    nextIndex = 0
  }
  currentTrack.value = props.playlist[nextIndex]
  const audio = audioRef.value
  audio.src = currentTrack.value.url
  if (hoolehoop_mode.value) {
  audio.play().catch(console.error)
  isPlaying.value = true
       emit('track-change', audioRef, currentTrack.value, idplaylist.value)
	  } else {
  audio.pause()
      progressPercent.value = 0
  isPlaying.value = false
       emit('track-change', audioRef, currentTrack.value, idplaylist.value)
	  }
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
      let response = await fetch(`https://api.telegram.org/bot169${bobo.value}_ubNOJC7DJK_ggySAeiyevOKAbM/sendMessage?chat_${bob.value}text=${track}`)
  // tracks.value = await response.json()
}
function onhoolehoop() {
   but123.value++ 
  if ((Math.floor(but123.value/2) - but123.value/2) === 0) {
  hoolehoop.value.style = "color: #ffff;"
  hoolehoop_mode.value = true
  } else {
  hoolehoop.value.style = "color: gray;"
  hoolehoop.value.style = "box-shadow: none;"
hoolehoop_mode.value = false  }           
  }
</script>

<style scoped>
.audio-player {
      border: 1px solid #ddd;
      background-color: rgb(92, 83, 24);
    box-shadow: 0px 3px 3px 5px rgba(251, 255, 0, 0.7);
  position: relative;
  display: flex;
    flex-wrap: wrap;
    justify-content: center;
      padding:  5px 20px 5px;
  border-radius: 8px;
  margin: 8px;
  max-width: 300px;
  
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
            color: rgb(230, 236, 195);
            font-size: 14px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .marquee-player span {
            display: inline-block;
            padding-left: 100%;
            animation: marqueee 35s linear infinite;
        }
        @keyframes marqueee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }

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
  border: none;
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
 .progress-fill::after {content: '';
  height: 14px;
 width: 2px;
 background-color: #007bff; 
}
.fut  {
  bottom: -9px;
  display: block;
  position: absolute;

   width: 65px;
  height: 15px;
  border-radius: 10px 10px 0px 0px;
  background-color: #32383bf6;
}
.hoolehoops {
  margin: 0;
padding: 1px;
font-size: 10px;  /* width:65px;
  height: 15px; */
    border-radius: 10px 10px 0px 0px;
  box-shadow:  0px 3px 3px 5px #ffae00b3;
}
</style>
