(async () => {
    // Catch all errors and show to user...
    try {
        const static_default_json = {
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
        };
        const loaded_json_contents = JSON.stringify(JSON.parse(await localStorage.getItem('contents')), null, 2);
        if (loaded_json_contents === null || loaded_json_contents === undefined || loaded_json_contents === '{}' || loaded_json_contents === '' ||loaded_json_contents === 'null')
            await localStorage.setItem('contents', JSON.stringify(static_default_json));
    } catch (error) {
        const [, line, col] = error.stack.match(/(\d+):(\d+)/);
        alert(`Al parecer ocurrio un error. Notifica este error a el desarrollador:\n\n${error} ${line}:${col}`);
    }
})();