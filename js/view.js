"use strict";
const playPauseObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            if (video.readyState >= 2) {
                video.play();
            }
            else {
                video.oncanplay = () => {
                    video.play();
                    video.oncanplay = null;
                };
            }
        }
        else {
            if (video.oncanplay) {
                video.oncanplay = null;
            }
            else {
                video.pause();
            }
        }
    });
});
function getVideoSrc(src) {
    if (src.includes("poster_")) {
        const start = src.indexOf("poster_");
        const end = src.lastIndexOf(".");
        const name = src.substring(start + 7, end);
        return `assets/${name}.mp4`;
    }
    else {
        return null;
    }
}
const containers = document.getElementsByClassName("view-container");
for (const container of containers) {
    const block = container.getElementsByClassName("view-block")[0];
    const list = container.getElementsByClassName("view-list")[0];
    const video = block.getElementsByTagName("video")[0];
    const image = block.getElementsByTagName("img")[0];
    const first = list.firstElementChild;
    const videoSrc = getVideoSrc(first.src);
    if (videoSrc) {
        video.style.display = "block";
        video.src = videoSrc;
    }
    else {
        image.style.display = "block";
        image.src = first.src;
    }
    playPauseObserver.observe(video);
    if (list.children.length > 1) {
        list.style.display = "flex";
        let selected = first;
        selected.classList.add("active");
        for (const child of list.children) {
            const childImage = child;
            const videoSrc = getVideoSrc(childImage.src);
            childImage.onclick = () => {
                if (selected != childImage) {
                    if (videoSrc) {
                        const replay = video.style.display == "block";
                        video.style.display = "block";
                        image.style.display = "none";
                        video.src = videoSrc;
                        if (replay) {
                            if (video.readyState >= 2) {
                                video.play();
                            }
                            else {
                                video.oncanplay = () => {
                                    video.play();
                                    video.oncanplay = null;
                                };
                            }
                        }
                    }
                    else {
                        video.style.display = "none";
                        image.style.display = "block";
                        image.src = childImage.src;
                    }
                    selected.classList.remove("active");
                    selected = childImage;
                    selected.classList.add("active");
                }
            };
        }
    }
}
const sections = [...document.getElementsByClassName("section")];
const tabButtons = [...document.getElementsByClassName("tabButton")];
const intersecting = new Array(tabButtons.length).fill(false);
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const i = sections.indexOf(entry.target);
        intersecting[i] = entry.isIntersecting;
        for (const btn of tabButtons) {
            btn.classList.remove("active");
        }
        for (let i = tabButtons.length - 1; i >= 0; i--) {
            if (intersecting[i]) {
                tabButtons[i].classList.add("active");
                break;
            }
        }
    });
});
for (const section of sections) {
    sectionObserver.observe(section);
}
for (let i = 0; i < tabButtons.length; i++) {
    const section = sections[i];
    tabButtons[i].onclick = () => {
        section.scrollIntoView({ behavior: 'smooth' });
    };
}
