document.addEventListener('DOMContentLoaded', () => {
    const ReelsInfo = {
        reel1: { reel_thumbnail: "../../assets/images/thumbnails/reel1.jpg", reel_link: "https://www.instagram.com/reel/DQmbqAJjIXZ/?igsh=bnM0YmxwNmF6aHJo" },
        reel2: { reel_thumbnail: "../../assets/images/thumbnails/reel2.jpg", reel_link: "https://www.instagram.com/reel/DVolOW6jHcX/?igsh=MTByeWZ3OXAzcXJjaA==" },
        reel3: { reel_thumbnail: "../../assets/images/thumbnails/reel3.jpg", reel_link: "https://www.instagram.com/reel/DP1gEfsjCS_/?igsh=MW42NTg3ZnRveDRhbA==" },
        reel4: { reel_thumbnail: "../../assets/images/thumbnails/reel4.jpg", reel_link: "https://www.instagram.com/reel/DQjn3lAjOIL/?igsh=MXN6bHQ4amkyMWZhNg==" },
        reel5: { reel_thumbnail: "../../assets/images/thumbnails/reel5.jpg", reel_link: "https://www.instagram.com/reel/DQpJSSXCEs_/?igsh=MXJua2J2ZWNmeGp3Zg==" },
        reel6: { reel_thumbnail: "../../assets/images/thumbnails/reel6.jpg", reel_link: "https://www.instagram.com/reel/DQ9tDsfCMsP/?igsh=MWxtMXFiazdpNGJqNw==" },
        reel7: { reel_thumbnail: "../../assets/images/thumbnails/reel7.jpg", reel_link: "https://www.instagram.com/reel/DU05bblDJrc/?igsh=MXNodHJwZGRkeGh1MA==" },
        reel8: { reel_thumbnail: "../../assets/images/thumbnails/reel8.jpg", reel_link: "https://www.instagram.com/reel/DSDOEr5jAfl/?igsh=d2RtdDR5dXpmM2lo" },
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
        reel.style.cursor = "pointer";
        reel.href = e.reel_link;
        reel.target = "_blank";
        reel.rel = "noopener noreferrer";
        reel.style.display = "flex";
        reel.style.alignItems = "center";
        reel.style.justifyContent = "center";
        reel.style.textDecoration = "none";

        const playBtn = document.createElement("div");
        playBtn.classList.add("play_btn");
        const playBtnImg = document.createElement("img");
        playBtnImg.src = "../../assets/icons/play.svg";
        playBtnImg.alt = "play";
        playBtn.appendChild(playBtnImg);
        
        reel.appendChild(playBtn);
        reel_box.appendChild(reel);
        catalog.appendChild(reel_box);
    });
});
