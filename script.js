/* =========================================
   PHANTOMX
   Main Website Controller
========================================= */


/* =========================================
   CONFIG
========================================= */

const CONFIG = {

    gamesFile: "data/games.json",

    siteFile: "data/site.json",

    socialsFile: "data/socials.json",

    crowCount: 12

};


/* =========================================
   HELPERS
========================================= */

const $ = (selector) =>
    document.querySelector(selector);


const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));


/* =========================================
   CINEMATIC INTRO
========================================= */

async function startIntro() {

    const intro = $("#intro");

    if (!intro) return;

    await sleep(2200);

    intro.classList.add("hide");

    setTimeout(() => {

        intro.remove();

    }, 900);

}


/* =========================================
   CROW SYSTEM
========================================= */

function createCrow() {

    const crow = document.createElement("div");

    crow.className = "crow";


    const body = document.createElement("div");

    body.className = "crow-body";


    const head = document.createElement("div");

    head.className = "crow-head";


    const eye = document.createElement("div");

    eye.className = "crow-eye";


    const leftWing =
        document.createElement("div");

    leftWing.className =
        "crow-wing-left";


    const rightWing =
        document.createElement("div");

    rightWing.className =
        "crow-wing-right";


    crow.appendChild(body);

    crow.appendChild(head);

    crow.appendChild(eye);

    crow.appendChild(leftWing);

    crow.appendChild(rightWing);


    return crow;

}


function spawnCrow() {

    const layer =
        $("#crowLayer");

    if (!layer) return;


    const crow =
        createCrow();


    const startSide =
        Math.random() > .5
            ? "left"
            : "right";


    const startY =
        Math.random() * 80 + 5;


    const endY =
        Math.random() * 80 + 5;


    const duration =
        Math.random() * 7000 + 7000;


    const size =
        Math.random() * .7 + .55;


    const direction =
        startSide === "left"
            ? 1
            : -1;


    crow.style.top =
        `${startY}%`;


    crow.style.left =
        startSide === "left"
            ? "-100px"
            : "calc(100% + 100px)";


    crow.style.transform =
        `scale(${size}) scaleX(${direction})`;


    layer.appendChild(crow);


    const animation =
        crow.animate(

            [

                {

                    left:
                        startSide === "left"
                            ? "-100px"
                            : "calc(100% + 100px)",

                    top:
                        `${startY}%`,

                    opacity: 0

                },

                {

                    left:
                        startSide === "left"
                            ? "20%"
                            : "80%",

                    top:
                        `${(startY + endY) / 2}%`,

                    opacity: .85,

                    offset: .35

                },

                {

                    left:
                        startSide === "left"
                            ? "calc(100% + 100px)"
                            : "-100px",

                    top:
                        `${endY}%`,

                    opacity: 0

                }

            ],

            {

                duration,

                easing:
                    "cubic-bezier(.25,.7,.2,1)",

                fill: "forwards"

            }

        );


    const left =
        crow.querySelector(
            ".crow-wing-left"
        );


    const right =
        crow.querySelector(
            ".crow-wing-right"
        );


    left.animate(

        [

            { transform: "rotate(25deg)" },

            { transform: "rotate(-45deg)" },

            { transform: "rotate(25deg)" }

        ],

        {

            duration: 330,

            iterations: Infinity

        }

    );


    right.animate(

        [

            { transform: "rotate(-25deg)" },

            { transform: "rotate(45deg)" },

            { transform: "rotate(-25deg)" }

        ],

        {

            duration: 330,

            iterations: Infinity

        }

    );


    animation.finished
        .catch(() => {})
        .finally(() => {

            crow.remove();

        });

}


function startCrowSystem() {

    for (
        let i = 0;
        i < CONFIG.crowCount;
        i++
    ) {

        setTimeout(
            spawnCrow,
            Math.random() * 6000
        );

    }


    setInterval(

        () => {

            spawnCrow();

        },

        3000

    );

}


/* =========================================
   COPY SCRIPT
========================================= */

function setupCopyButton() {

    const button =
        $("#copyButton");

    const code =
        $("#loaderCode");

    const notification =
        $("#copyNotification");


    if (!button || !code) return;


    button.addEventListener(
        "click",
        async () => {

            const text =
                code.textContent.trim();


            try {

                await navigator.clipboard
                    .writeText(text);

            }

            catch {

                const area =
                    document.createElement(
                        "textarea"
                    );

                area.value = text;

                area.style.position =
                    "fixed";

                area.style.opacity = "0";

                document.body.appendChild(
                    area
                );

                area.select();

                document.execCommand(
                    "copy"
                );

                area.remove();

            }


            button.innerHTML =
                "Copied ✓";


            if (notification) {

                notification.classList.add(
                    "show"
                );

            }


            setTimeout(() => {

                button.innerHTML =
                    'Copy <span>⧉</span>';


                if (notification) {

                    notification.classList.remove(
                        "show"
                    );

                }

            }, 1800);

        }
    );

}


