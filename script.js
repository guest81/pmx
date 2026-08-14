const CONFIG = {

    siteFile: "data/site.json",

    gamesFile: "data/games.json"

};


/* =========================
   HELPERS
========================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   INTRO
========================= */

function startIntro() {

    const intro =
        document.getElementById("intro");

    if (!intro) return;

    setTimeout(() => {

        intro.classList.add("hide");

    }, 2200);

}


/* =========================
   CROWS
========================= */

function createCrow() {

    const crow =
        document.createElement("div");

    crow.className = "crow";

    crow.innerHTML = `

        <div class="crow-body"></div>

        <div class="crow-head"></div>

        <div class="crow-eye"></div>

        <div class="crow-wing-left"></div>

        <div class="crow-wing-right"></div>

    `;

    return crow;
}


function spawnCrow() {

    const layer =
        document.getElementById("crowLayer");

    if (!layer) return;


    const crow =
        createCrow();


    const fromLeft =
        Math.random() > .5;


    const startY =
        Math.random() * 80;


    const endY =
        Math.random() * 80;


    const duration =
        7000 +
        Math.random() * 7000;


    const scale =
        .4 +
        Math.random() * .7;


    crow.style.top =
        `${startY}%`;


    crow.style.transform =
        `scale(${scale}) scaleX(${fromLeft ? 1 : -1})`;


    crow.style.left =
        fromLeft
            ? "-120px"
            : "calc(100% + 120px)";


    layer.appendChild(crow);


    const animation =
        crow.animate(

            [

                {
                    left:
                        fromLeft
                            ? "-120px"
                            : "calc(100% + 120px)",

                    top:
                        `${startY}%`,

                    opacity: 0

                },

                {

                    left:
                        fromLeft
                            ? "50%"
                            : "50%",

                    top:
                        `${(startY + endY) / 2}%`,

                    opacity: .7

                },

                {

                    left:
                        fromLeft
                            ? "calc(100% + 120px)"
                            : "-120px",

                    top:
                        `${endY}%`,

                    opacity: 0

                }

            ],

            {

                duration,

                easing:
                    "ease-in-out"

            }

        );


    const wingLeft =
        crow.querySelector(
            ".crow-wing-left"
        );


    const wingRight =
        crow.querySelector(
            ".crow-wing-right"
        );


    wingLeft.animate(

        [

            {
                transform:
                    "rotate(25deg)"
            },

            {
                transform:
                    "rotate(-45deg)"
            },

            {
                transform:
                    "rotate(25deg)"
            }

        ],

        {

            duration: 350,

            iterations:
                Infinity

        }

    );


    wingRight.animate(

        [

            {
                transform:
                    "rotate(-25deg)"
            },

            {
                transform:
                    "rotate(45deg)"
            },

            {
                transform:
                    "rotate(-25deg)"
            }

        ],

        {

            duration: 350,

            iterations:
                Infinity

        }

    );


    animation.finished
        .catch(() => {})
        .finally(() => {

            crow.remove();

        });

}


function startCrows() {

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        setTimeout(
            spawnCrow,
            i * 900
        );

    }


    setInterval(
        spawnCrow,
        3500
    );

}


/* =========================
   COPY
========================= */

function setupCopy() {

    const button =
        document.getElementById(
            "copyButton"
        );


    const code =
        document.getElementById(
            "loaderCode"
        );


    const notification =
        document.getElementById(
            "copyNotification"
        );


    if (!button || !code)
        return;


    button.addEventListener(
        "click",
        async () => {

            const text =
                code.textContent.trim();


            try {

                await navigator
                    .clipboard
                    .writeText(text);

            }

            catch {

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    text;


                document.body.appendChild(
                    textarea
                );


                textarea.select();


                document.execCommand(
                    "copy"
                );


                textarea.remove();

            }


            button.innerHTML =
                "Copied ✓";


            notification
                ?.classList
                .add("show");


            setTimeout(() => {

                button.innerHTML =
                    'Copy Script <span>⧉</span>';


                notification
                    ?.classList
                    .remove("show");

            }, 1800);

        }
    );

}


/* =========================
   GAMES
========================= */

