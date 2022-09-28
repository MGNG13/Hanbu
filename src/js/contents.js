(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        // Catch all errors and show to user...
        try {
            // elements
            const textarea_contents = document.getElementById('textarea_contents');
            const button_save = document.getElementById('button_save');
            const button_close = document.getElementById('button_close');
            const button_formatter = document.getElementById('button_formatter');

            // onstart
            const pwa_title = 'Hanbu';
            document.title = `${pwa_title} - Contents`;

            // functions
            function validateJSON(json) {
                const keys = Object.keys(json);
                if (keys.length <= 0)
                    return false;
                for (let index in keys) {
                    const key = json[keys[index]];
                    if (Object.keys(key).length <= 0)
                        return false;
                    for (let index in key)
                        if (Object.keys(key[index]).length <= 0)
                            return false;
                }
                return true;
            }

            async function getSavedContent() {
                try {
                    const content = await localStorage.getItem('contents');
                    return JSON.parse(content);
                } catch (error) {
                    return {};
                }
            }

            function getExampleJSON() {
                return JSON.stringify({
                    'Lesson1': {
                        'Sub1': {
                            '1-0': '1-1',
                            '2-0': '2-1',
                            '3-0': '3-1'
                        },
                        'Sub2': {
                            '5-0': '5-1',
                            '6-0': '6-1',
                            '7-0': '7-1'
                        }
                    }
                }, null, 2);
            }

            function setRowTextarea(textarea) {
                let size = textarea.value.split('\n').length;
                size = size <= 1 ? 0 : size + 1;
                textarea.rows = size;
            }

            // events
            const loaded_json_contents = JSON.stringify(await getSavedContent(), null, 2);
            textarea_contents.value = (loaded_json_contents === null || loaded_json_contents === undefined || loaded_json_contents === '{}' || loaded_json_contents === '' || loaded_json_contents === 'null') ? '{}' : loaded_json_contents;
            setRowTextarea(textarea_contents);

            button_formatter.onclick = () => {
                try {
                    textarea_contents.value = JSON.stringify(JSON.parse(textarea_contents.value), null, 2);
                    const button_title = button_formatter.textContent;
                    button_formatter.textContent = `✓ ${button_title}`
                    setTimeout(() => {
                        button_formatter.textContent = button_title;
                        setRowTextarea(textarea_contents);
                    }, 500);
                } catch (error) {
                    alert(`Checa tu JSON. Cuenta con un error de Syntax que no permite formatear.\n\nError:\n\n${error}`);
                }
            }

            button_close.onclick = async () => {
                if (textarea_contents.value !== loaded_json_contents)
                    if (!confirm('Deseas salir sin guardar?'))
                        return;
                window.close();
            };

            button_save.onclick = async () => {
                if (!confirm('Deseas guardar los datos? No hay vuelta atras.'))
                    return;

                try {
                    const new_json_contents = JSON.parse(textarea_contents.value);
                    if (!validateJSON(new_json_contents)) {
                        alert(`Hay titulos donde no cuentan con titulos o tienen un error de estructura. Corrige esos problemas antes de guardar.\nEjemplo de un JSON correcto:\n\n${getExampleJSON()}`);
                        return;
                    }

                    await localStorage.setItem('contents', JSON.stringify(new_json_contents));
                    setRowTextarea(textarea_contents);

                    const message = 'Guardado exitosamente.';
                    document.title = `${pwa_title} - ${message}`;
                    alert(`${message}\nRecarga la pagina de Home para ver los contenidos actualizados.`);
                    document.location.reload();
                } catch (error) {
                    alert(`Al parecer usaste un syntax incorrecto en tu JSON.\nEjemplo de un JSON correcto:\n\n${getExampleJSON()}\n\nError => ${error}`);
                }
            }
        } catch (error) {
            const [, line, col] = error.stack.match(/(\d+):(\d+)/);
            alert(`Al parecer ocurrio un error. Notifica este error a el desarrollador:\n\n${error} ${line}:${col}`);
        }
    });
})();
