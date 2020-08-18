const searchSong = document.getElementById('searchSong');
const searchSongBtn = document.getElementById('searchSongBtn');
const songSuggestionList = document.getElementById("songSuggestionList");
const lyricsSongSuggestionList = document.getElementById("lyricsSongSuggestionList");

// lyrics suggestion
searchSong.addEventListener("keypress", event => {
    if (searchSong.value.length > 0) {
        searchSong.style.color = "black";
    }

    fetch(`https://api.lyrics.ovh/suggest/${event.target.value+event.key}`)
        .then(res => res.json())
        .then(data => {
            for (let i = 1; i <= 5; i++) {
                document.getElementById("title" + i).innerText = data.data[i].title;
                document.getElementById("artist" + i).innerText = data.data[i].artist.name;

                let title = data.data[i].title;
                let artist = data.data[i].artist.name;
                document.getElementById("lyricsBtn" + i).addEventListener("click", (event) => {
                    let api2 = `https://api.lyrics.ovh/v1/${artist}/${title}`;
                    fetch(api2)
                        .then(res => res.json())
                        .then(data => {
                            let str = data.lyrics.split(" ");
                            let [a, b, c] = str;
                            if (str.length > 10) {
                                document.getElementById("lyricsContentTitle").innerText = `${a} ${b} ${c}`;
                            } else {
                                document.getElementById("lyricsContentTitle").innerText = `${a}`;
                            }
                            document.getElementById("textContent").innerText = data.lyrics;
                        });
                    document.getElementById("lyricsContent").style.display = "block";
                });
            }
            songSuggestionList.style.display = "block";
        });
});

// all matched lyrics

searchSongBtn.addEventListener('click', event => {
    if (searchSong.value.length < 1) {
        let searchSong = document.getElementById("searchSong");
        searchSong.value = "type a lyrics name";
        searchSong.style.color = "red";
        document.getElementById("lyricsSongSuggestionList").style.display = "none";
    } else {
        searchSong.style.color = "black";
        let api = `https://api.lyrics.ovh/suggest/${searchSong.value}`;
        document.getElementById("lyricsContent").style.display = "none";
        for (let i = 1; i <= 10; i++) {
            document.getElementById("textContent" + i).style.display = "none";
        }
        fetch(api)
            .then(res => res.json())
            .then(data => {
                if (data.data.length == 0) {
                    document.getElementById("alertUnavailable").innerHTML = `<h4 style="color: #c0392b; text-align:center">Lyrics not available.</h4>`;
                } else {
                    for (let i = 1; i < data.data.length; i++) {

                        document.getElementById("lyricsTitle" + i).innerHTML = data.data[i].title;
                        document.getElementById("lyricsArtist" + i).innerHTML = data.data[i].artist.name;

                        lyricsSongSuggestionList.style.display = "block";
                        let count = 1;
                        document.getElementById("getLyricsBtn" + i).addEventListener("click", event => {

                            let textContent = document.getElementById("textContent" + i);

                            let title = data.data[i].title;
                            let artist = data.data[i].artist.name;
                            let api2 = `https://api.lyrics.ovh/v1/${artist}/${title}`;
                            fetch(api2)
                                .then(res => res.json())
                                .then(data => {
                                    if (data.lyrics == undefined) {
                                        textContent.innerHTML = `<p style="color: #c0392b; text-align:center;">The lyrics of this song is not available currently</p>`;
                                        textContent.style.display = "block";
                                    } else {
                                        if (count % 2 !== 0) {
                                            textContent.innerHTML = data.lyrics;
                                            textContent.style.display = "block";
                                            count++;
                                        } else {
                                            textContent.style.display = "none";
                                            count++;
                                        }
                                    }
                                });
                        });
                    }
                }
            });
        songSuggestionList.style.display = "none";
    }
});