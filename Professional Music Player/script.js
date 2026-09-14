/* =====================================================
   MUSIC DATA (Working Audio MP3 Sources)
===================================================== */
const songs = [
    {
        title: "Dreaming Again",
        artist: "Noor Music",
        category: "Pop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Midnight Vibes",
        artist: "Noor Music",
        category: "Chill",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Better Days",
        artist: "Noor Music",
        category: "Rock",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "Beautiful Moments",
        artist: "Noor Music",
        category: "Classical",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        title: "Feel The Beat",
        artist: "Noor Music",
        category: "Pop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    },
    {
        title: "Peaceful Evening",
        artist: "Noor Music",
        category: "Chill",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
];

/* SELECT ELEMENTS */
const audioPlayer = document.getElementById("audioPlayer");
const playlist = document.getElementById("playlist");
const searchInput = document.getElementById("searchInput");
const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const songCount = document.getElementById("songCount");
const noResults = document.getElementById("noResults");

/* PLAYER VARIABLES */
let currentSongIndex = 0;
let filteredSongs = [...songs];
let isPlaying = false;
let isShuffle = false;

/* LOAD SONG */
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[currentSongIndex];

    audioPlayer.src = song.url;
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;

    progressBar.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    renderPlaylist();

    favoriteBtn.classList.remove("liked");
    favoriteBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
}

/* RENDER PLAYLIST */
function renderPlaylist() {
    playlist.innerHTML = "";

    songCount.textContent = filteredSongs.length + (filteredSongs.length === 1 ? " song" : " songs");

    if (filteredSongs.length === 0) {
        noResults.style.display = "block";
        return;
    }

    noResults.style.display = "none";

    filteredSongs.forEach(function(song, index) {
        const realIndex = songs.indexOf(song);
        const songItem = document.createElement("div");
        songItem.className = "song-item";

        if (realIndex === currentSongIndex) {
            songItem.classList.add("active");
        }

        songItem.innerHTML = `
            <span class="song-number">${String(index + 1).padStart(2, "0")}</span>
            <div class="song-icon">
                <i class="fa-solid fa-music"></i>
            </div>
            <div class="song-details">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
            <span class="song-category">${song.category}</span>
            <button class="song-favorite" title="Favorite">
                <i class="fa-regular fa-heart"></i>
            </button>
        `;

        /* Song click */
        songItem.addEventListener("click", function(event) {
            if (event.target.closest(".song-favorite")) {
                return;
            }
            loadSong(realIndex);
            playSong();
        });

        /* Favorite Toggle */
        const favorite = songItem.querySelector(".song-favorite");
        favorite.addEventListener("click", function(event) {
            event.stopPropagation();
            favorite.classList.toggle("liked");
            if (favorite.classList.contains("liked")) {
                favorite.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                favorite.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
        });

        playlist.appendChild(songItem);
    });
}

/* PLAY / PAUSE LOGIC */
function playSong() {
    audioPlayer.play()
        .then(function() {
            isPlaying = true;
            updatePlayButton();
            document.body.classList.add("playing");
        })
        .catch(function(error) {
            console.log("Audio play error:", error);
        });
}

function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayButton();
    document.body.classList.remove("playing");
}

playBtn.addEventListener("click", function() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

function updatePlayButton() {
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playBtn.title = "Pause";
    } else {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playBtn.title = "Play";
    }
}

/* NEXT & PREVIOUS */
function nextSong() {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSongIndex && songs.length > 1);
        currentSongIndex = randomIndex;
    } else {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
    }
    loadSong(currentSongIndex);
    playSong();
}

function previousSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
previousBtn.addEventListener("click", previousSong);

/* SHUFFLE */
shuffleBtn.addEventListener("click", function() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
    if (isShuffle) {
        shuffleBtn.style.color = "#93c5fd";
    } else {
        shuffleBtn.style.color = "";
    }
});

/* PROGRESS BAR UPDATE */
audioPlayer.addEventListener("timeupdate", function() {
    if (!audioPlayer.duration) return;
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener("loadedmetadata", function() {
    duration.textContent = formatTime(audioPlayer.duration);
});

progressBar.addEventListener("input", function() {
    if (!audioPlayer.duration) return;
    const newTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
});

/* VOLUME */
volumeBar.addEventListener("input", function() {
    audioPlayer.volume = volumeBar.value;
});
audioPlayer.volume = 0.8;

/* SONG ENDED */
audioPlayer.addEventListener("ended", function() {
    nextSong();
});

/* SEARCH FILTER */
searchInput.addEventListener("input", function() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    filteredSongs = songs.filter(function(song) {
        return (
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm) ||
            song.category.toLowerCase().includes(searchTerm)
        );
    });
    renderPlaylist();
});

/* CATEGORY FILTER */
const categoryButtons = document.querySelectorAll(".category-btn");
categoryButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const category = button.dataset.category;
        categoryButtons.forEach(function(btn) { btn.classList.remove("active"); });
        button.classList.add("active");

        if (category === "All") {
            filteredSongs = [...songs];
        } else {
            filteredSongs = songs.filter(function(song) { return song.category === category; });
        }
        searchInput.value = "";
        renderPlaylist();
    });
});

/* FAVORITE NOW PLAYING */
favoriteBtn.addEventListener("click", function() {
    favoriteBtn.classList.toggle("liked");
    if (favoriteBtn.classList.contains("liked")) {
        favoriteBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    } else {
        favoriteBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
});

/* TIME FORMATTER */
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}

/* INITIALIZE */
loadSong(0);
renderPlaylist();