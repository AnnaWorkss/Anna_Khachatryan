document.addEventListener('DOMContentLoaded', () => {
    const ReelsInfo = {
        reel7: { reel_thumbnail: "../../assets/images/thumbnails/reel7.jpg", reel_link: "../../assets/videos/reel7.mp4" },
        reel1: { reel_thumbnail: "../../assets/images/thumbnails/reel1.jpg", reel_link: "../../assets/videos/reel1.mp4" },
        reel8: { reel_thumbnail: "../../assets/images/thumbnails/reel8.jpg", reel_link: "../../assets/videos/reel8.mp4" },
        reel5: { reel_thumbnail: "../../assets/images/thumbnails/reel5.jpg", reel_link: "../../assets/videos/reel5.mp4" },
        reel4: { reel_thumbnail: "../../assets/images/thumbnails/reel4.jpg", reel_link: "../../assets/videos/reel4.mp4" },
        reel3: { reel_thumbnail: "../../assets/images/thumbnails/reel3.jpg", reel_link: "../../assets/videos/reel3.mp4" },
        reel2: { reel_thumbnail: "../../assets/images/thumbnails/reel2.jpg", reel_link: "../../assets/videos/reel2.mp4" },
        reel6: { reel_thumbnail: "../../assets/images/thumbnails/reel6.jpg", reel_link: "../../assets/videos/reel6.mp4" },
    };


    const isMobile = () => window.innerWidth <= 768;

    const catalog = document.getElementById('ctlg');
    const pattern = [1, 1, 2, 1, 2, 2, 2];

    const reelsModal = document.createElement("div");
    reelsModal.id = "reels-modal";
    reelsModal.classList.add("hidden");

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("close-modal");
    closeBtn.innerHTML = "&times;";
    reelsModal.appendChild(closeBtn);

    const reelsContainer = document.createElement("div");
    reelsContainer.classList.add("reels-scroll-container");
    reelsModal.appendChild(reelsContainer);

    const scrollHint = document.createElement("div");
    scrollHint.classList.add("scroll-hint");
    scrollHint.innerHTML = "<span>Scroll for more</span><div class='arrow-down'></div>";
    reelsModal.appendChild(scrollHint);

    document.body.appendChild(reelsModal);

    // Backup event listener for youtube is removed since we use HTML5 video

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const videoEl = entry.target.querySelector('video');
            if (!videoEl) return;
            const link = videoEl.getAttribute('data-link');

            if (entry.isIntersecting && !reelsModal.classList.contains("hidden")) {
                if (!videoEl.src) {
                    videoEl.src = link;
                }
                videoEl.currentTime = 0;
                videoEl.muted = false; // Try unmuted
                
                const playPromise = videoEl.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.warn("Unmuted autoplay prevented. Falling back to muted.", e);
                        // iOS/Android block unmuted autoplay on scroll. Mute it to force playback.
                        videoEl.muted = true;
                        videoEl.play().catch(err => console.warn("Muted autoplay also prevented", err));
                    });
                }
            } else {
                videoEl.pause();
            }
        });
    }, {
        root: reelsContainer,
        threshold: 0.6
    });

    let currentReelIndex = 0;
    let isScrolling = false;
    let scrollTimeout;

    const scrollReels = (direction) => {
        const items = Array.from(reelsContainer.querySelectorAll('.reel-item'));
        const targetIndex = (currentReelIndex + direction + items.length) % items.length;
        currentReelIndex = targetIndex;
        isScrolling = true;

        if (!scrollHint.classList.contains("hidden")) {
            scrollHint.classList.add("hidden");
        }

        reelsContainer.scrollTo({
            top: targetIndex * reelsContainer.clientHeight,
            behavior: 'smooth'
        });

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { isScrolling = false; }, 800);
    };

    reelsModal.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (!isScrolling && Math.abs(e.deltaY) > 10) {
            scrollReels(e.deltaY > 0 ? 1 : -1);
        }
    }, { passive: false });

    let touchStartY = 0;
    let touchTimeout;

    reelsModal.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    reelsModal.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isScrolling) return;
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        if (Math.abs(deltaY) > 40) {
            scrollReels(deltaY > 0 ? 1 : -1);
            touchStartY = touchEndY;
            isScrolling = true;
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => { isScrolling = false; }, 800);
        }
    }, { passive: false });

    reelsModal.onclick = (e) => {
        if (e.target === reelsModal || e.target === reelsContainer) closeModal();
    };

    const closeModal = () => {
        reelsModal.classList.add("hidden");
        document.body.style.overflow = "auto";
        scrollHint.classList.remove("hidden");
        reelsContainer.querySelectorAll('video').forEach(videoEl => {
            videoEl.pause();
        });
    };
    closeBtn.onclick = closeModal;

    Object.values(ReelsInfo).forEach((e, i) => {
        const reel_box = document.createElement("div");
        reel_box.classList.add("reel_box");
        const height = pattern[i % pattern.length];
        reel_box.classList.add(height === 2 ? "tall" : "short");
        reel_box.style.backgroundImage = `url(${e.reel_thumbnail})`;
        reel_box.style.backgroundSize = "cover";
        reel_box.style.backgroundPosition = "center";

        const reel = document.createElement("div");
        reel.classList.add("reel");
        reel.style.cursor = "pointer";

        reel.onclick = () => {
            reelsModal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
            const targetReel = document.getElementById(`reel-item-${i}`);
            if (targetReel) {
                currentReelIndex = Array.from(reelsContainer.querySelectorAll('.reel-item')).indexOf(targetReel);
                targetReel.scrollIntoView({ behavior: 'instant' });
                const videoEl = targetReel.querySelector('video');
                if (videoEl) {
                    const link = videoEl.getAttribute('data-link');
                    if (!videoEl.src) {
                        videoEl.src = link;
                    }
                    videoEl.currentTime = 0;
                    videoEl.muted = false; // Always unmuted
                    videoEl.play().catch(e => console.warn("Autoplay prevented", e));
                }
            }
        };

        const playBtn = document.createElement("div");
        playBtn.classList.add("play_btn");
        const playBtnImg = document.createElement("img");
        playBtnImg.src = "../../assets/icons/play.svg";
        playBtnImg.alt = "play";
        playBtn.appendChild(playBtnImg);
        reel.appendChild(playBtn);
        reel_box.appendChild(reel);
        catalog.appendChild(reel_box);

        if (e.reel_link) {
            const reelItem = document.createElement("div");
            reelItem.classList.add("reel-item");
            reelItem.id = `reel-item-${i}`;
            reelItem.style.backgroundImage = `url(${e.reel_thumbnail})`;
            reelItem.style.backgroundSize = "cover";
            reelItem.style.backgroundPosition = "center";

            const videoEl = document.createElement("video");
            videoEl.setAttribute('data-link', e.reel_link);
            videoEl.style.border = "none";
            videoEl.style.width = "100%";
            videoEl.style.height = "100%";
            videoEl.style.objectFit = "cover";
            videoEl.loop = true;
            videoEl.playsInline = true;
            videoEl.style.pointerEvents = 'none'; // pass clicks to reelItem

            // Allow user to tap the video to toggle mute state when unmute button is hidden
            reelItem.addEventListener("click", (ev) => {
                ev.stopPropagation();
                videoEl.muted = !videoEl.muted;
            });

            reelItem.appendChild(videoEl);
            reelsContainer.appendChild(reelItem);
            observer.observe(reelItem);
        }
    });
});
