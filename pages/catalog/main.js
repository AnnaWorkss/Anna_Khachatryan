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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if(!iframe) return;
            const videoId = iframe.getAttribute('data-id');

            if (entry.isIntersecting && !reelsModal.classList.contains("hidden")) {
                if (!iframe.src || iframe.src.includes('about:blank')) {
                    iframe.src = getYouTubeUrl(videoId);
                } else {
                    iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
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

    const getYouTubeUrl = (videoId) => {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&enablejsapi=1&rel=0&modestbranding=1&loop=1&playlist=${videoId}`;
    };

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
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 800);
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
            const direction = deltaY > 0 ? 1 : -1;
            scrollReels(direction);
            touchStartY = touchEndY;
            
            isScrolling = true;
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }, { passive: false });

    reelsModal.onclick = (e) => {
        if (e.target === reelsModal || e.target === reelsContainer) {
            closeModal();
        }
    };

    const closeModal = () => {
        reelsModal.classList.add("hidden");
        document.body.style.overflow = "auto";
        scrollHint.classList.remove("hidden");
        reelsContainer.querySelectorAll('iframe').forEach(iframe => {
            if(iframe.src && !iframe.src.includes('about:blank')) {
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
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.style.pointerEvents = 'none';

            reelItem.appendChild(iframe);
            reelsContainer.appendChild(reelItem);

            observer.observe(reelItem);
        }
    });
});