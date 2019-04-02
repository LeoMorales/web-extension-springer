(function() {
    /**
    * https://link.springer.com/article/10.1007/s11424-013-2291-2
    */

    function Reference(id, title, gs_link) {
        this.id = id,
        this.title = title,
        this.gs_link = gs_link,  // gs -> google scholar
        this.pdf_link = '-',
        this.status_pdf = '-'
    }

    Reference.prototype.search_pdf_google_scholar = function(){
        console.log('solicitando pdf', this.gs_link);
        if(this.gs_link == undefined)
            return;
        fetch(this.gs_link, {mode: 'no-cors'})
            .then(response => response.text())
            .then(content => {
                pdf_link = $(content).find('.gs_or_ggsm a').attr('href');
                this.pdf_link = pdf_link;
                if (pdf_link !== undefined) {
                    var citado = $(content).find('.gs_fl a:nth-child(3)').first().text();
                    preview_title = ' '.concat(this.title.split(',').slice(0, -1));
                    $( "#box-cites-pdfs-list" ).append(
                        `<li>
                            <svg height="30px" width="30px" viewBox="-169 -76 800 800"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm250.2-143.7c-12.2-12-47-8.7-64.4-6.5-17.2-10.5-28.7-25-36.8-46.3 3.9-16.1 10.1-40.6 5.4-56-4.2-26.2-37.8-23.6-42.6-5.9-4.4 16.1-.4 38.5 7 67.1-10 23.9-24.9 56-35.4 74.4-20 10.3-47 26.2-51 46.2-3.3 15.8 26 55.2 76.1-31.2 22.4-7.4 46.8-16.5 68.4-20.1 18.9 10.2 41 17 55.8 17 25.5 0 28-28.2 17.5-38.7zm-198.1 77.8c5.1-13.7 24.5-29.5 30.4-35-19 30.3-30.4 35.7-30.4 35zm81.6-190.6c7.4 0 6.7 32.1 1.8 40.8-4.4-13.9-4.3-40.8-1.8-40.8zm-24.4 136.6c9.7-16.9 18-37 24.7-54.7 8.3 15.1 18.9 27.2 30.1 35.5-20.8 4.3-38.9 13.1-54.8 19.2zm131.6-5s-5 6-37.3-7.8c35.1-2.6 40.9 5.4 37.3 7.8z"></path></svg>
                            <a class='cita-link' href='${pdf_link}'>
                                ${preview_title.slice(0, 90)}[...]
                            </a>
                            <br>
                            <span> ${citado} </span>
                        </li>`
                    );

                }
            })
    }

    Reference.prototype.has_gs_link = function(){
        return this.gs_link !== undefined;
    }
  
    /**
    * Handler del mensaje recibido:
    */
    function initSpringerify() {

    console.log('initSpringerify');

    let titulo_paper = document.querySelector(".ArticleTitle").textContent;
    var referencias = [];

    let citas = document.querySelectorAll("#Bib1 .BibliographyWrapper .Citation");
    for (let i = 0; i < citas.length; i++) {
        referencias.push(
            new Reference(
                i,
                citas[i].textContent,
                $(citas[i]).find('.OccurrenceGS a:first').attr('href')
            )
        );
    }

    referencias.filter(referencia => referencia.has_gs_link())
        //.slice(0, 3)  // solo top 3?
        .forEach(function(referencia) {
            referencia.search_pdf_google_scholar();
        });

    // crear una cajita para appendear al body
    // La unsorted list se va llenando a medida que llegan la 
    // las respuestas de las peticiones fetch
    template = `
    <div class="box">
        <div id="box-header">
            <h2>Citas (${citas.length})</h2>
        </div>
        <div class="box-content">
            <ul id="box-cites-pdfs-list">
            </ul>
        </div>
    </div>
    `
    let fragment = document.createRange().createContextualFragment(template);
    $(".main-sidebar-left__content").append(fragment);

    }

    /**
    * Quedarse escuchando el mensaje springerify:
    */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "springerify") {
          initSpringerify();
        } else {
          console.log('--');
        }
    });

})();
