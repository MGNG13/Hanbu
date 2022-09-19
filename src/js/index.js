(() => {
    document.addEventListener("DOMContentLoaded", async () => {
        // Catch all errors and show to user...
        try {
            // elements
            const alert_root = document.getElementById("alert_root");
            const alert_message = document.getElementById("alert_message");
            const button_reload = document.getElementById("button_reload");
            const contents_menu = document.getElementById("contents_menu");
            const contents_contents = document.getElementById("contents_contents");

            // onstart
            const pwa_title = "Hanbu";
            document.title = `${pwa_title} - Home`;

            // functions
            function showAlert(message) {
                document.title = `${pwa_title} - ${message}`;
                alert_message.textContent = message;
                alert_root.style.display = "block";
                setTimeout(() => {
                    alert_root.style.display = "none";
                    document.title = `${pwa_title} - Home`;
                }, 1000);
            }

            function getId(value) {
                return randomizeString(randomizeString((value + "").replace(" ", "").replace("\n", "").toLowerCase() + Math.floor(Math.random() * new Date().getTime())));
            }

            function randomizeString(string) {
                return string.split("").sort(() => { return 0.3 - Math.random() }).join("");
            }

            async function getSavedContent() {
                try {
                    const content = await localStorage.getItem("contents");
                    return JSON.parse(content);
                } catch (error) {
                    return {};
                }
            }

            function shuffleArray(array) {
                let currentIndex = array.length, randomIndex;
                // While there remain elements to shuffle.
                while (currentIndex != 0) {
                    // Pick a remaining element.
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    // And swap it with the current element.
                    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
                }
                return array;
            }

            async function loadContentAndInner(json) {
                // remove all elements
                contents_menu.innerHTML = "";
                contents_contents.innerHTML = "";

                const keysTitle = Object.keys(json);

                let menuHtml = "";
                let contentElements = [];
                let answersQuestions = [];

                for (let keysTitleIndex in keysTitle) {
                    const jsonKeysFromTitle = json[keysTitle[keysTitleIndex]];
                    const title = keysTitle[keysTitleIndex];

                    let htmlContent = "";
                    htmlContent += `<p class="contents_menu_title">${title}</p>`;
                    for (let subcontentTitle in jsonKeysFromTitle) {
                        const id = getId(title) + getId(subcontentTitle);
                        htmlContent += `<p id="${id}" class="contents_menu_subcontent_title">${subcontentTitle}</p>`;
                        // save all content in accesible json
                        contentElements.push({
                            "id": id,
                            "title": title,
                            "subcontent": subcontentTitle,
                            "content": JSON.parse(JSON.stringify(jsonKeysFromTitle[subcontentTitle]))
                        });
                    }
                    menuHtml += htmlContent;
                }

                // replace all elements
                contents_menu.innerHTML = menuHtml;

                // handler drag n drop
                document.ondragover = (event) => event.preventDefault();
                document.ondragstart = (event) => event.dataTransfer.setData("text", event.target.id);
                document.ondrop = (event) => {
                    event.preventDefault();

                    if (event.target.localName === "p" && event.target.className === "contents_content_questions_item" && event.target.childElementCount <= 0 ||
                        event.target.localName === "div" && event.target.className === "contents_content_draggable"
                    ) {
                        // move drag n drop element
                        event.target.appendChild(document.getElementById(event.dataTransfer.getData("text")));

                        const targetElement = document.getElementById(event.dataTransfer.getData("text"));

                        if (event.target.getAttribute("reference") !== null)
                            answersQuestions.push(JSON.parse(`{"${targetElement.textContent}": "${event.target.textContent.replace(targetElement.textContent, '')}"}`));
                        else
                            answersQuestions = answersQuestions.filter((answerKey) => Object.keys(answerKey)[0] !== targetElement.textContent);

                        // una vez terminado el cuestionario
                        let correctAnswersCount = 0;
                        let correctAnswersArray = [];

                        if (answersQuestions.length === 4) {
                            // todas las respuestas del usuario
                            const correctAnswers = contentElements.find(element => element.id === event.target.getAttribute("reference")).content;

                            for (let loopIndex in answersQuestions) {
                                // respuesta del usuario - Unica del bucle
                                const userQuestionAnswer = answersQuestions[loopIndex];
                            }
                           
                            alert(`Tuviste ${correctAnswersCount} aciertos.\nSon:\n\n${correctAnswersArray.toString()}`);
                        }
                    }
                }

                // on click in document
                document.onclick = (event) => {
                    const element = event.target;

                    // menu handler
                    if (element.localName === "p" && element.className === "contents_menu_subcontent_title")
                        for (let indexContentElement in contentElements)
                            if (contentElements[indexContentElement].id === element.id) {
                                // remove all elements in content section
                                contents_contents.innerHTML = "";

                                // data
                                const jsonContent = contentElements[indexContentElement].content;
                                const keys = Object.keys(jsonContent);

                                // html logic
                                let htmlBase = `<p class="contents_contents_title">${contentElements[indexContentElement].title} ➤ ${contentElements[indexContentElement].subcontent}</p>`;
                                let htmlDraggable = "";
                                let htmlQuestions = "";

                                let htmlDraggableArray = [];
                                let htmlQuestionsArray = [];

                                htmlDraggable += `<div class="contents_content_draggable">`;
                                htmlQuestions += `<div class="contents_content_questions">`;
                                for (let index in keys) {
                                    htmlDraggableArray.push(`<p id="${getId(contentElements[indexContentElement].subcontent)}" reference="${element.id}" draggable="true" class="contents_content_draggable_item">${keys[index]}</p>`);
                                    htmlQuestionsArray.push(`<p reference="${element.id}" class="contents_content_questions_item">${jsonContent[keys[index]]}</p>`);
                                }
                                htmlQuestions += shuffleArray(htmlQuestionsArray).join('');
                                htmlDraggable += shuffleArray(htmlDraggableArray).join('');

                                htmlQuestions += `</div>`;
                                htmlDraggable += `</div>`;

                                htmlBase += htmlDraggable;
                                htmlBase += htmlQuestions;

                                // inner to document
                                contents_contents.innerHTML = htmlBase;
                                break;
                            }
                }
            }

            // events
            await loadContentAndInner(await getSavedContent());
            showAlert("Contenidos cargados exitosamente.");

            button_reload.onclick = async () => {
                await loadContentAndInner(await getSavedContent());
                showAlert("Datos recargados exitosamente.");
            }
        } catch (error) {
            const [, line, col] = error.stack.match(/(\d+):(\d+)/);
            alert(`Al parecer ocurrio un error. Notifica este error a el desarrollador:\n\n${error} ${line}:${col}`);
        }
    });
})();
