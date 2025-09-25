export class VideoEmbed extends HTMLElement {
  static get observedAttributes() {
    return ["data-video-id", "data-video-provider"];
  }

  // render this component if id or provider changes
  attributeChangedCallback(prop) {
    if (prop === "data-video-id" || prop === "data-video-provider") {
      const videoId = this.dataset.videoId;
      if (videoId == undefined || videoId.length < 1) return;

      const videoProvider = this.dataset.videoProvider;
      if (videoProvider === "youtube") {
        this.innerHTML = `
        <iframe width="560" height="315"
        src="https://www.youtube-nocookie.com/embed/${videoId}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen></iframe>`;
      } else if (videoProvider === "vimeo") {
        this.innerHTML = `
        <iframe width="560" height="315"
        src="https://player.vimeo.com/video/${videoId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
        title="Vimeo video player"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen></iframe>`;
      }
    }
  }
}

customElements.define("video-embed", VideoEmbed);
