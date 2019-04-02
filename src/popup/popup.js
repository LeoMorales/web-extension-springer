/**
 */

CSS_SCRIPT = `
.box {
    background: #f2f2f2;
    border-top: 2px solid rgba(51,51,51,.2);
    text-align: center;
    margin-top: 3%;
}

.box .cita-link {
  font-size: small;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 10vw;
  
}

.box .cita-link:hover {
  overflow: visible; 
  white-space: normal; 
  width: auto;
}

#box-cites-pdfs-list span{
  font-size: x-small;
  font-weight: bold;
}

`

function escucharClic() {
  
    document.addEventListener("click", (e) => {

        /**
         * Handler boton springerify.
         * Insertar el CSS del box en la tab activa,
         * y enviar el mensaje para aumentar la web del paper springer
         */
        function springerify(tabs) {
            browser.tabs.insertCSS({code: CSS_SCRIPT});
            browser.tabs.sendMessage(tabs[0].id, {
                command: "springerify"
            });
        }

        /**
        * Reset
        */
        function reset(tabs) {
            browser.tabs.removeCSS({code: hidePage})
                .then(() => {
                    browser.tabs.sendMessage(tabs[0].id, {
                    command: "reset",
                });
            });
        }

        /**
         * Error por console.
         */
        function informarError(error) {
            console.error(`Imposible de springerify: ${error}`);
        }

        /**
         * Responder a los eventos de clic segun el boton que corresponda
         */
        if (e.target.classList.contains("start")) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(springerify)
                .catch(informarError);
        }
        else if (e.target.classList.contains("reset")) {
            browser.tabs.reload();
            window.close();
            browser.tabs.query({active: true, currentWindow: true})
                .then(reset)
                .catch(informarError);
        }
    });
}

/**
 * En caso de un error al ejecutar el script,
 * aparece un mensaje reportandolo.-
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`No se pudo ejecutar el content script: ${error.message}`);
}


// MAIN:
escucharClic()
    .catch(reportExecuteScriptError);