async function loadGames() {

    const grid =
        document.getElementById(
            "gamesGrid"
        );


    if (!grid)
        return;


    try {

        const response =
            await fetch(
                `${CONFIG.gamesFile}?v=${Date.now()}`
            );


        if (!response.ok)
            throw new Error(
                "games.json not found"
            );


        const data =
            await response.json();


        const games =
            Array.isArray(data.games)
                ? data.games
                : [];


        grid.innerHTML = "";


        if (!games.length) {

            grid.innerHTML = `

                <div class="loading-card">

                    No supported games yet.

                </div>

            `;

            return;

        }


        games.forEach(game => {

            const online =
                game.online === true;


            const image =
                game.image ||
                "assets/images/phantomx-logo.png";


            const url =
                game.url || "#";


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                `game-card ${
                    online
                        ? ""
                        : "is-offline"
                }`;


            card.innerHTML = `

                <div class="game-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(game.name)}"
                        loading="lazy"
                    >

                    <div class="game-overlay"></div>

                    <div
                        class="
                            game-status
                            ${
                                online
                                    ? "online"
                                    : "offline"
                            }
                        "
                    >

                        <span></span>

                        ${
                            online
                                ? "ONLINE"
                                : "OFFLINE"
                        }

                    </div>

                </div>


                <div class="game-info">

                    <div class="game-type">
                        PHANTOMX SUPPORTED
                    </div>


                    <h3>
                        ${escapeHTML(
                            game.name
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            game.description
                        )}
                    </p>


                    <div class="game-bottom">

                        <div class="game-state">

                            <span></span>

                            ${
                                online
                                    ? "Available now"
                                    : "Currently offline"
                            }

                        </div>


                        ${
                            online
                                ? `

                                    <a
                                        class="play-button"
                                        href="${escapeHTML(url)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >

                                        PLAY →

                                    </a>

                                `
                                : `

                                    <span
                                        class="
                                            play-button
                                            disabled
                                        "
                                    >

                                        OFFLINE

                                    </span>

                                `
                        }

                    </div>

                </div>

            `;


            grid.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);


        grid.innerHTML = `

            <div class="loading-card">

                Failed to load games.

            </div>

        `;

    }

}


/* =========================
   SITE DATA
========================= */

async function loadSite() {

    try {

        const response =
            await fetch(
                `${CONFIG.siteFile}?v=${Date.now()}`
            );


        if (!response.ok)
            throw new Error(
                "site.json not found"
            );


        const data =
            await response.json();


        const discordURL =
            data.discordUrl ||
            data.socials?.discord ||
            "#";


        /* Developer name */

        const name =
            document.getElementById(
                "developerName"
            );


        if (name)
            name.textContent =
                data.developer ||
                "Cypher";


        /* Discord username */

        const discord =
            document.getElementById(
                "developerDiscord"
            );


        if (discord)
            discord.textContent =
                data.discord ||
                "1a8f";


        /* Developer avatar */

        const avatar =
            document.getElementById(
                "developerAvatar"
            );


        if (
            avatar &&
            data.developerImage
        ) {

            avatar.src =
                data.developerImage;

        }


        /* Discord links */

        [

            "navDiscord",

            "heroDiscord",

            "developerDiscordButton"

        ].forEach(id => {

            const element =
                document.getElementById(id);


            if (element)
                element.href =
                    discordURL;

        });


        /* Developer status */

        const isOnline =
            String(
                data.developerStatus ||
                "offline"
            ).toLowerCase() ===
            "online";


        const status =
            document.getElementById(
                "developerStatus"
            );


        const presence =
            document.getElementById(
                "developerPresence"
            );


        const avatarStatus =
            document.getElementById(
                "avatarStatus"
            );


        if (status) {

            status.textContent =
                isOnline
                    ? "ONLINE"
                    : "OFFLINE";

        }


        if (presence) {

            presence.classList.toggle(
                "online",
                isOnline
            );


            presence.classList.toggle(
                "offline",
                !isOnline
            );

        }


        if (avatarStatus) {

            avatarStatus.style.background =
                isOnline
                    ? "#43e58a"
                    : "#ff2932";

            avatarStatus.style.boxShadow =
                isOnline
                    ? "0 0 15px rgba(67,229,138,.5)"
                    : "0 0 15px rgba(255,30,40,.5)";

        }


        /* Website status */

        const siteStatus =
            document.getElementById(
                "siteStatus"
            );


        const siteOnline =
            String(
                data.siteStatus ||
                "offline"
            ).toLowerCase() ===
            "online";


        if (siteStatus) {

            siteStatus.textContent =
                siteOnline
                    ? "PHANTOMX ONLINE"
                    : "PHANTOMX OFFLINE";

        }

    }

    catch (error) {

        console.error(
            "Failed to load site data:",
            error
        );

    }

}


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startIntro();

        startCrows();

        setupCopy();

        loadGames();

        loadSite();

    }
);
