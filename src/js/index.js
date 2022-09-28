(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        // Catch all errors and show to user...
        try {
            // elements
            const alert_root = document.getElementById('alert_root');
            const alert_message = document.getElementById('alert_message');
            const button_reload = document.getElementById('button_reload');
            const contents_menu = document.getElementById('contents_menu');
            const contents_contents = document.getElementById('contents_contents');

            // onstart
            const pwa_title = 'Hanbu';
            document.title = `${pwa_title} - Home`;

            // functions
            function showAlert(message) {
                document.title = `${pwa_title} - ${message}`;
                alert_message.textContent = message;
                alert_root.style.display = 'block';
                setTimeout(() => {
                    alert_root.style.display = 'none';
                    document.title = `${pwa_title} - Home`;
                }, 1000);
            }

            function getId(value) {
                return randomizeString(randomizeString((value + '').replace(' ', '').replace('\n', '').toLowerCase() + Math.floor(Math.random() * new Date().getTime())));
            }

            function randomizeString(string) {
                return string.split('').sort(() => { return 0.3 - Math.random() }).join('');
            }

            async function getSavedContent() {
                try {
                    const content = await localStorage.getItem('contents');
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
                contents_menu.innerHTML = '';
                contents_contents.innerHTML = '';

                const keysTitle = Object.keys(json);

                let menuHtml = '';

                let correctQuestions = [];
                let correctAnswersCount = 0;
                let correctAnswersArray = [];

                let contentElements = [];
                let answersQuestions = [];

                for (let keysTitleIndex in keysTitle) {
                    const jsonKeysFromTitle = json[keysTitle[keysTitleIndex]];
                    const title = keysTitle[keysTitleIndex];

                    let htmlContent = '';
                    htmlContent += `<p class='contents_menu_title'>${title}</p>`;
                    for (let subcontentTitle in jsonKeysFromTitle) {
                        const id = getId(title) + getId(subcontentTitle);
                        htmlContent += `<p id='${id}' class='contents_menu_subcontent_title'>${subcontentTitle}</p>`;
                        // save all content in accesible json
                        contentElements.push({
                            'id': id,
                            'title': title,
                            'subcontent': subcontentTitle,
                            'content': JSON.parse(JSON.stringify(jsonKeysFromTitle[subcontentTitle]))
                        });
                    }
                    menuHtml += htmlContent;
                }

                // replace all elements
                contents_menu.innerHTML = menuHtml;

                // handler drag n drop
                document.ondragover = (event) => event.preventDefault();
                document.ondragstart = (event) => event.dataTransfer.setData('id', event.target.id);
                document.ondrop = (event) => {
                    event.preventDefault();
                    try {
                        const targetElement = document.getElementById(event.dataTransfer.getData('id'));
                        if (event.target.localName === 'p' &&
                            event.target.className === 'contents_content_questions_item' &&
                            event.target.childElementCount === 0
                        ) {
                            answersQuestions.push(JSON.parse(`{"${targetElement.textContent}": "${event.target.textContent.replace(targetElement.textContent, '')}"}`));
                            event.target.appendChild(document.getElementById(event.dataTransfer.getData('id')));
                        }
                    } catch (ignored) {
                    } finally {
                        if (correctQuestions.length === answersQuestions.length) {
                            for (index in correctQuestions)
                                for (indexAnswers in answersQuestions)
                                    if (Object.keys(answersQuestions[indexAnswers])[0] === Object.keys(correctQuestions[index])[0]) {
                                        if (Object.values(answersQuestions[indexAnswers])[0] === Object.values(correctQuestions[index])[0]) {
                                            correctAnswersArray.push(JSON.parse(`{"${Object.keys(correctQuestions[index])[0]}":"${Object.values(correctQuestions[index])[0]}"}`));
                                            correctAnswersCount++;
                                        }
                                        break;
                                    }
                            const extraMsg = correctAnswersCount >= 1 ? `\n\n${JSON.stringify(correctAnswersArray, null, 4)}` : '';
                            alert(`Tuviste correctos ${correctAnswersCount}.${extraMsg}`);
                            window.location.reload();
                        }
                    }
                }

                document.onclick = (event) => {
                    const element = event.target;

                    // menu handler
                    if (element.localName === 'p' && element.className === 'contents_menu_subcontent_title')
                        for (let indexContentElement in contentElements)
                            if (contentElements[indexContentElement].id === element.id) {
                                // remove all elements in content section
                                contents_contents.innerHTML = '';

                                // data
                                const jsonContent = contentElements[indexContentElement].content;
                                const keys = Object.keys(jsonContent);

                                // html logic
                                let htmlBase = `<p class='contents_contents_title'>${contentElements[indexContentElement].title} ➤ ${contentElements[indexContentElement].subcontent}</p>`;
                                let htmlDraggable = '';
                                let htmlQuestions = '';

                                let htmlDraggableArray = [];
                                let htmlQuestionsArray = [];

                                htmlDraggable += `<div class='contents_content_draggable'>`;
                                htmlQuestions += `<div class='contents_content_questions'>`;
                                for (let index in keys) {
                                    correctQuestions.push(JSON.parse(`{"${keys[index]}":"${jsonContent[keys[index]]}"}`));
                                    htmlDraggableArray.push(`<p id='${getId(contentElements[indexContentElement].subcontent)}' reference='${element.id}' draggable='true' class='contents_content_draggable_item'>${keys[index]}</p>`);
                                    htmlQuestionsArray.push(`<p reference='${element.id}' class='contents_content_questions_item'>${jsonContent[keys[index]]}</p>`);
                                }
                                htmlQuestions += shuffleArray(htmlQuestionsArray).join('');
                                htmlDraggable += shuffleArray(htmlDraggableArray).join('');

                                htmlQuestions += `</div>`;
                                htmlDraggable += `</div>`;

                                htmlBase += htmlDraggable;
                                htmlBase += htmlQuestions;

                                // inner to document
                                contents_contents.innerHTML = htmlBase;
                                correctAnswersCount = 0;
                                correctAnswersArray = [];
                                answersQuestions = [];
                                break;
                            }
                }
            }

            // events
            await loadContentAndInner(await getSavedContent());
            showAlert('Contenidos cargados exitosamente.');

            button_reload.onclick = async () => {
                await loadContentAndInner(await getSavedContent());
                showAlert('Datos recargados exitosamente.');
            }
        } catch (error) {
            const [, line, col] = error.stack.match(/(\d+):(\d+)/);
            alert(`Al parecer ocurrio un error. Notifica este error a el desarrollador:\n\n${error} ${line}:${col}`);
        }
    });
})();
