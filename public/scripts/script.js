document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input')
    const reportList = document.querySelector('#reports');

    function fetchReports(searchQuery = '') {
        const url = searchQuery ?
            `http://192.168.5.23:3333/api/reports/search?searchQuery=${encodeURIComponent(searchQuery)}` :
            'http://192.168.5.23:3333/api/reports';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const overlay = document.getElementById('overlay');
                const pdfPreview = document.getElementById('pdf-preview');
                const popover = document.getElementById('popover-query');
                const formattedSql = popover.querySelector('.formatted-sql');
                const closeBtn = popover.querySelector('.close-btn');
                reportList.innerHTML = '';
                data.forEach(report => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('report');

                    listItem.innerHTML = `
                    <div class="content">
                        <span>${report.title}</span>
                        <hr>
                        <p>${report.description}</p>
                    </div>
                    <div class="links">
                        <a href="#" class="preview-pdf" data-url="/files/${report.url_pdf}">
                            <i class="ph ph-file-pdf"></i>
                        </a>
                        <a href="#" class="preview-sql" data-query="${report.query}">
                            <i class="ph ph-code"></i>
                        </a>
                        <a href="/files/${report.url_file}" download>
                            <i class="ph ph-download-simple"></i>
                        </a>
                    </div>
                `;

                    reportList.appendChild(listItem);
                });

                // Adiciona o evento de clique para os previews de PDF
                reportList.addEventListener('click', (event) => {
                    if (event.target.closest('.preview-pdf')) {
                        event.preventDefault();
                        const link = event.target.closest('.preview-pdf');
                        const pdfUrl = link.getAttribute('data-url');

                        if (window.innerWidth <= 768) {
                            window.open(pdfUrl, '_blank');
                        } else {
                            pdfPreview.src = pdfUrl;
                            overlay.style.display = 'flex';
                        }
                    }
                });

                // Fecha o overlay quando clicar fora do iframe
                overlay.addEventListener('click', (event) => {
                    if (event.target === overlay) {
                        overlay.style.display = 'none';
                        pdfPreview.src = '';
                    }
                });

                // Adiciona o evento de clique para os previews de SQL
                reportList.addEventListener('click', (event) => {
                    if (event.target.closest('.preview-sql')) {
                        event.preventDefault();
                        const link = event.target.closest('.preview-sql');
                        const query = link.getAttribute('data-query');

                        // Exibe a query formatada no popover
                        formattedSql.textContent = query;
                        popover.style.display = 'flex'; // Mostra o popover

                        // Fechar popover ao clicar fora do conteúdo
                        popover.addEventListener('click', (e) => {
                            if (e.target === popover) {
                                popover.style.display = 'none';
                            }
                        });
                    }
                });

                // Fechar popover ao clicar no botão de fechar
                closeBtn.addEventListener('click', () => {
                    popover.style.display = 'none';
                });

            }).catch(err => {
                console.error('Erro ao carregar os relatórios ', err)
            })
    }
    fetchReports()

    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.trim()
        fetchReports(searchQuery)
    })
});
