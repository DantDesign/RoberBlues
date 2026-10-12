const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const progressContainer = document.querySelector(".progress-container");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const trackTitle = document.getElementById("trackTitle");
const tracks = document.querySelectorAll(".track");

const vinyl = document.querySelector(".vinyl");

let currentTrack = 0;


/* =========================
   TRACKS (URLs directas a archivos MP3 reales)
========================= */
const songs = [
    {
        title: "Chicago Night",
        file: "audio/chicago-night.mp4" // <-- Poné acá el nombre exacto de tu archivo y su carpeta
    },
    {
        title: "Sweet Home Chicago",
        file: "audio/chicago-night.mp4" // Repetimos el mismo para probar el botón "Siguiente"
    },
    {
        title: "Blue Train",
        file: "audio/chicago-night.mp4"
    },
    {
        title: "Smokestack Blues",
        file: "audio/chicago-night.mp4"
    }
];


function loadTrack(index) {
    currentTrack = index;
    audio.src = songs[index].file;
    trackTitle.textContent = songs[index].title;

    // Actualiza dinámicamente el texto del TRACK (TRACK 01, TRACK 02, etc)
    const trackNumberText = (index + 1).toString().padStart(2, "0");
    const trackNumberEl = document.querySelector(".track-number");
    if (trackNumberEl) {
        trackNumberEl.textContent = `TRACK ${trackNumberText}`;
    }

    tracks.forEach(track => track.classList.remove("active"));
    if (tracks[index]) tracks[index].classList.add("active");

    progress.style.width = "0%";
    currentTime.textContent = "0:00";
    duration.textContent = "..."; 
}


function togglePlay() {
    if (audio.paused) {
        audio.play()
            .then(() => {
                playBtn.textContent = "❚❚";
                vinyl.classList.add("playing");
            })
            .catch(error => {
                console.log("Error al reproducir:", error);
            });
    } else {
        audio.pause();
        playBtn.textContent = "▶";
        vinyl.classList.remove("playing");
    }
}

playBtn.addEventListener("click", togglePlay);


/* =========================
   PROGRESS
========================= */
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percentage = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percentage}%`;
    currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}

progressContainer.addEventListener("click", (event) => {
    if (!audio.duration) return;

    const width = progressContainer.clientWidth;
    const clickX = event.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});


/* =========================
   NEXT / PREVIOUS
========================= */
document.getElementById("nextBtn").addEventListener("click", () => {
    currentTrack = (currentTrack + 1) >= songs.length ? 0 : currentTrack + 1;
    executeTrackChange();
});

document.getElementById("prevBtn").addEventListener("click", () => {
    currentTrack = (currentTrack - 1) < 0 ? songs.length - 1 : currentTrack - 1;
    executeTrackChange();
});


/* =========================
   TRACK LIST
========================= */
tracks.forEach((track, index) => {
    track.addEventListener("click", () => {
        currentTrack = index;
        executeTrackChange();
    });
});


/* =========================
   AUTO NEXT
========================= */
audio.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) >= songs.length ? 0 : currentTrack + 1;
    executeTrackChange();
});


// Se eliminó el setTimeout innecesario para evitar desincronizaciones en clics rápidos
function executeTrackChange() {
    loadTrack(currentTrack);
    
    audio.play()
        .then(() => {
            playBtn.textContent = "❚❚";
            vinyl.classList.add("playing");
        })
        .catch(error => {
            console.log("La reproducción falló o fue interrumpida:", error);
            playBtn.textContent = "▶";
            vinyl.classList.remove("playing");
        });
}


/* =========================
   MOBILE MENU (Protegido contra errores null)
========================= */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}


/* =========================
   YEAR (Protegido contra errores null)
========================= */
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}


/* =========================
   INITIAL TRACK
========================= */
try {
    loadTrack(0);
} catch(e) {
    console.log("Error al inicializar el track:", e);
}