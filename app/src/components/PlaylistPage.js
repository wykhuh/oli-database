import { html, setupComponent } from "../lib/component_utils.js";

let template = html`
  <h1 class="title">'Oli Playlist</h1>
  <div id="player"></div>
  <ul id="playlist"></ul>
  <div id="state"></div>
`;

export class PlaylistPage extends HTMLElement {
  constructor() {
    super();
  }

  playlist = app.store.videos;
  playlistIndex = 0;
  playerYT;
  playerVimeo;

  connectedCallback() {
    setupComponent(template, this);

    this.renderPlaylist(this.playlist);
    this.renderPlayer(this.playlist[this.playlistIndex]);

    this.querySelectorAll(".playlist-item").forEach((li) => {
      li.addEventListener("click", this);
    });
  }

  disconnectedCallback() {
    this.querySelectorAll(".playlist-item").forEach((li) => {
      li.removeEventListener("click", this);
    });
  }

  handleEvent(event) {
    let videoEl = document.querySelector("video-embed");
    if (!videoEl) return;

    let target = event.target;

    if (event.type === "click") {
      if (target.dataset.videoProvider === "youtube") {
        if (this.playerYT) {
          this.playerYT.loadVideoById(target.dataset.videoId);
        } else {
          this.playerYT = this.createYTPlayer({ "Video Id": target.dataset.videoId });
        }
      } else {
        if (this.playerVimeo) {
          this.playerVimeo.dataset.videoId = target.dataset.videoId;
        } else {
          this.playerVimeo = this.createVimeoPlayer({ "Video Id": target.dataset.videoId });
        }
      }

      this.removeCurrentClassFromPlaylist();
      target.classList.add("current");
      this.playlistIndex = Number(target.dataset.index);
    }
  }

  removeCurrentClassFromPlaylist() {
    let currentEl = this.querySelector(".playlist-item.current");
    if (currentEl) {
      currentEl.classList.remove("current");
    }
  }

  renderPlaylist(videos) {
    let playlistEl = document.querySelector("#playlist");
    if (!playlistEl) return;

    videos.forEach((video, i) => {
      let itemEl = document.createElement("li");
      itemEl.className = "playlist-item";
      itemEl.dataset.index = i;
      itemEl.dataset.videoId = video["Video Id"];
      itemEl.dataset.videoProvider = video["Video Provider"];

      if (i === this.playlistIndex) {
        itemEl.classList.add("current");
      }

      let date = video["Video Published At"].toLocaleDateString();
      let title = video["Video Title"].replace(/^\d+.\d+ /, "");
      itemEl.innerHTML = `${title} (uploaded ${date}) `;

      let linkEl = document.createElement("a");
      if (video["Video Provider"] === "youtube") {
        linkEl.href = `https://www.youtube.com/watch?v=${video["Video Id"]}`;
        linkEl.textContent = "YouTube";
      } else {
        linkEl.href = `https://vimeo.com/${video["Video Id"]}`;
        linkEl.textContent = "Vimeo";
      }
      itemEl.appendChild(linkEl);

      playlistEl.append(itemEl);
    });
  }

  renderPlayer(video) {
    if (video["Video Provider"] === "youtube") {
      this.playerYT = this.createYTPlayer(video);
    } else {
      this.createVimeoPlayer(video);
    }
  }

  createVimeoPlayer(video) {
    let playlistEl = document.querySelector("#player");
    if (!playlistEl) return;
    playlistEl.innerHTML = "";
    this.playerYT = undefined;

    let embedEl = document.createElement("video-embed");
    embedEl.dataset.videoProvider = "vimeo";
    embedEl.dataset.videoId = video["Video Id"];
    playlistEl.appendChild(embedEl);

    return embedEl;
  }

  createYTPlayer(video) {
    let playlistEl = document.querySelector("#player");
    if (!playlistEl) return;
    playlistEl.innerHTML = "";
    this.playerVimeo = undefined;

    let embedEl = document.createElement("video-embed");
    embedEl.dataset.videoProvider = "youtube";
    embedEl.dataset.videoId = video["Video Id"];
    playlistEl.appendChild(embedEl);

    return new YT.Player("ytplayer", {
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange.bind(this),
      },
    });
  }

  onPlayerReady() {
    // this.setBorderColor();
  }

  onPlayerStateChange(event) {
    // this.changeBorderColor(event.data);
    this.updatePlaylist(event);
  }

  updatePlaylist(event) {
    if (event.data == 0) {
      if (this.playlistIndex == this.playlist.length - 1) {
        this.playlistIndex = 0;
      } else {
        this.playlistIndex += 1;
      }

      this.removeCurrentClassFromPlaylist();
      let itemEli = document.querySelector(`[data-index='${this.playlistIndex}']`);
      if (itemEli) {
        itemEli.classList.add("current");
      }

      let newVideo = this.playlist[this.playlistIndex];
      if (newVideo["Video Provider"] === "youtube") {
        if (this.playerYT) {
          this.playerYT.loadVideoById(newVideo["Video Id"]);
        } else {
          this.playerYT = this.createYTPlayer(newVideo);
        }
      } else {
        if (this.playerVimeo) {
          this.playerVimeo.dataset.videoId = video["Video Id"];
        } else {
          this.playerVimeo = this.createVimeoPlayer(newVideo);
        }
      }
    }
  }

  setBorderColor() {
    document.getElementById("ytplayer").style.borderColor = "#FFF000";
    document.getElementById("ytplayer").style.borderWidth = "4px";
    document.getElementById("ytplayer").style.borderStyle = "solid";
  }

  changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
      color = "#37474F"; // unstarted = gray
    } else if (playerStatus == 0) {
      color = "#FFFF00"; // ended = yellow
    } else if (playerStatus == 1) {
      color = "#33691E"; // playing = green
    } else if (playerStatus == 2) {
      color = "#DD2C00"; // paused = red
    } else if (playerStatus == 3) {
      color = "#AA00FF"; // buffering = purple
    } else if (playerStatus == 5) {
      color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
      document.getElementById("ytplayer").style.borderColor = color;
    }
  }
}

customElements.define("playlist-page", PlaylistPage);
