document.addEventListener('DOMContentLoaded', () => {
    const ReelsInfo = {
        reel7: { reel_thumbnail: "../../assets/images/thumbnails/reel7.jpg", reel_link: "https://youtube.com/shorts/VeHQWV3hIuE?si=eVKO_r4WY8kRpaO9" },
        reel1: { reel_thumbnail: "../../assets/images/thumbnails/reel1.jpg", reel_link: "https://youtube.com/shorts/UyyaLYmnkF4?si=ydejGH_MoCxuLG5q" },
        reel8: { reel_thumbnail: "../../assets/images/thumbnails/reel8.jpg", reel_link: "https://youtube.com/shorts/3ExrERfvjro?si=HY-nFUdPynPxtc8Q" },
        reel5: { reel_thumbnail: "../../assets/images/thumbnails/reel5.jpg", reel_link: "https://youtube.com/shorts/b6wesIMRRhk?si=Kl9dqmEaqGU9Sz-O" },
        reel4: { reel_thumbnail: "../../assets/images/thumbnails/reel4.jpg", reel_link: "https://youtube.com/shorts/hpVi5oK_TeM?si=Yv-pPbDdJnwUqJm0" },
        reel3: { reel_thumbnail: "../../assets/images/thumbnails/reel3.jpg", reel_link: "https://youtube.com/shorts/5Zm1X-gFbAY?si=jIFqsOm9D17KHrw7" },
        reel2: { reel_thumbnail: "../../assets/images/thumbnails/reel2.jpg", reel_link: "https://youtube.com/shorts/cmJgmGSwi5c?si=sFaDtVL-TZaWD1Tz" },
        reel6: { reel_thumbnail: "../../assets/images/thumbnails/reel6.jpg", reel_link: "https://youtube.com/shorts/31Qbj-ElOZE?si=JBELGSYFzw6-WvCR" },
    };

    const catalog = document.getElementById('ctlg');

    const pattern = [1, 1, 2, 1, 2, 2, 2];

Object.values(ReelsInfo).forEach((e, i) => {
    const reel_box = document.createElement("div");
    reel_box.classList.add("reel_box");

    const height = pattern[i % pattern.length];
    reel_box.classList.add(height === 2 ? "tall" : "short");

    reel_box.style.backgroundImage = `url(${e.reel_thumbnail})`;
    reel_box.style.backgroundSize = "cover";
    reel_box.style.backgroundPosition = "center";

    const reel = document.createElement("a");
    reel.classList.add("reel");
    reel.href = e.reel_link;
    reel.target = "_blank"
    reel.rel = "noopener noreferrer";

    const playBtn = document.createElement("div")
    playBtn.classList.add("play_btn")
    const playBtnImg = document.createElement("img")
    playBtnImg.src = "../../assets/icons/play.svg"
    playBtnImg.alt = "play"

    playBtn.appendChild(playBtnImg)
    reel.appendChild(playBtn)
    reel_box.appendChild(reel);
    catalog.appendChild(reel_box);
});
});