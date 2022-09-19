(async () => {
    // Catch all errors and show to user...
    try {
        const loaded_json_contents = JSON.stringify(JSON.parse(await localStorage.getItem("contents")), null, 2);
        if (loaded_json_contents === null || loaded_json_contents === undefined ||
            loaded_json_contents === "{}" || loaded_json_contents === "" ||
            loaded_json_contents === "null"
        ) await localStorage.setItem("contents", JSON.stringify({
            "Lesson 1": {
                "Subcontenido 1": {
                    "Coreano1": "Espanol1",
                    "Coreano2": "Espanol2",
                    "Coreano3": "Espanol3",
                    "Coreano4": "Espanol4"
                },
                "Subcontenido 2": {
                    "Coreano5": "Espanol5",
                    "Coreano6": "Espanol6",
                    "Coreano7": "Espanol7",
                    "Coreano8": "Espanol8"
                }
            },
            "Lesson 2": {
                "Subcontenido 1": {
                    "Coreano9": "Espanol9",
                    "Coreano10": "Espanol10",
                    "Coreano11": "Espanol11",
                    "Coreano12": "Espanol12"
                },
                "Subcontenido 2": {
                    "Coreano13": "Espanol13",
                    "Coreano14": "Espanol14",
                    "Coreano15": "Espanol15",
                    "Coreano16": "Espanol16"
                }
            }
        }));
    } catch (error) {
        const [, line, col] = error.stack.match(/(\d+):(\d+)/);
        alert(`Al parecer ocurrio un error. Notifica este error a el desarrollador:\n\n${error} ${line}:${col}`);
    }
})();