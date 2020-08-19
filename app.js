const searchButton = document.getElementById("search-button");
const searchResult = document.getElementById("lyrics-search-results");
const fullLyrics = document.getElementById("full-lyrics");

searchButton.addEventListener("click", function () {
	const searchInput = document.getElementById("search-input").value;

	if (searchInput) {
		fetch(`https://api.lyrics.ovh/suggest/${searchInput}/`)
			.then((response) => response.json())
			.then((data) => getSearchResult(data));
	} else {
		alert("Please add song title");
	}
	document.getElementById("search-input").value = "";
});

function getSearchResult(search) {
	searchResult.innerHTML = "";
	for (let i = 0; i < 10; i++) {
		let songTitle = search.data[i].title;
		let singerName = search.data[i].artist.name;
		let albumImage = search.data[i].artist.picture_medium;

		let result = `<div class="single-result row align-items-center my-3 p-3">
                <div class="col-md-2 album-image">
                    <img src="${albumImage}" alt="${singerName}">
                </div>
                <div class="col-md-7">
                    <h3 class="lyrics-name">${songTitle}</h3>
                    <p class="author lead">Album by <span>${singerName}</span></p>
                </div>
                <div class="col-md-3 text-md-right text-center">
                    <button class="btn btn-success" onclick="getLyrics('${singerName}', '${songTitle}')">Get Lyrics</button>
                </div>
            </div>`;
		searchResult.innerHTML += result;
	}
}

/* Getting lyrics from API */

function getLyrics(singerName, songTitle) {
	fetch(`https://api.lyrics.ovh/v1/${singerName}/${songTitle}`)
		.then((response) => response.json())
		.then((data) => {
			fullLyrics.innerHTML = `
                        <button id="back-button" class="btn go-back text-white" onClick="goBack()">&lsaquo; go back</button>
                        <h2 class="text-success mb-4">${singerName} - ${songTitle}</h2>
                        <pre class="lyric text-white">${
													!data.lyrics ? data.error : data.lyrics
												}</pre>
                    `;
			searchResult.style.display = "none";
		});
}

/* Back to search result */
function goBack() {
	searchResult.style.display = "block";
	fullLyrics.innerHTML = "";
}
