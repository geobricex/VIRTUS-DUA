
console.log("Cargar artyomJS");

// creamos un flag para saber si tenemos adblocker
let isAdBlockEnabled = false;

// creamos un elemento div y lo iniciamos con una clase
// que sabemos que el adblocker eliminaría
const ad = document.createElement('div');
ad.innerHTML = '&nbsp;'
ad.className = 'adsbox'
// añadimos nuestra simulación de anuncio en el body
document.body.appendChild(ad);

// ahora dejamos 100ms para que el adblocker haga su trabajo
// y entonces veremos si el elemento sigue visible
window.setTimeout(() => {
    console.log("test");
    // si el elemento no tiene altura, es que
    // el AdBlocker se lo ha cargado
    isAdBlockEnabled = ad.offsetHeight === 0
    // eliminamos el "falso" anuncio
    ad.remove()
    console.log("resultado ads: " + isAdBlockEnabled);
    if (isAdBlockEnabled) {
        alter("Quita tu bloqueado, mañoso");
        // codigo a ejecutar si el adblocker está activado
    }
}, 100);


var artyom = new Artyom();
//https://codepen.io/mrtyn/pen/bGNVowB

function startContinuousArtyom() {
    artyom.fatality();
    setTimeout(function () {

        artyom.initialize({
            lang: "es-ES",
            continuous: true, // Artyom will listen forever
            debug: false, // Show what recognizes in the Console
            listen: true, // Start listening after this
            speed: 0.9, // Talk a little bit slow
            mode: "normal" // This parameter is not required as it will be normal by default
        }).then(function () {
            console.log("Ready to work!");
        });

        artyom.addCommands([
            {
                indexes: ["a", "avión", "avion"],
                action: function (i) {
                    console.log("Literal A");
                    artyom.say("Literal A");
                }
            }, {
                indexes: ["b", "burro", "bicicleta"],
                action: function (i) {
                    console.log("Literal B");
                    artyom.say("Literal B");
                }
            }, {
                indexes: ["c", "conejo", "caballo"],
                action: function (i) {
                    console.log("Literal c");
                    artyom.say("Literal C");
                }
            }, {
                indexes: ["d", "dedo", "delfin"],
                action: function (i) {
                    console.log("Literal d");
                    artyom.say("Literal d");
                }
            }, {
                indexes: ["e", "elefante"],
                action: function (i) {
                    console.log("Literal e");
                    artyom.say("Literal e");
                }
            }, {
                indexes: ["f", "flor", , "foca"],
                action: function (i) {
                    console.log("Literal f");
                    artyom.say("Literal f");
                }
            }
        ]);

        // Or the artisan mode to write less

        artyom.on(["Good morning"]).then(function (i) {
            console.log("Triggered");
        });

        artyom.say("Buenos días, indique el literal correcto");

        artyom.say("buenos dias", {
            onStart: function () {
                console.log("Talking ...");
            },
            onEnd: function () {
                console.log("I said all that i knew");
            }
        });

        var UserDictation = artyom.newDictation({
            continuous: true, // Enable continuous if HTTPS connection
            onResult: function (text) {
                // Do something with the text
                console.log(text);
            },
            onStart: function () {
                console.log("Dictation started by the user");
            },
            onEnd: function () {
                alert("Dictation stopped by the user");
            }
        });

        UserDictation.start();
        artyom.simulateInstruction("conejo");
    }, 250);
}

console.log("Fin _ Cargar artyomJS");
startContinuousArtyom();

///////////////////////////////////////////////////////////////////
/*
const artyom = new Artyom();
const recognised = document.getElementById("recognised");

// This function activates artyom and will listen all that you say forever (requires https conection, otherwise a dialog will request if you allow the use of the microphone)
function startContinuousArtyom() {
    artyom.fatality();
    setTimeout(function () {
        artyom
            .initialize({
                lang: "es-ES",
                continuous: true, // Artyom will listen forever
                listen: true, // Start recognizing
                debug: true, // Show everything in the console
                speed: 1 // talk normally
            })
            .then(function () {
                console.log("Ready to work!");
            });
        artyom.redirectRecognizedTextOutput(function (text, isFinal) {
            recognised.innerText = text;
        });
    }, 250);
}

const thingsToSay = {
    "where am i": "Camp JS",
    "what day is it": "Sunday",
    "who am i": "you tell me"
};

artyom.on("*", true).then((i, wildcard) => {
    recognised.innerText = wildcard;
    var commands = Object.keys(thingsToSay);
    for (let cmd of commands) {
        if (wildcard.toLowerCase().indexOf(cmd) > -1) {
            artyom.say(thingsToSay[wildcard]);
        }
    }
});

startContinuousArtyom();*/
