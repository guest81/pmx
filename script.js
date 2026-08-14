const copyBtn = document.getElementById("copyBtn");

const loader = document.getElementById("loader");

const copyMessage = document.getElementById("copyMessage");


copyBtn.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(
            loader.textContent.trim()
        );


        copyBtn.innerHTML = "Copied ✓";

        copyMessage.classList.add("show");


        setTimeout(() => {

            copyBtn.innerHTML =
                'Copy <span>⧉</span>';

            copyMessage.classList.remove("show");

        }, 1800);


    } catch {

        const range =
            document.createRange();

        range.selectNodeContents(loader);


        const selection =
            window.getSelection();

        selection.removeAllRanges();

        selection.addRange(range);


        document.execCommand("copy");


        selection.removeAllRanges();


        copyBtn.textContent =
            "Copied ✓";

    }

});


/* Scroll animations */

const revealItems =
    document.querySelectorAll(
        ".feature, .code-card, .about-panel, .about-art"
    );


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.animation =
                        "fadeUp .65s both";

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealItems.forEach((element) => {

    observer.observe(element);

});