/* =========================================
   GAMES
========================================= */

async function loadGames() {

    const grid =
        $("#gamesGrid");

    if (!grid) return;


    try {

        const response =
            await fetch(
                CONFIG.gamesFile,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not load games.json"
            );

        }


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


        games.forEach(
            (game, index) => {

                const card =
                    createGameCard(
                        game,
                        index
                    );


                grid.appendChild(card);

            }
        );

    }

    catch (error) {

        console.error(error);


        grid.innerHTML = `

            <div class="loading-card">

                Unable to load games.

            </div>

        `;

    }

}


function createGameCard(
    game,
    index
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "game-card";


    const online =
        Boolean(game.online);


    const statusText =
        online
            ? "● ONLINE"
            : "● OFFLINE";


    const image =
        game.image ||
        "assets/logo/phantomx.png";


    const url =
        game.url || "#";


    card.innerHTML = `

        <div class="game-image">

            <img
                src="${escapeHtml(image)}"
                alt="${escapeHtml(game.name || "Game")}"
                loading="lazy"
                onerror="this.style.display='none'"
            >

            <div class="game-overlay"></div>

            <div class="game-status ${online ? "online" : "offline"}">

                ${statusText}

            </div>

        </div>


        <div class="game-info">

            <h3>

                ${escapeHtml(
                    game.name ||
                    "Unknown Game"
                )}

            </h3>


            <p>

                ${escapeHtml(
                    game.description ||
                    "PhantomX supported game."
                )}

            </p>


            <div class="game-bottom">

                <span>

                    ${online
                        ? "Available now"
                        : "Currently offline"}

                </span>


                <a
                    class="play-button ${online ? "" : "disabled"}"
                    href="${escapeHtml(url)}"
                    target="_blank"
                    rel="noopener"
                >

                    ${online
                        ? "PLAY →"
                        : "OFFLINE"}

                </a>

            </div>

        </div>

    `;


    card.style.animation =
        `fadeUp .6s ${index * .08}s both`;


    return card;

}


/* =========================================
   SITE DATA
========================================= */

async function loadSiteData() {

    try {

        const response =
            await fetch(
                CONFIG.siteFile,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) return;


        const data =
            await response.json();


        const developer =
            data.developer;


        if (developer) {

            const name =
                $("#developerName");


            const discord =
                $("#developerDiscord");


            const status =
                $("#developerStatus");


            if (name) {

                name.textContent =
                    developer.name ||
                    "Cypher";

            }


            if (discord) {

                discord.textContent =
                    developer.discord ||
                    "1a8f";

            }


            if (status) {

                status.textContent =
                    developer.online
                        ? "ONLINE"
                        : "OFFLINE";

            }

        }


        if (data.status) {

            const siteStatus =
                $("#siteStatus");


            if (siteStatus) {

                siteStatus.textContent =
                    data.status.text ||
                    "PhantomX is online";

            }

        }

    }

    catch (error) {

        console.warn(
            "site.json:",
            error
        );

    }

}


/* =========================================
   SOCIALS / DISCORD
========================================= */

async function loadSocials() {

    try {

        const response =
            await fetch(
                CONFIG.socialsFile,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) return;


        const data =
            await response.json();


        const discord =
            data.discord;


        const button =
            $("#discordButton");


        if (
            button &&
            discord &&
            discord.invite
        ) {

            button.href =
                discord.invite;

        }

    }

    catch (error) {

        console.warn(
            "socials.json:",
            error
        );

    }

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================
   SCROLL REVEAL
========================================= */

function setupScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".loader-card, .game-card, .developer-card, .discord-panel"
        );


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.animate(

                                [

                                    {
                                        opacity: 0,

                                        transform:
                                            "translateY(30px)"
                                    },

                                    {
                                        opacity: 1,

                                        transform:
                                            "translateY(0)"
                                    }

                                ],

                                {

                                    duration: 700,

                                    easing:
                                        "cubic-bezier(.2,.7,.2,1)",

                                    fill:
                                        "forwards"

                                }

                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: .12
            }

        );


    elements.forEach(
        element =>
            observer.observe(element)
    );

}


/* =========================================
   MOUSE PARALLAX
========================================= */

function setupParallax() {

    const background =
        document.querySelector(
            ".background"
        );


    if (!background) return;


    window.addEventListener(
        "mousemove",
        event => {

            const x =
                (event.clientX /
                    window.innerWidth -
                    .5) * 20;


            const y =
                (event.clientY /
                    window.innerHeight -
                    .5) * 20;


            background.style.transform =
                `translate(${x * .12}px, ${y * .12}px)`;

        }
    );

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupCopyButton();

        setupScrollReveal();

        setupParallax();

        startCrowSystem();

        await Promise.allSettled([

            loadGames(),

            loadSiteData(),

            loadSocials()

        ]);

        startIntro();

    }
);
