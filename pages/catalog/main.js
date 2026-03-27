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

    const SVG_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>`;
    const SVG_UNMUTED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;

    const isMobile = () => window.innerWidth <= 768;

    const getYouTubeUrl = (videoId) => {
        const mute = isMobile() ? 1 : 0;
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${mute}&enablejsapi=1&rel=0&modestbranding=1&loop=1&playlist=${videoId}&playsinline=1`;
    };

    const toggleMute = (iframe, muteBtn) => {
        const muted = muteBtn.dataset.muted === "true";
        if (muted) {
            iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            muteBtn.dataset.muted = "false";
            muteBtn.setAttribute("aria-label", "Mute");
            muteBtn.innerHTML = SVG_UNMUTED;
        } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
            muteBtn.dataset.muted = "true";
            muteBtn.setAttribute("aria-label", "Unmute");
            muteBtn.innerHTML = SVG_MUTED;
        }
    };

    // Reset button to the correct default state for the current device
    const resetMuteState = (muteBtn) => {
        if (isMobile()) {
            muteBtn.dataset.muted = "true";
            muteBtn.setAttribute("aria-label", "Unmute");
            muteBtn.innerHTML = SVG_MUTED;
        } else {
            muteBtn.dataset.muted = "false";
            muteBtn.setAttribute("aria-label", "Mute");
            muteBtn.innerHTML = SVG_UNMUTED;
        }
    };

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

    // Backup: on desktop, force unmute once the YouTube player is ready,
    // in case the browser ignored mute=0 in the URL
    window.addEventListener('message', (event) => {
        if (event.origin !== 'https://www.youtube.com' || isMobile()) return;
        try {
            const data = JSON.parse(event.data);
            if (data.event === 'onReady') {
                reelsContainer.querySelectorAll('iframe').forEach(iframe => {
                    if (iframe.contentWindow === event.source) {
                        iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                        iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
                    }
                });
            }
        } catch (e) {}
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (!iframe) return;
            const videoId = iframe.getAttribute('data-id');
            const muteBtn = entry.target.querySelector('.mute-btn');

            if (entry.isIntersecting && !reelsModal.classList.contains("hidden")) {
                if (muteBtn) resetMuteState(muteBtn);
                if (!iframe.src || iframe.src.includes('about:blank')) {
                    iframe.src = getYouTubeUrl(videoId);
                } else {
                    iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    if (isMobile()) {
                        iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                    } else {
                        iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                        iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
                    }
                }
            } else {
                if (iframe.src && !iframe.src.includes('about:blank')) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
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
        reelsContainer.querySelectorAll('iframe').forEach(iframe => {
            if (iframe.src && !iframe.src.includes('about:blank')) {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
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
                const iframe = targetReel.querySelector('iframe');
                if (iframe) {
                    const vId = iframe.getAttribute('data-id');
                    if (!iframe.src || iframe.src.includes('about:blank')) {
                        iframe.src = getYouTubeUrl(vId);
                    } else {
                        iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
                        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                        if (!isMobile()) {
                            iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                            iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
                        }
                    }
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

        const videoIdMatch = e.reel_link.match(/shorts\/([^?]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : "";
        if (videoId) {
            const reelItem = document.createElement("div");
            reelItem.classList.add("reel-item");
            reelItem.id = `reel-item-${i}`;
            reelItem.style.backgroundImage = `url(${e.reel_thumbnail})`;
            reelItem.style.backgroundSize = "cover";
            reelItem.style.backgroundPosition = "center";

            const iframe = document.createElement("iframe");
            iframe.setAttribute('data-id', videoId);
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            iframe.title = "YouTube Video Player";
            iframe.style.border = "none";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.style.pointerEvents = 'none';

            const muteBtn = document.createElement("button");
            muteBtn.classList.add("mute-btn");
            muteBtn.dataset.muted = isMobile() ? "true" : "false";
            muteBtn.setAttribute("aria-label", isMobile() ? "Unmute" : "Mute");
            muteBtn.innerHTML = isMobile() ? SVG_MUTED : SVG_UNMUTED;

            muteBtn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                toggleMute(iframe, muteBtn);
            });

            reelItem.addEventListener("click", () => {
                toggleMute(iframe, muteBtn);
            });

            reelItem.appendChild(iframe);
            reelItem.appendChild(muteBtn);
            reelsContainer.appendChild(reelItem);
            observer.observe(reelItem);
        }
    });
});
