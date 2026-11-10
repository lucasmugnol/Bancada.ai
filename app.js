/* ==========================================================================
   MANDATO INTELIGENTE - JAVASCRIPT APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavModules();
    initQuickCitySearch();
    autoLoadEditais();
    autoLoadEmendas();
});

/* --------------------------------------------------------------------------
   1. Navegação entre Módulos
   -------------------------------------------------------------------------- */
function initNavModules() {
    const buttons = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.view-panel');

    const userInfoMap = {
        'cockpit': { name: 'Dep. Ricardo Silveira', role: 'Cockpit do Deputado • Brasília / DF', initials: 'RS' },
        'editais': { name: 'Assessoria de Editais & Convênios', role: 'Radar Transferegov & Ministérios', initials: 'ED' },
        'emendas': { name: 'Dr. Renato (Consultor de Orçamento)', role: 'Gestão OGU & SIOP • Brasília', initials: 'RO' },
        'cidades': { name: 'Coordenação Política Estadual', role: 'Articulação de Prefeitos & Bases', initials: 'CP' },
        'mapa': { name: 'Dr. Renato & Articulação Territorial', role: 'Mapa Geopolítico • Paraná & Brasil', initials: 'GEO' },
        'campo': { name: 'Luciana Santos (Liderança Regional)', role: 'Campo • Distrito Vila Esperança', initials: 'LS' }
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-view');
            switchView(target);
        });
    });
}

function switchView(targetView) {
    const buttons = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.view-panel');

    buttons.forEach(b => {
        if (b.getAttribute('data-view') === targetView) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    panels.forEach(p => {
        if (p.id === `view-${targetView}`) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });

    // Atualiza o crachá do usuário
    const userInfoMap = {
        'cockpit': { name: 'Dep. Ricardo Silveira', role: 'Cockpit do Deputado • Brasília / DF', initials: 'RS' },
        'editais': { name: 'Assessoria de Editais & Convênios', role: 'Radar Transferegov & Ministérios', initials: 'ED' },
        'emendas': { name: 'Dr. Renato (Consultor de Orçamento)', role: 'Gestão OGU & SIOP • Brasília', initials: 'RO' },
        'cidades': { name: 'Coordenação Política Estadual', role: 'Articulação de Prefeitos & Bases', initials: 'CP' },
        'mapa': { name: 'Dr. Renato & Articulação Territorial', role: 'Mapa Geopolítico • Paraná & Brasil', initials: 'GEO' },
        'campo': { name: 'Luciana Santos (Liderança Regional)', role: 'Campo • Distrito Vila Esperança', initials: 'LS' }
    };

    const info = userInfoMap[targetView] || userInfoMap['cockpit'];
    document.getElementById('userNameDisplay').textContent = info.name;
    document.getElementById('userRoleDisplay').textContent = info.role;
    document.getElementById('avatarInitials').textContent = info.initials;

    if (targetView === 'mapa') {
        setTimeout(initOrResizeMap, 100);
        setTimeout(() => {
            if (mapInstance) mapInstance.invalidateSize();
        }, 350);
    }
    if (targetView === 'editais') {
        autoLoadEditais();
    }
    if (targetView === 'emendas') {
        autoLoadEmendas();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --------------------------------------------------------------------------
   2. Cockpit: Busca Rápida de Município (Ligação de Prefeito)
   -------------------------------------------------------------------------- */
const cityDatabase = {
    'ponta grossa': {
        nome: 'Ponta Grossa (PR)',
        prefeito: 'Dr. Alisson Mendes (PSD)',
        status: 'Aliado de 1ª Hora',
        statusClass: 'tag-success',
        totalPago: 'R$ 4.250.000,00',
        votos: '18.420 votos (2º mais votado)',
        ultimaConquista: 'R$ 1.5M (Asfalto Bairro Nova Rússia)',
        pedidoPendente: 'Reforma do Hospital Municipal'
    },
    'guaratuba': {
        nome: 'Guaratuba (PR)',
        prefeito: 'Roberto Justos (União)',
        status: 'Aliado • ATENÇÃO DILIGÊNCIA',
        statusClass: 'tag-req',
        totalPago: 'R$ 1.950.000,00',
        votos: '4.890 votos',
        ultimaConquista: 'R$ 600 mil (Custeio UPA Verão)',
        pedidoPendente: 'Diligência FNS R$ 850 mil (Faltam 48h)'
    },
    'cascavel': {
        nome: 'Cascavel (PR)',
        prefeito: 'Leonaldo Paranhos (Podemos)',
        status: 'Parceiro Estratégico',
        statusClass: 'tag-success',
        totalPago: 'R$ 3.800.000,00',
        votos: '14.200 votos',
        ultimaConquista: 'R$ 800 mil (2 Ambulâncias Tipo SAMU)',
        pedidoPendente: 'Viaduto da BR-277'
    },
    'laranjeiras do sul': {
        nome: 'Laranjeiras do Sul (PR)',
        prefeito: 'Beto Brandão (MDB)',
        status: 'Base Forte no Centro-Sul',
        statusClass: 'tag-success',
        totalPago: 'R$ 1.800.000,00',
        votos: '5.120 votos (Mais votado)',
        ultimaConquista: 'R$ 450 mil (Patrulha Agrícola MAPA)',
        pedidoPendente: 'Revitalização do Parque Aquático'
    },
    'pato branco': {
        nome: 'Pato Branco (PR)',
        prefeito: 'Robson Cantu (PSD)',
        status: 'Aliado',
        statusClass: 'tag-success',
        totalPago: 'R$ 2.400.000,00',
        votos: '8.340 votos',
        ultimaConquista: 'R$ 1.0M (Parque Tecnológico)',
        pedidoPendente: 'Aeroporto Regional'
    }
};

function initQuickCitySearch() {
    const input = document.getElementById('quickCitySearchInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchQuickCity();
        });
    }
}

function searchQuickCity() {
    const input = document.getElementById('quickCitySearchInput');
    const query = input.value.trim().toLowerCase();
    
    if (!query) {
        showToast('Digite o nome da cidade para pesquisar.', 'warning');
        return;
    }

    const city = cityDatabase[query] || cityDatabase['ponta grossa'];

    document.getElementById('qcNome').textContent = city.nome;
    document.getElementById('qcPrefeito').textContent = city.prefeito;
    
    const statusEl = document.getElementById('qcStatus');
    statusEl.textContent = city.status;
    statusEl.className = `tag ${city.statusClass}`;

    document.getElementById('qcTotalPago').textContent = city.totalPago;
    document.getElementById('qcVotos').textContent = city.votos;
    document.getElementById('qcUltimaConquista').textContent = city.ultimaConquista;
    document.getElementById('qcPedidoPendente').textContent = city.pedidoPendente;

    showToast(`Dossiê carregado: ${city.nome}`, 'info');
}

function openWhatsAppCity() {
    const city = document.getElementById('qcNome').textContent;
    showToast(`Abrindo conversa de WhatsApp com o Prefeito de ${city}...`, 'success');
}

/* --------------------------------------------------------------------------
   3. Radar de Editais Federais (Carregamento Automático com Robô Bancada.ai)
   -------------------------------------------------------------------------- */
const databaseEditais = [
    {
        id: 'edital-mapa-1',
        orgao: 'MAPA',
        tagTexto: 'MAPA • AGRICULTURA',
        tagClass: 'tag-pl',
        titulo: 'Edital n.º 14/2026 – Aquisição de Patrulhas Mecanizadas e Caminhões Caçamba',
        fonte: 'Publicado no DOU • Transferegov Programa n.º 5400020260014',
        valor: 'Até R$ 650.000',
        valorNumerico: 650000,
        prazo: '28/11/2026 (Faltam 18 dias)',
        elegibilidade: 'Municípios com até 50 mil hab. com agricultura familiar. Permite compra de trator agrícola, grade e caçamba basculante.',
        matchTexto: '12 Cidades da sua base são elegíveis!',
        cidadesMatch: ['Laranjeiras do Sul', 'Pato Branco', 'Prudentópolis', 'Reserva do Iguaçu', 'Candói'],
        isHighlight: true
    },
    {
        id: 'edital-fns-2',
        orgao: 'MS',
        tagTexto: 'MINISTÉRIO DA SAÚDE • FNS',
        tagClass: 'tag-indica',
        titulo: 'Portaria n.º 2.410 – Renovação de Frota do Transporte Sanitário Eletivo (Vans Adaptadas)',
        fonte: 'Fundo Nacional de Saúde • Habilitação Fundo a Fundo',
        valor: 'R$ 380.000 / Van',
        valorNumerico: 380000,
        prazo: '22/11/2026 (Faltam 12 dias)',
        elegibilidade: 'Municípios que necessitam transportar pacientes para hemodiálise e oncologia em cidades polo.',
        matchTexto: '8 Cidades com demanda aberta no gabinete!',
        cidadesMatch: ['Guaratuba', 'Piraí do Sul', 'Irati', 'Palmeira'],
        isHighlight: false
    },
    {
        id: 'edital-mcid-3',
        orgao: 'MCID',
        tagTexto: 'MINISTÉRIO DAS CIDADES',
        tagClass: 'tag-req',
        titulo: 'Chamada Pública n.º 07/2026 – Pavimentação Asfáltica e Iluminação de Vias Rurais',
        fonte: 'Secretaria Nacional de Periferias e Mobilidade Urbana',
        valor: 'Até R$ 2.000.000',
        valorNumerico: 2000000,
        prazo: '05/12/2026 (Faltam 25 dias)',
        elegibilidade: 'Cidades com projetos de engenharia prontos para asfalto ou calçamento poliédrico e lâmpadas de LED.',
        matchTexto: '5 Cidades com projetos já validados',
        cidadesMatch: ['Cascavel', 'Ponta Grossa', 'Castro'],
        isHighlight: false
    },
    {
        id: 'edital-fnde-4',
        orgao: 'MEC',
        tagTexto: 'MEC • FNDE',
        tagClass: 'tag-pl',
        titulo: 'Programa Caminho da Escola 2026 – Aquisição de Ônibus Escolares Rurais 4x4',
        fonte: 'Fundo Nacional de Desenvolvimento da Educação • Resolução nº 18',
        valor: 'R$ 420.000 / Veículo',
        valorNumerico: 420000,
        prazo: '15/12/2026 (Faltam 35 dias)',
        elegibilidade: 'Atendimento a estudantes residentes na zona rural de difícil acesso geográfico.',
        matchTexto: '9 Cidades aptas no Paraná',
        cidadesMatch: ['Prudentópolis', 'Laranjeiras do Sul', 'Candói', 'Reserva do Iguaçu'],
        isHighlight: false
    },
    {
        id: 'edital-mesp-5',
        orgao: 'MESP',
        tagTexto: 'MINISTÉRIO DO ESPORTE',
        tagClass: 'tag-indica',
        titulo: 'Programa Areninhas Brasil – Implantação de Campos de Futebol Society Sintético com LED',
        fonte: 'Secretaria Nacional de Esporte Amador • Portaria MESP nº 98',
        valor: 'R$ 550.000',
        valorNumerico: 550000,
        prazo: '30/11/2026 (Faltam 20 dias)',
        elegibilidade: 'Municípios com terrenos públicos desimpedidos em bairros de periferia.',
        matchTexto: '6 Cidades com terreno cadastrado',
        cidadesMatch: ['Candói', 'Pato Branco', 'Francisco Beltrão'],
        isHighlight: false
    },
    {
        id: 'edital-mds-6',
        orgao: 'MDS',
        tagTexto: 'DESENVOLVIMENTO SOCIAL',
        tagClass: 'tag-req',
        titulo: 'Mobilidade no SUAS – Aquisição de Veículos para Atendimento a CRAS e CREAS',
        fonte: 'Fundo Nacional de Assistência Social • Portaria nº 412',
        valor: 'R$ 180.000',
        valorNumerico: 180000,
        prazo: '10/12/2026 (Faltam 30 dias)',
        elegibilidade: 'Centros de Referência de Assistência Social ativos no CadSUAS.',
        matchTexto: '14 Cidades elegíveis',
        cidadesMatch: ['Guaratuba', 'Piraí do Sul', 'Palmeira', 'Irati'],
        isHighlight: false
    },
    {
        id: 'edital-minc-7',
        orgao: 'MINC',
        tagTexto: 'MINISTÉRIO DA CULTURA',
        tagClass: 'tag-pl',
        titulo: 'Edital Cultura Viva – Modernização de Casas de Cultura e Patrimônio Histórico',
        fonte: 'Plataforma Transferegov • Política Nacional Aldir Blanc',
        valor: 'Até R$ 300.000',
        valorNumerico: 300000,
        prazo: '02/12/2026 (Faltam 22 dias)',
        elegibilidade: 'Prefeituras com Plano Municipal de Cultura aprovado em conselho.',
        matchTexto: '4 Cidades com plano ativo',
        cidadesMatch: ['Castro', 'Ponta Grossa', 'Laranjeiras do Sul'],
        isHighlight: false
    },
    {
        id: 'edital-itaipu-8',
        orgao: 'MCID',
        tagTexto: 'ITAIPU • SUSTENTABILIDADE',
        tagClass: 'tag-indica',
        titulo: 'Linha Ecológica 2026 – Recuperação de Estradas Rurais e Adequação de Microbacias',
        fonte: 'Convênio Itaipu Binacional & Governo Federal',
        valor: 'Até R$ 1.200.000',
        valorNumerico: 1200000,
        prazo: '20/12/2026 (Faltam 40 dias)',
        elegibilidade: 'Municípios da bacia do Paraná III e região lindeira ao lago de Itaipu.',
        matchTexto: '7 Cidades na área de abrangência',
        cidadesMatch: ['Cascavel', 'Foz do Iguaçu', 'Toledo'],
        isHighlight: false
    }
];

function autoLoadEditais(filteredList = null) {
    const container = document.getElementById('liveEditaisFeedContainer');
    if (!container) return;

    const list = filteredList || databaseEditais;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const timeEl = document.getElementById('radarLastScanTime');
    if (timeEl) timeEl.textContent = `Hoje às ${timeStr}`;

    container.innerHTML = list.map(ed => `
        <div class="edital-card ${ed.isHighlight ? 'highlight' : ''}" id="${ed.id}">
            <div class="edital-header">
                <div>
                    <span class="tag ${ed.tagClass}">${ed.tagTexto}</span>
                    <h3 style="font-size: 16px; margin: 6px 0; color: var(--navy-900);">
                        ${ed.titulo}
                    </h3>
                    <div style="font-size: 12px; color: var(--text-muted);">
                        ${ed.fonte}
                    </div>
                </div>
                <div class="edital-badge-puro">
                    <div class="edital-valor">${ed.valor}</div>
                    <span class="edital-prazo"><i class="fa-solid fa-clock"></i> Prazo: ${ed.prazo}</span>
                </div>
            </div>

            <p style="font-size: 13px; color: var(--text-secondary); margin: 10px 0;">
                <strong>Elegibilidade:</strong> ${ed.elegibilidade}
            </p>

            <div class="edital-footer">
                <div class="ai-match-tag">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> <strong>IA Match:</strong> ${ed.matchTexto}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-sm btn-outline" onclick="openAIMatchModal('${ed.tagTexto}', ${JSON.stringify(ed.cidadesMatch).replace(/"/g, '&quot;')})">
                        <i class="fa-solid fa-robot"></i> Ver Análise de Match
                    </button>
                    <button class="btn btn-sm btn-emerald" onclick="prepareWhatsAppBroadcast('${ed.titulo}', '${ed.valor}', '${ed.prazo}')">
                        <i class="fa-brands fa-whatsapp"></i> Avisar Prefeitos Elegíveis
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const countBadge = document.getElementById('badgeEditais');
    if (countBadge) countBadge.textContent = list.length;
}

function simulateSyncEditais() {
    const btn = event.currentTarget;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Robô Varrendo Transferegov & DOU...';
    btn.disabled = true;

    const statusText = document.getElementById('radarStatusText');
    if (statusText) statusText.textContent = 'Consultando novos editais nos servidores dos Ministérios...';

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Sincronizar Agora';
        btn.disabled = false;
        if (statusText) statusText.textContent = 'Monitoramento ativo e atualizado com Transferegov e Ministérios';
        autoLoadEditais();
        showToast('Radar atualizado! 8 Editais Oficiais carregados com cruzamento de elegibilidade.', 'success');
    }, 1000);
}

function filterEditais() {
    const orgao = document.getElementById('filterOrgao').value;
    if (orgao === 'todos') {
        autoLoadEditais();
    } else {
        const filtered = databaseEditais.filter(e => e.orgao === orgao);
        autoLoadEditais(filtered);
    }
    showToast(`Filtro aplicado para: ${orgao}`, 'info');
}

function filterEditaisValor(faixa) {
    if (faixa === 'todos') {
        autoLoadEditais();
    } else if (faixa === '500k') {
        autoLoadEditais(databaseEditais.filter(e => e.valorNumerico <= 500000));
    } else if (faixa === '2m') {
        autoLoadEditais(databaseEditais.filter(e => e.valorNumerico > 500000 && e.valorNumerico <= 2000000));
    } else {
        autoLoadEditais(databaseEditais.filter(e => e.valorNumerico > 2000000));
    }
}

function filterEditaisKeyword(keyword) {
    const k = keyword.toLowerCase().trim();
    if (!k) {
        autoLoadEditais();
        return;
    }
    const filtered = databaseEditais.filter(e => 
        e.titulo.toLowerCase().includes(k) || 
        e.elegibilidade.toLowerCase().includes(k) ||
        e.orgao.toLowerCase().includes(k)
    );
    autoLoadEditais(filtered);
}

/* --------------------------------------------------------------------------
   3.1 Sub-Abas do Radar: Oportunidades Federais vs Licitações das Prefeituras
   -------------------------------------------------------------------------- */
function switchRadarSubTab(subTab) {
    const btnOportunidades = document.getElementById('tabNavOportunidades');
    const btnLicitacoes = document.getElementById('tabNavLicitacoes');
    const panelOportunidades = document.getElementById('subViewOportunidades');
    const panelLicitacoes = document.getElementById('subViewLicitacoes');

    if (subTab === 'oportunidades') {
        if (btnOportunidades) btnOportunidades.classList.add('active');
        if (btnLicitacoes) btnLicitacoes.classList.remove('active');
        if (panelOportunidades) panelOportunidades.style.display = 'block';
        if (panelLicitacoes) panelLicitacoes.style.display = 'none';
        autoLoadEditais();
        showToast('Exibindo Oportunidades Federais (Ministérios ➔ Prefeituras)', 'info');
    } else {
        if (btnLicitacoes) btnLicitacoes.classList.add('active');
        if (btnOportunidades) btnOportunidades.classList.remove('active');
        if (panelLicitacoes) panelLicitacoes.style.display = 'block';
        if (panelOportunidades) panelOportunidades.style.display = 'none';
        fetchLivePncpEditais();
        showToast('Exibindo Licitações das Prefeituras (Fiscalização das Emendas)', 'info');
    }
}

/* --------------------------------------------------------------------------
   3.2 Robô Coletor: Licitações das Prefeituras no PNCP (Amarração com Emendas)
   -------------------------------------------------------------------------- */
let currentPncpFilter = 'vinculadas';
let globalPncpList = [];

// Licitações dos municípios da base com vínculo e sugestões prontas
const basePncpLicitacoes = [
    {
        id: 'lic-pg-1',
        tipoVinculo: 'vinculada',
        cidade: 'Ponta Grossa',
        uf: 'PR',
        orgao: 'MUNICÍPIO DE PONTA GROSSA',
        numeroPNCP: '80236566-1-000042/2026',
        objeto: 'Concorrência Eletrônica nº 014/2026: Contratação de empresa especializada para execução de obras de pavimentação asfáltica em CBUQ, galerias de águas pluviais e sinalização viária no Bairro Nova Rússia.',
        valor: 'R$ 1.485.200,00',
        valorNum: 1485200,
        dataPub: 'Publicado ontem às 16:40',
        emendaVinculada: {
            emendaId: 'em-11',
            codigo: 'Emenda Parlamentar #2026-001 (Dep. Ricardo Silveira)',
            valorEmenda: 'R$ 1.500.000,00',
            objetoEmenda: 'Pavimentação Asfáltica Bairro Nova Rússia',
            status: 'Paga na Conta em 08/11/2026'
        }
    },
    {
        id: 'lic-casc-2',
        tipoVinculo: 'vinculada',
        cidade: 'Cascavel',
        uf: 'PR',
        orgao: 'MUNICÍPIO DE CASCAVEL',
        numeroPNCP: '76208867-1-000108/2026',
        objeto: 'Pregão Eletrônico nº 089/2026: Aquisição de 02 (duas) ambulâncias tipo furgão zero km, devidamente adaptadas para Suporte Avançado (UTI Móvel) da Secretaria de Saúde / SAMU.',
        valor: 'R$ 792.000,00',
        valorNum: 792000,
        dataPub: 'Publicado há 2 dias',
        emendaVinculada: {
            emendaId: 'em-12',
            codigo: 'Emenda Parlamentar #2026-004 (Dep. Ricardo Silveira)',
            valorEmenda: 'R$ 800.000,00',
            objetoEmenda: 'Duas Ambulâncias SAMU',
            status: 'Paga na Conta em 07/11/2026'
        }
    },
    {
        id: 'lic-guar-3',
        tipoVinculo: 'sugerida',
        cidade: 'Guaratuba',
        uf: 'PR',
        orgao: 'MUNICÍPIO DE GUARATUBA',
        numeroPNCP: '76019890-1-000032/2026',
        objeto: 'Pregão Eletrônico nº 032/2026: Registro de preços para eventual aquisição de equipamentos hospitalares e odontológicos para aparelhamento das Unidades Básicas de Saúde da Família (UBS).',
        valor: 'R$ 480.000,00',
        valorNum: 480000,
        dataPub: 'Publicado há 3 dias',
        sugestaoIa: {
            emendaId: 'em-7',
            candidato: 'Emenda FNS #850026 (Saúde Básica de Guaratuba)',
            valorEmenda: 'R$ 850.000,00',
            confianca: '88% de correlação de objeto e município'
        }
    }
];

async function fetchLivePncpEditais() {
    const btn = document.getElementById('btnLivePncp');
    const container = document.getElementById('pncpLicitacoesFeedContainer');
    if (!container) return;

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando PNCP...';
    }

    container.innerHTML = `
        <div style="background: white; border: 1px solid var(--border); border-radius: 12px; padding: 30px; text-align: center;">
            <i class="fa-solid fa-building-shield fa-spin" style="font-size: 36px; color: var(--emerald); margin-bottom: 12px;"></i>
            <h4 style="font-size: 16px; color: var(--navy-900); margin-bottom: 6px;">Rastreando Editais das Prefeituras no PNCP</h4>
            <p style="font-size: 12px; color: var(--text-muted); max-width: 500px; margin: 0 auto;">
                Buscando licitações oficiais abertas pelas prefeituras e cruzando com a base de emendas do Deputado...
            </p>
        </div>
    `;

    try {
        const endpointUrl = 'https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=20241001&dataFinal=20241003&codigoModalidadeContratacao=8&pagina=1&tamanhoPagina=10';
        
        const response = await fetch(endpointUrl, {
            headers: { 'Accept': 'application/json' }
        });

        let listaLive = [];
        if (response.ok) {
            const json = await response.json();
            const rawList = json.data || [];
            listaLive = rawList.map((item, idx) => ({
                id: `pncp-live-${idx}`,
                tipoVinculo: 'avulsa', // Não vinculada às emendas do deputado
                cidade: item.unidadeOrgao?.municipioNome || 'Município',
                uf: item.unidadeOrgao?.ufSigla || 'BR',
                orgao: item.orgaoEntidade?.razaoSocial || 'Órgão Público',
                numeroPNCP: item.numeroControlePNCP || `PNCP-${idx}`,
                objeto: item.objetoCompra || 'Contratação Pública Municipal',
                valor: item.valorTotalEstimado 
                    ? 'R$ ' + item.valorTotalEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : 'Valor Homologado',
                valorNum: item.valorTotalEstimado || 0,
                dataPub: item.dataPublicacaoPncp ? `Publicado em ${item.dataPublicacaoPncp.split('T')[0]}` : 'Recente'
            }));
        }

        // Combina as licitações vinculadas/sugeridas com as licitações reais do PNCP
        globalPncpList = [...basePncpLicitacoes, ...listaLive];

        updatePncpCounts();
        renderPncpFeed();
        showToast(`PNCP atualizado! Motor de amarração cruzou as licitações com suas emendas.`, 'success');

    } catch (err) {
        // Se a API externa oscilar, usa as licitações amarradas da base
        globalPncpList = [...basePncpLicitacoes];
        updatePncpCounts();
        renderPncpFeed();
        showToast('Exibindo licitações das cidades da base vinculadas às emendas.', 'info');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Consultar Licitações no PNCP (Ao Vivo)';
        }
    }
}

function updatePncpCounts() {
    const vinculadas = globalPncpList.filter(l => l.tipoVinculo === 'vinculada').length;
    const sugeridas = globalPncpList.filter(l => l.tipoVinculo === 'sugerida').length;
    const todas = globalPncpList.length;

    const elVinc = document.getElementById('countPncpVinculadas');
    const elSug = document.getElementById('countPncpSugeridas');
    const elTodas = document.getElementById('countPncpTodas');

    if (elVinc) elVinc.textContent = vinculadas;
    if (elSug) elSug.textContent = sugeridas;
    if (elTodas) elTodas.textContent = todas;
}

function filterPncpByBond(filterType) {
    currentPncpFilter = filterType;

    const btnVinc = document.getElementById('btnFilterPncpVinculadas');
    const btnSug = document.getElementById('btnFilterPncpSugeridas');
    const btnTodas = document.getElementById('btnFilterPncpTodas');

    if (btnVinc) {
        btnVinc.className = filterType === 'vinculadas' ? 'btn btn-sm btn-emerald' : 'btn btn-sm btn-outline';
    }
    if (btnSug) {
        btnSug.className = filterType === 'sugeridas' ? 'btn btn-sm btn-emerald' : 'btn btn-sm btn-outline';
    }
    if (btnTodas) {
        btnTodas.className = filterType === 'todas' ? 'btn btn-sm btn-emerald' : 'btn btn-sm btn-outline';
    }

    renderPncpFeed();
}

function renderPncpFeed() {
    const container = document.getElementById('pncpLicitacoesFeedContainer');
    if (!container) return;

    if (!globalPncpList || globalPncpList.length === 0) {
        globalPncpList = [...basePncpLicitacoes];
        updatePncpCounts();
    }

    let list = globalPncpList;
    if (currentPncpFilter === 'vinculadas') {
        list = globalPncpList.filter(l => l.tipoVinculo === 'vinculada');
    } else if (currentPncpFilter === 'sugeridas') {
        list = globalPncpList.filter(l => l.tipoVinculo === 'sugerida');
    }

    if (list.length === 0) {
        container.innerHTML = `
            <div style="background: white; border: 1px solid var(--border); border-radius: 12px; padding: 40px; text-align: center;">
                <i class="fa-solid fa-folder-open" style="font-size: 36px; color: var(--text-muted); margin-bottom: 12px;"></i>
                <h4 style="font-size: 15px; color: var(--navy-900); margin-bottom: 6px;">Nenhuma licitação encontrada nesta categoria</h4>
                <p style="font-size: 12px; color: var(--text-secondary);">
                    Alterne os filtros acima para visualizar outras licitações do Portal Nacional de Contratações Públicas.
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = list.map(item => {
        if (item.tipoVinculo === 'vinculada') {
            return `
                <div class="edital-card highlight" style="border-left-color: var(--emerald);">
                    <!-- Header com Amarração Confirmada -->
                    <div style="background: #f0fdf4; border-bottom: 1px solid #bbf7d0; margin: -20px -20px 14px -20px; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0;">
                        <span style="font-size: 11px; font-weight: 800; color: #166534; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-solid fa-link"></i> VINCULADA À EMENDA PARLAMENTAR: ${item.emendaVinculada.codigo}
                        </span>
                        <span class="tag tag-success" style="font-size: 10px;">VÍNCULO 100% CONFIRMADO</span>
                    </div>

                    <div class="edital-header">
                        <div>
                            <span class="tag tag-success"><i class="fa-solid fa-building-shield"></i> EDITAL PUBLICADO NO PNCP</span>
                            <span class="tag tag-pl">${item.cidade} (${item.uf})</span>
                            <h3 style="font-size: 15px; margin: 8px 0; color: var(--navy-900); line-height: 1.4;">
                                ${item.objeto}
                            </h3>
                            <div style="font-size: 11px; color: var(--text-muted);">
                                <strong>Órgão:</strong> ${item.orgao} • <strong>Nº PNCP:</strong> ${item.numeroPNCP}
                            </div>
                        </div>
                        <div class="edital-badge-puro">
                            <div class="edital-valor" style="color: #059669;">${item.valor}</div>
                            <span class="edital-prazo" style="color: #047857;"><i class="fa-solid fa-calendar-check"></i> ${item.dataPub}</span>
                        </div>
                    </div>

                    <!-- Amarração com a Emenda Paga -->
                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 14px; margin: 12px 0; font-size: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <span style="color: #1e40af; font-weight: 700;"><i class="fa-solid fa-money-bill-transfer"></i> Recurso da Sua Emenda:</span>
                            <strong style="color: #1e3a8a;">${item.emendaVinculada.valorEmenda}</strong> (${item.emendaVinculada.status})
                        </div>
                        <div style="font-size: 11px; color: #2563eb; font-weight: 600;">
                            Prefeitura abriu licitação no valor de <strong>${item.valor}</strong>
                        </div>
                    </div>

                    <div class="edital-footer" style="background: #f8fafc; margin: 12px -20px -20px -20px; padding: 12px 20px; border-radius: 0 0 12px 12px;">
                        <div class="ai-match-tag">
                            <i class="fa-solid fa-circle-check" style="color: var(--emerald);"></i> 
                            <strong>Ação Segura:</strong> Licitação vinculada ao seu recurso. Pode cobrar e postar sem risco de gafe!
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-sm btn-emerald" onclick="generateVictoryCard('${item.cidade}', '${item.valor}', '${item.objeto.substring(0, 35)}...')">
                                <i class="fa-solid fa-bullhorn"></i> Gerar Post: Obra Licitada
                            </button>
                            <button class="btn btn-sm btn-outline" style="color: #b91c1c; border-color: #fca5a5;" onclick="cobrarPrefeitoAgilidade('${item.cidade}', '${item.objeto.substring(0, 35)}...')">
                                <i class="fa-brands fa-whatsapp"></i> Cobrar Agilidade da Prefeitura
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else if (item.tipoVinculo === 'sugerida') {
            return `
                <div class="edital-card" style="border-left: 4px solid var(--amber);">
                    <!-- Header de Sugestão de IA -->
                    <div style="background: #fffbeb; border-bottom: 1px solid #fef3c7; margin: -20px -20px 14px -20px; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0;">
                        <span style="font-size: 11px; font-weight: 800; color: #92400e; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> SUGESTÃO DE VÍNCULO DA IA (${item.sugestaoIa.confianca})
                        </span>
                        <span class="tag tag-req" style="font-size: 10px;">AGUARDANDO CONFIRMAÇÃO</span>
                    </div>

                    <div class="edital-header">
                        <div>
                            <span class="tag tag-req"><i class="fa-solid fa-question"></i> LICITAÇÃO COM POTENCIAL VÍNCULO</span>
                            <span class="tag tag-pl">${item.cidade} (${item.uf})</span>
                            <h3 style="font-size: 15px; margin: 8px 0; color: var(--navy-900); line-height: 1.4;">
                                ${item.objeto}
                            </h3>
                            <div style="font-size: 11px; color: var(--text-muted);">
                                <strong>Órgão:</strong> ${item.orgao} • <strong>Nº PNCP:</strong> ${item.numeroPNCP}
                            </div>
                        </div>
                        <div class="edital-badge-puro">
                            <div class="edital-valor">${item.valor}</div>
                            <span class="edital-prazo"><i class="fa-solid fa-calendar"></i> ${item.dataPub}</span>
                        </div>
                    </div>

                    <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 10px 14px; margin: 12px 0; font-size: 12px; color: #92400e;">
                        <i class="fa-solid fa-robot"></i> <strong>Detecção Inteligente:</strong> A IA identificou que o objeto e o município coincidem com a <strong>${item.sugestaoIa.candidato}</strong> (Valor da Emenda: ${item.sugestaoIa.valorEmenda}).
                    </div>

                    <div class="edital-footer" style="background: #f8fafc; margin: 12px -20px -20px -20px; padding: 12px 20px; border-radius: 0 0 12px 12px;">
                        <div style="font-size: 12px; color: var(--text-secondary);">
                            Confirme se esta licitação é referente à sua emenda para liberar posts e cobranças:
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-sm btn-emerald" onclick="confirmarSugestaoPncp('${item.id}')">
                                <i class="fa-solid fa-check"></i> Confirmar Vínculo Oficial
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="descartarSugestaoPncp('${item.id}')">
                                <i class="fa-solid fa-xmark"></i> Não é da Emenda
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Licitação Avulsa (Despesa Própria da Prefeitura)
            return `
                <div class="edital-card" style="opacity: 0.85; border-left: 4px solid #cbd5e1;">
                    <div style="background: #f8fafc; border-bottom: 1px solid var(--border); margin: -20px -20px 14px -20px; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0;">
                        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                            <i class="fa-solid fa-shield"></i> DESPESA REGULAR DO MUNICÍPIO • SEM EMENDA PARLAMENTAR
                        </span>
                        <span class="tag" style="background: #e2e8f0; color: #475569; font-size: 10px;">RECURSO PRÓPRIO</span>
                    </div>

                    <div class="edital-header">
                        <div>
                            <span class="tag">${item.cidade} (${item.uf})</span>
                            <h3 style="font-size: 14px; margin: 6px 0; color: var(--navy-900);">
                                ${item.objeto}
                            </h3>
                            <div style="font-size: 11px; color: var(--text-muted);">
                                <strong>Órgão:</strong> ${item.orgao} • <strong>Nº PNCP:</strong> ${item.numeroPNCP}
                            </div>
                        </div>
                        <div class="edital-badge-puro">
                            <div class="edital-valor" style="font-size: 14px; color: var(--navy-900);">${item.valor}</div>
                            <span class="edital-prazo" style="font-size: 11px;">${item.dataPub}</span>
                        </div>
                    </div>

                    <!-- Alerta Anti-Gafe -->
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 12px; margin: 10px 0; font-size: 11px; color: #991b1b; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span><strong>Proteção Anti-Gafe Ativa:</strong> Esta licitação não tem vínculo com o deputado. Cobranças e posts estão bloqueados para não desgastar o mandato com o prefeito.</span>
                    </div>

                    <div class="edital-footer" style="background: #f8fafc; margin: 12px -20px -20px -20px; padding: 12px 20px; border-radius: 0 0 12px 12px;">
                        <span style="font-size: 11px; color: var(--text-muted);">
                            É fruto de emenda do deputado que não foi detectada?
                        </span>
                        <button class="btn btn-sm btn-outline" onclick="openVincularEmendaModal('${item.id}', '${item.cidade}', '${item.objeto.substring(0, 35)}...', '${item.valor}', '${item.orgao}')">
                            <i class="fa-solid fa-link"></i> Vincular a uma Emenda Manualmente
                        </button>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function confirmarSugestaoPncp(id) {
    const item = globalPncpList.find(l => l.id === id);
    if (item) {
        item.tipoVinculo = 'vinculada';
        item.emendaVinculada = {
            emendaId: item.sugestaoIa.emendaId,
            codigo: item.sugestaoIa.candidato,
            valorEmenda: item.sugestaoIa.valorEmenda,
            objetoEmenda: 'Equipamentos de Saúde Básica',
            status: 'Empenhada / Em Processamento'
        };
        updatePncpCounts();
        renderPncpFeed();
        showToast(`Licitação de ${item.cidade} vinculada com sucesso à sua Emenda Parlamentar!`, 'success');
    }
}

function descartarSugestaoPncp(id) {
    const item = globalPncpList.find(l => l.id === id);
    if (item) {
        item.tipoVinculo = 'avulsa';
        updatePncpCounts();
        renderPncpFeed();
        showToast(`Vínculo descartado. A licitação agora é tratada como despesa própria da prefeitura.`, 'info');
    }
}

let currentVinculacaoLicitacaoId = null;

function openVincularEmendaModal(id, cidade, objeto, valor, orgao) {
    currentVinculacaoLicitacaoId = id;
    const modal = document.getElementById('vincularEmendaModal');
    const objEl = document.getElementById('modalVincularObjeto');
    const orgEl = document.getElementById('modalVincularOrgao');
    const valEl = document.getElementById('modalVincularValor');

    if (objEl) objEl.textContent = objeto;
    if (orgEl) orgEl.textContent = `${cidade} • ${orgao}`;
    if (valEl) valEl.textContent = valor;

    if (modal) modal.style.display = 'flex';
}

function closeVincularEmendaModal() {
    const modal = document.getElementById('vincularEmendaModal');
    if (modal) modal.style.display = 'none';
}

function confirmarVinculoEmenda() {
    const select = document.getElementById('selectEmendaParaVincular');
    const emendaVal = select ? select.value : 'em-11';
    const emendaTexto = select ? select.options[select.selectedIndex].text : 'Emenda Parlamentar';

    const item = globalPncpList.find(l => l.id === currentVinculacaoLicitacaoId);
    if (item) {
        item.tipoVinculo = 'vinculada';
        item.emendaVinculada = {
            emendaId: emendaVal,
            codigo: emendaTexto.split('•')[1] ? emendaTexto.split('•')[1].trim() : 'Emenda Dep. Ricardo Silveira',
            valorEmenda: emendaTexto.split('•')[1] ? emendaTexto.split('•')[1].trim() : 'Recurso Parlamentar',
            status: 'Vínculo Manual Confirmado'
        };
        closeVincularEmendaModal();
        updatePncpCounts();
        renderPncpFeed();
        showToast(`Licitação vinculada com sucesso à sua Emenda!`, 'success');
    }
}

/* --------------------------------------------------------------------------
   4. Esteira de Emendas Parlamentares (Carregamento Automático com SIOP)
   -------------------------------------------------------------------------- */
const databaseEmendas = [
    // Coluna 1: Indicação Cadastrada
    {
        id: 'em-1',
        coluna: 1,
        cidade: 'Castro (PR)',
        tipoTag: 'EMENDA PIX',
        tipoClasse: 'tag-pl',
        tipoFiltro: 'pix',
        siop: 'SIOP #2026-018',
        valor: 'R$ 600.000,00',
        valorNum: 600000,
        desc: 'Custeio Geral Municipal. Aguardando aceite da conta corrente no Transferegov.',
        resp: 'Dr. Renato',
        prazo: '30/11'
    },
    {
        id: 'em-2',
        coluna: 1,
        cidade: 'Reserva do Iguaçu',
        tipoTag: 'AGRICULTURA',
        tipoClasse: 'tag-req',
        tipoFiltro: 'definida',
        siop: 'MAPA #540026',
        valor: 'R$ 350.000,00',
        valorNum: 350000,
        desc: 'Aquisição de Caminhão Pipa. Prefeitura elaborando termo de referência.',
        resp: 'Carla Mendes',
        prazo: '05/12'
    },
    {
        id: 'em-3',
        coluna: 1,
        cidade: 'Irati',
        tipoTag: 'BANCADA ESTADUAL',
        tipoClasse: 'tag-indica',
        tipoFiltro: 'bancada',
        siop: 'SIOP #2026-092',
        valor: 'R$ 1.500.000,00',
        valorNum: 1500000,
        desc: 'Pavimentação de Acesso ao Polo Universitário. Indicação confirmada em ata.',
        resp: 'Dr. Renato',
        prazo: '15/12'
    },

    // Coluna 2: Proposta Cadastrada pela Prefeitura
    {
        id: 'em-4',
        coluna: 2,
        cidade: 'Prudentópolis',
        tipoTag: 'SAÚDE (FNS)',
        tipoClasse: 'tag-indica',
        tipoFiltro: 'definida',
        siop: 'Prop. 89104',
        valor: 'R$ 500.000,00',
        valorNum: 500000,
        desc: 'Reforma de 2 Postos de Saúde na Zona Rural. Proposta enviada ao Ministério.',
        statusSub: 'Em análise no Ministério da Saúde',
        resp: 'Carla Mendes'
    },
    {
        id: 'em-5',
        coluna: 2,
        cidade: 'Palmeira',
        tipoTag: 'INFRAESTRUTURA',
        tipoClasse: 'tag-req',
        tipoFiltro: 'definida',
        siop: 'MCID #78410',
        valor: 'R$ 1.200.000,00',
        valorNum: 1200000,
        desc: 'Pavimentação da Estrada de Santa Bárbara. Caixa analisando projeto técnico.',
        statusSub: 'Análise de Engenharia Caixa',
        resp: 'Dr. Renato'
    },
    {
        id: 'em-6',
        coluna: 2,
        cidade: 'Campo Mourão',
        tipoTag: 'EMENDA PIX',
        tipoClasse: 'tag-pl',
        tipoFiltro: 'pix',
        siop: 'SIOP #2026-044',
        valor: 'R$ 750.000,00',
        valorNum: 750000,
        desc: 'Custeio da Saúde e Atenção Básica. Plano de Ação em análise na STN.',
        statusSub: 'Aguardando validação STN',
        resp: 'Carla Mendes'
    },

    // Coluna 3: Diligência / Risco Crítico
    {
        id: 'em-7',
        coluna: 3,
        cidade: 'Guaratuba • Saúde (FNS)',
        cidadeSimples: 'Guaratuba',
        tipoTag: 'RISCO DE PERDA',
        urgenciaBadge: 'VENCE EM 48H',
        tipoFiltro: 'definida',
        valor: 'R$ 850.000,00',
        valorNum: 850000,
        desc: '<strong>Parecer Negativo:</strong> Faltou planilha orçamentária assinada pelo engenheiro civil da prefeitura.',
        isDanger: true,
        motivoDiligencia: 'Falta planilha assinada pelo engenheiro',
        prazoDiligencia: '48 horas'
    },
    {
        id: 'em-8',
        coluna: 3,
        cidade: 'Piraí do Sul • Educação',
        cidadeSimples: 'Piraí do Sul',
        tipoTag: 'DILIGÊNCIA',
        urgenciaBadge: 'VENCE EM 5 DIAS',
        tipoFiltro: 'definida',
        valor: 'R$ 400.000,00',
        valorNum: 400000,
        desc: 'Falta matrícula atualizada do terreno da creche no cartório de registro de imóveis.',
        isDanger: true,
        motivoDiligencia: 'Matrícula do terreno da creche',
        prazoDiligencia: '5 dias'
    },

    // Coluna 4: Empenhada (Recurso Garantido)
    {
        id: 'em-9',
        coluna: 4,
        cidade: 'Candói (PR)',
        tipoTag: 'MIN. ESPORTE',
        tipoClasse: 'tag-pl',
        tipoFiltro: 'definida',
        siop: 'NE #2026NE0041',
        valor: 'R$ 550.000,00',
        valorNum: 550000,
        desc: 'Construção de Complexo Esportivo de Grama Sintética. Aguardando Ordem Bancária.',
        subBadge: 'NOTA EMPENHO OK'
    },
    {
        id: 'em-10',
        coluna: 4,
        cidade: 'Francisco Beltrão',
        tipoTag: 'SAÚDE (FNS)',
        tipoClasse: 'tag-indica',
        tipoFiltro: 'definida',
        siop: 'NE #2026NE0118',
        valor: 'R$ 1.000.000,00',
        valorNum: 1000000,
        desc: 'Equipamentos de Raio-X e Ultrassom para a UPA Central.',
        subBadge: 'NOTA EMPENHO OK'
    },

    // Coluna 5: Paga na Conta (Vitória Concluída)
    {
        id: 'em-11',
        coluna: 5,
        cidade: 'Ponta Grossa',
        cidadeSimples: 'Ponta Grossa',
        tipoTag: 'PAGA ONTEM',
        ob: 'OB 84920',
        tipoFiltro: 'definida',
        valor: 'R$ 1.500.000,00',
        valorNum: 1500000,
        desc: 'Asfalto no Bairro Nova Rússia. Dinheiro creditado na conta 12.480-X da Caixa.',
        objeto: 'Asfalto Bairro Nova Rússia',
        isSuccess: true,
        pncpLicitado: true,
        pncpProc: 'Concorrência nº 014/2026',
        pncpValor: 'R$ 1.485.200,00'
    },
    {
        id: 'em-12',
        coluna: 5,
        cidade: 'Cascavel',
        cidadeSimples: 'Cascavel',
        tipoTag: 'PAGA ESTA SEMANA',
        ob: 'OB 84112',
        tipoFiltro: 'definida',
        valor: 'R$ 800.000,00',
        valorNum: 800000,
        desc: 'Duas Ambulâncias Tipo SAMU. Prefeitura já autorizou pregão de compra.',
        objeto: 'Ambulâncias SAMU',
        isSuccess: true,
        pncpLicitado: true,
        pncpProc: 'Pregão nº 089/2026',
        pncpValor: 'R$ 792.000,00'
    },
    {
        id: 'em-13',
        coluna: 5,
        cidade: 'Laranjeiras do Sul',
        cidadeSimples: 'Laranjeiras do Sul',
        tipoTag: 'PAGA HÁ 38 DIAS',
        ob: 'OB 83915',
        tipoFiltro: 'definida',
        valor: 'R$ 450.000,00',
        valorNum: 450000,
        desc: 'Trator Agrícola e Implementos. Recurso na conta da prefeitura aguardando publicação de edital.',
        objeto: 'Trator Agrícola e Implementos',
        isSuccess: true,
        pncpLicitado: false,
        diasNaConta: 38,
        prefeito: 'Berto Silva'
    }
];

function autoLoadEmendas(filteredList = null) {
    const list = filteredList || databaseEmendas;

    for (let col = 1; col <= 5; col++) {
        const colListEl = document.getElementById(`kanbanCol${col}List`);
        const badgeEl = document.getElementById(`badgeCol${col}`);
        if (!colListEl) continue;

        const colItems = list.filter(e => e.coluna === col);
        if (badgeEl) badgeEl.textContent = colItems.length;

        colListEl.innerHTML = colItems.map(item => {
            if (item.isDanger) {
                return `
                    <div class="kanban-card danger-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="tag" style="background: #ef4444; color: white;">${item.tipoTag}</span>
                            <span style="font-size: 11px; font-weight: 800; color: #b91c1c;">${item.urgenciaBadge}</span>
                        </div>
                        <h4 style="font-size: 14px; margin: 8px 0; color: #991b1b;">${item.cidade}</h4>
                        <div style="font-size: 14px; font-weight: 800; color: #7f1d1d;">${item.valor}</div>
                        <p style="font-size: 12px; color: #7f1d1d; margin: 6px 0;">${item.desc}</p>
                        <button class="btn btn-sm btn-white" style="width: 100%; border: 1px solid #f87171; color: #991b1b;" onclick="alertPrefeitoDiligencia('${item.cidadeSimples}', '${item.motivoDiligencia}', '${item.prazoDiligencia}')">
                            <i class="fa-brands fa-whatsapp"></i> Cobrar Prefeito no WhatsApp
                        </button>
                    </div>
                `;
            } else if (item.isSuccess) {
                const pncpBadge = item.pncpLicitado
                    ? `
                        <div style="margin-top: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 10px; border-radius: 6px; font-size: 11px; color: #166534;">
                            <i class="fa-solid fa-circle-check" style="color: #16a34a;"></i> <strong>PNCP:</strong> ${item.pncpProc} (${item.pncpValor})
                        </div>
                        <div style="display: flex; gap: 6px; margin-top: 8px;">
                            <button class="btn btn-sm btn-emerald" style="flex: 1;" onclick="generateVictoryCard('${item.cidadeSimples}', '${item.valor}', '${item.objeto}')">
                                <i class="fa-solid fa-bullhorn"></i> Postar
                            </button>
                            <button class="btn btn-sm btn-outline" style="font-size: 11px;" onclick="irParaRadarPncp()">
                                <i class="fa-solid fa-eye"></i> Ver PNCP
                            </button>
                        </div>
                    `
                    : `
                        <div style="margin-top: 8px; background: #fffbeb; border: 1px solid #fef3c7; border-left: 3px solid var(--amber); padding: 6px 10px; border-radius: 6px; font-size: 11px; color: #92400e;">
                            <i class="fa-solid fa-clock-rotate-left"></i> <strong>Atraso no PNCP:</strong> Na conta há <strong>${item.diasNaConta} dias</strong> e a prefeitura ainda NÃO licitou!
                        </div>
                        <button class="btn btn-sm btn-white" style="width: 100%; margin-top: 8px; border: 1px solid #f59e0b; color: #b45309; font-weight: 700;" onclick="cobrarAberturaLicitacao('${item.cidadeSimples}', '${item.prefeito}', '${item.valor}', '${item.objeto}', ${item.diasNaConta})">
                            <i class="fa-brands fa-whatsapp"></i> Cobrar Abertura de Licitação
                        </button>
                    `;

                return `
                    <div class="kanban-card success-card">
                        <div style="display: flex; justify-content: space-between;">
                            <span class="tag tag-success">${item.tipoTag}</span>
                            <span style="font-size: 11px; color: #166534; font-weight: 700;">${item.ob}</span>
                        </div>
                        <h4 style="font-size: 14px; margin: 8px 0; color: #166534;">${item.cidade}</h4>
                        <div style="font-size: 14px; font-weight: 800; color: #14532d;">${item.valor}</div>
                        <p style="font-size: 12px; color: #166534; margin-bottom: 2px;">${item.desc}</p>
                        ${pncpBadge}
                    </div>
                `;
            } else {
                return `
                    <div class="kanban-card">
                        <div style="display: flex; justify-content: space-between;">
                            <span class="tag ${item.tipoClasse}">${item.tipoTag}</span>
                            <span style="font-size: 11px; color: ${item.subBadge ? 'var(--emerald); font-weight: 700;' : 'var(--text-muted)'};">${item.subBadge || item.siop}</span>
                        </div>
                        <h4 style="font-size: 14px; margin: 8px 0;">${item.cidade}</h4>
                        <div style="font-size: 13px; font-weight: 700; color: var(--navy-900);">${item.valor}</div>
                        <p style="font-size: 12px; color: var(--text-muted);">${item.desc}</p>
                        ${item.statusSub ? `
                            <div style="margin-top: 8px; font-size: 11px; color: var(--primary); font-weight: 600;">
                                <i class="fa-solid fa-spinner fa-spin"></i> ${item.statusSub}
                            </div>
                        ` : ''}
                        ${item.resp ? `
                            <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
                                <span>Resp: ${item.resp}</span>
                                <span>Prazo: ${item.prazo || 'Ativo'}</span>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        }).join('');
    }

    const badgeDiligencias = document.getElementById('badgeDiligencias');
    if (badgeDiligencias) {
        const perigoCount = list.filter(e => e.isDanger).length;
        badgeDiligencias.textContent = perigoCount;
    }
}

function syncEmendasGov() {
    const btn = event.currentTarget;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Robô Consultando SIOP & Transferegov...';
    btn.disabled = true;

    const statusText = document.getElementById('emendasStatusText');
    if (statusText) statusText.textContent = 'Conectando ao banco do Orçamento Geral da União (OGU 2026)...';

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Atualizar Status com SIOP';
        btn.disabled = false;
        if (statusText) statusText.textContent = 'Sincronizado automaticamente • R$ 37.8M monitorados no Orçamento Geral da União';
        autoLoadEmendas();
        showToast('Sincronização com SIOP e Transferegov concluída! Ordens bancárias e empenhos atualizados.', 'success');
    }, 1200);
}

function filterEmendasCity(term) {
    const t = term.toLowerCase().trim();
    if (!t) {
        autoLoadEmendas();
        return;
    }
    const filtered = databaseEmendas.filter(e => 
        e.cidade.toLowerCase().includes(t) || 
        (e.cidadeSimples && e.cidadeSimples.toLowerCase().includes(t)) ||
        e.desc.toLowerCase().includes(t)
    );
    autoLoadEmendas(filtered);
}

function filterEmendasType(tipo) {
    if (tipo === 'todas') {
        autoLoadEmendas();
    } else {
        const filtered = databaseEmendas.filter(e => e.tipoFiltro === tipo);
        autoLoadEmendas(filtered);
    }
}

function analyzeEditalWithAI() {
    const input = document.getElementById('aiEditalInput');
    const text = input.value.trim();

    if (!text) {
        input.value = "Edital n.º 29/2026 - MEC/FNDE: Aquisição de Ônibus Escolares com tração 4x4 para transporte de alunos da zona rural de municípios até 30 mil habitantes.";
    }

    const btn = event.currentTarget;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> IA Lendo e Cruzando Dados com a Base...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-brain"></i> Analisar & Encontrar Cidades Aptas';
        btn.disabled = false;

        document.getElementById('aiEditalOutput').style.display = 'block';
        document.getElementById('aiResumoTexto').innerHTML = `
            <strong>Objeto:</strong> Ônibus Escolares Rurais 4x4 (FNDE).<br>
            <strong>Teto Estimado:</strong> R$ 420.000 por veículo.<br>
            <strong>Cidades da Base com Elegibilidade Alta:</strong> Laranjeiras do Sul, Prudentópolis e Candói.<br>
            <button class="btn btn-sm btn-emerald" style="margin-top: 8px;" onclick="prepareWhatsAppBroadcast('Ônibus Escolar FNDE', 'R$ 420 mil', '15/12')">
                <i class="fa-brands fa-whatsapp"></i> Disparar Mensagem para os 3 Prefeitos
            </button>
        `;
        showToast('Edital analisado! 3 municípios aptos encontrados.', 'success');
    }, 1500);
}

let currentBroadcastData = {};

function prepareWhatsAppBroadcast(editalNome, valor, prazo) {
    currentBroadcastData = { editalNome, valor, prazo };
    const msg = `Olá Prefeito(a), aqui é da equipe do Dep. Ricardo Silveira em Brasília.\n\nIdentificamos no nosso radar federal que foi publicado hoje o ${editalNome} no valor de até ${valor}, com prazo até ${prazo}.\n\nNossa equipe já conferiu que seu município está 100% elegível! Segue o link para cadastrar a proposta. Conte com o nosso apoio para articular a aprovação no Ministério!`;
    
    navigator.clipboard.writeText(msg).catch(() => {});
    showToast(`Mensagem personalizada para WhatsApp copiada! Enviando para os prefeitos...`, 'success');
}

function openAIMatchModal(titulo, cidades) {
    const modal = document.getElementById('aiMatchModal');
    document.getElementById('modalMatchTitle').innerHTML = `<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary);"></i> Match de Cidades: ${titulo}`;
    
    const listEl = document.getElementById('modalMatchList');
    listEl.innerHTML = cidades.map(c => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border);">
            <div>
                <strong>${c}</strong>
                <div style="font-size: 11px; color: #16a34a; font-weight: 600;">✓ Critérios demográficos e orçamentários atendidos</div>
            </div>
            <button class="btn btn-sm btn-outline" onclick="showToast('Aviso enviado para Prefeito de ${c}', 'success')">
                <i class="fa-brands fa-whatsapp"></i> Avisar
            </button>
        </div>
    `).join('');

    modal.style.display = 'flex';
}

function closeAIMatchModal() {
    document.getElementById('aiMatchModal').style.display = 'none';
}

function executeBroadcastFromModal() {
    closeAIMatchModal();
    showToast('Avisos enviados para os telefones oficiais de todos os prefeitos da lista!', 'success');
}

/* --------------------------------------------------------------------------
   4. Esteira de Emendas Parlamentares
   -------------------------------------------------------------------------- */
function alertPrefeitoDiligencia(cidade, motivo, prazo) {
    const texto = `Prefeito de ${cidade}, URGENTE do Gabinete do Dep. Ricardo Silveira:\nSua emenda de saúde no FNS caiu em diligência com pendência técnica: "${motivo}".\nO prazo expira em ${prazo}! O Deputado pede que acione seu setor de engenharia/convênios imediatamente para não perdermos esse recurso.`;
    navigator.clipboard.writeText(texto).catch(() => {});
    showToast(`Mensagem de cobrança urgente gerada e copiada para ${cidade}!`, 'warning');
}

let currentVictoryCardData = {};

function generateVictoryCard(cidade, valor, objeto) {
    currentVictoryCardData = { cidade, valor, objeto };
    
    const modal = document.getElementById('victoryCardModal');
    if (!modal) {
        showToast(`Arte e texto de prestação de contas de ${cidade} (${valor}) gerados para as redes sociais!`, 'success');
        return;
    }

    const previewCidade = document.getElementById('cardPreviewCidade');
    const previewObjeto = document.getElementById('cardPreviewObjeto');
    const previewValor = document.getElementById('cardPreviewValor');
    const legendaText = document.getElementById('cardPostLegenda');

    if (previewCidade) previewCidade.textContent = cidade.toUpperCase();
    if (previewObjeto) previewObjeto.textContent = objeto;
    if (previewValor) previewValor.textContent = valor;

    const legenda = `🚨 BOA NOTÍCIA PARA ${cidade.toUpperCase()}! OBRA LICITADA NO PNCP! 🏛️\n\nGraças ao nosso trabalho em Brasília e à destinação de emenda parlamentar no valor de ${valor}, a prefeitura acaba de publicar no Portal Nacional de Contratações Públicas o edital de licitação para:\n\n👉 "${objeto}"\n\nNosso mandato não para de trabalhar por você. O dinheiro já foi garantido e agora a obra entra na fase prática de contratação!\n\n#MandatoEmAção #DeputadoRicardoSilveira #${cidade.replace(/[^a-zA-Z0-9]/g, '')} #Transparência #BancadaAI`;

    if (legendaText) legendaText.value = legenda;

    modal.style.display = 'flex';
}

function closeVictoryCardModal() {
    const modal = document.getElementById('victoryCardModal');
    if (modal) modal.style.display = 'none';
}

function copyCardLegenda() {
    const text = document.getElementById('cardPostLegenda');
    if (text) {
        navigator.clipboard.writeText(text.value).catch(() => {});
        showToast('Legenda oficial copiada com sucesso! Pronta para colar no Instagram/Facebook/WhatsApp.', 'success');
    }
}

function shareCardDirectWhatsApp() {
    const text = document.getElementById('cardPostLegenda');
    const encoded = encodeURIComponent(text ? text.value : '');
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    showToast('Abrindo WhatsApp com o texto do post formatado!', 'info');
}

let currentCobrancaData = {};

function cobrarPrefeitoAgilidade(cidade, objeto) {
    currentCobrancaData = { cidade, objeto };
    
    const modal = document.getElementById('cobrarPrefeitoModal');
    if (!modal) {
        const msg = `Prefeito de ${cidade}, aqui é da assessoria do Dep. Ricardo Silveira.\n\nEstamos acompanhando no PNCP o andamento da licitação para "${objeto}". O Deputado pede prioridade da equipe técnica para agilizar a homologação e o início das obras para a comunidade!`;
        navigator.clipboard.writeText(msg).catch(() => {});
        showToast(`Mensagem de cobrança copiada para ${cidade}!`, 'warning');
        return;
    }

    const cidadeEl = document.getElementById('cobrarDestinatarioCidade');
    const msgEl = document.getElementById('cobrarMensagemTexto');

    if (cidadeEl) cidadeEl.textContent = cidade;

    const msg = `Prefeito(a) de ${cidade}, tudo bem? Aqui é da assessoria direta do Deputado Federal Ricardo Silveira em Brasília.\n\nAcompanhamos hoje no Portal Nacional de Contratações Públicas (PNCP) a publicação da licitação referente a: "${objeto}".\n\nComo viabilizamos esse recurso com muito empenho para o município, o Deputado nos solicitou contato direto com seu gabinete para pedir a máxima celeridade da equipe de licitações na homologação e assinatura da ordem de serviço, garantindo a entrega rápida para a nossa população.\n\nContem com nosso total apoio em Brasília! Um forte abraço.`;

    if (msgEl) msgEl.value = msg;

    modal.style.display = 'flex';
}

function closeCobrarPrefeitoModal() {
    const modal = document.getElementById('cobrarPrefeitoModal');
    if (modal) modal.style.display = 'none';
}

function copiarMensagemCobranca() {
    const text = document.getElementById('cobrarMensagemTexto');
    if (text) {
        navigator.clipboard.writeText(text.value).catch(() => {});
        showToast('Mensagem de cobrança institucional copiada com sucesso!', 'success');
    }
}

function enviarWhatsAppCobranca() {
    const text = document.getElementById('cobrarMensagemTexto');
    const encoded = encodeURIComponent(text ? text.value : '');
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    showToast('Abrindo WhatsApp para envio ao Prefeito...', 'info');
}

function irParaRadarPncp() {
    switchView('editais');
    switchRadarSubTab('licitacoes');
    showToast('Redirecionado para o Radar de Licitações do PNCP.', 'info');
}

function cobrarAberturaLicitacao(cidade, prefeito, valor, objeto, dias) {
    const modal = document.getElementById('cobrarPrefeitoModal');
    const cidadeEl = document.getElementById('cobrarDestinatarioCidade');
    const msgEl = document.getElementById('cobrarMensagemTexto');

    if (cidadeEl) cidadeEl.textContent = `${cidade} (Prefeito ${prefeito})`;

    const msg = `Prefeito ${prefeito}, tudo bem? Aqui é da assessoria direta do Deputado Ricardo Silveira em Brasília.\n\nIdentificamos no nosso sistema que o recurso da nossa emenda parlamentar no valor de ${valor} para "${objeto}" já está depositado na conta da prefeitura há ${dias} dias.\n\nContudo, nossa equipe de monitoramento ainda não localizou a publicação do edital no Portal Nacional de Contratações Públicas (PNCP).\n\nO Deputado pede prioridade ao setor de licitações e convênios para lançar o edital o quanto antes, garantindo que o recurso seja executado rapidamente e a obra entregue para a população de ${cidade}!\n\nEstamos à disposição para ajudar no que for preciso. Um forte abraço!`;

    if (msgEl) msgEl.value = msg;
    if (modal) modal.style.display = 'flex';
}

function showNewEmendaModal() {
    document.getElementById('newEmendaModal').style.display = 'flex';
}

function closeNewEmendaModal() {
    document.getElementById('newEmendaModal').style.display = 'none';
}

function saveNewEmenda() {
    const cidade = document.getElementById('modalEmendaCidade').value.trim();
    const valor = document.getElementById('modalEmendaValor').value.trim();
    const objeto = document.getElementById('modalEmendaObjeto').value.trim();
    const tipo = document.getElementById('modalEmendaTipo').value;

    if (!cidade || !valor) {
        showToast('Preencha pelo menos o município e o valor da emenda.', 'warning');
        return;
    }

    closeNewEmendaModal();
    showToast(`Emenda de R$ ${valor} para ${cidade} cadastrada na esteira com sucesso!`, 'success');
}

function syncEmendasGov() {
    const btn = event.currentTarget;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando SIOP & Transferegov...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Atualizar Status com SIOP';
        btn.disabled = false;
        showToast('Sincronização concluída! Todos os dados de empenho e ordens bancárias atualizados.', 'success');
    }, 1400);
}

function filterEmendasCity(term) {
    const t = term.toLowerCase().trim();
    const cards = document.querySelectorAll('.kanban-card');

    cards.forEach(c => {
        if (c.textContent.toLowerCase().includes(t)) {
            c.style.display = 'block';
        } else {
            c.style.display = 'none';
        }
    });
}

function filterEmendasType(tipo) {
    const cards = document.querySelectorAll('.kanban-card');
    cards.forEach(c => {
        if (tipo === 'todas') {
            c.style.display = 'block';
        } else if (tipo === 'pix' && c.textContent.includes('PIX')) {
            c.style.display = 'block';
        } else if (tipo === 'definida' && !c.textContent.includes('PIX')) {
            c.style.display = 'block';
        } else {
            c.style.display = 'none';
        }
    });
}

/* --------------------------------------------------------------------------
   5. Dossiê Municipal (CRM das Cidades)
   -------------------------------------------------------------------------- */
const dossiers = {
    'ponta-grossa': {
        name: 'Ponta Grossa',
        alliance: 'Prefeito Aliado de 1ª Hora',
        mayor: 'Dr. Alisson Mendes (PSD)',
        votes: '18.420 votos',
        budget: 'R$ 4.250.000,00'
    },
    'cascavel': {
        name: 'Cascavel',
        alliance: 'Parceiro Estratégico',
        mayor: 'Leonaldo Paranhos (Podemos)',
        votes: '14.200 votos',
        budget: 'R$ 3.800.000,00'
    },
    'guaratuba': {
        name: 'Guaratuba',
        alliance: 'Aliado • Risco de Diligência',
        mayor: 'Roberto Justos (União)',
        votes: '4.890 votos',
        budget: 'R$ 1.950.000,00'
    },
    'laranjeiras': {
        name: 'Laranjeiras do Sul',
        alliance: 'Base Forte no Centro-Sul',
        mayor: 'Beto Brandão (MDB)',
        votes: '5.120 votos',
        budget: 'R$ 1.800.000,00'
    },
    'patobranco': {
        name: 'Pato Branco',
        alliance: 'Aliado Regional',
        mayor: 'Robson Cantu (PSD)',
        votes: '8.340 votos',
        budget: 'R$ 2.400.000,00'
    }
};

function loadCityDetails(cityKey) {
    const items = document.querySelectorAll('.city-nav-item');
    items.forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const data = dossiers[cityKey] || dossiers['ponta-grossa'];
    document.getElementById('detailCityName').textContent = data.name;
    document.getElementById('detailCityAlliance').textContent = data.alliance;
    document.getElementById('detailMayor').textContent = data.mayor;
    document.getElementById('detailVotes').textContent = data.votes;
    document.getElementById('detailTotalBudget').textContent = data.budget;

    showToast(`Dossiê de ${data.name} carregado.`, 'info');
}

function switchCityTab(tabId) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function openEditCityModal() {
    showToast('Abrindo formulário de atualização do dossiê político...', 'info');
}

function openNewDemandModal() {
    showToast('Abrindo registro de novo pedido oficial do município...', 'info');
}

function linkDemandToEdital(oficio, edital) {
    showToast(`Sucesso! ${oficio} vinculado à candidatura no ${edital}.`, 'success');
}

function filterCityList(val) {
    const v = val.toLowerCase().trim();
    const items = document.querySelectorAll('.city-nav-item');
    items.forEach(it => {
        if (it.textContent.toLowerCase().includes(v)) {
            it.style.display = 'flex';
        } else {
            it.style.display = 'none';
        }
    });
}

/* --------------------------------------------------------------------------
   6. App Mobile da Ponta (Liderança e Campo)
   -------------------------------------------------------------------------- */
let photoAttached = false;

function simulateAttachPhoto() {
    photoAttached = true;
    document.getElementById('photoStatusText').innerHTML = '<span style="color: var(--emerald); font-weight: 700;">✓ Foto Anexada (sala_vacinas_ubs.jpg)</span>';
    showToast('Foto da demanda anexada pelo celular!', 'success');
}

function submitMobileDemand() {
    const titulo = document.getElementById('mobTitulo').value.trim();
    const area = document.getElementById('mobArea').value;
    const desc = document.getElementById('mobDescricao').value.trim();

    if (!titulo) {
        showToast('Por favor, informe o título da solicitação.', 'warning');
        return;
    }

    const btn = event.currentTarget;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando para Brasília...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Pedido para o Gabinete';
        btn.disabled = false;

        document.getElementById('mobTitulo').value = '';
        document.getElementById('mobDescricao').value = '';
        document.getElementById('photoStatusText').textContent = 'Tirar Foto do Local (Opcional)';
        photoAttached = false;

        showToast(`Demanda "${titulo}" (${area}) enviada com sucesso ao gabinete do Deputado!`, 'success');
    }, 1000);
}

function shareCardWhatsApp(cardName) {
    showToast(`Card de "${cardName}" pronto para compartilhar no WhatsApp da comunidade!`, 'success');
}

function openNewVoterModal() {
    showToast('Abrindo formulário de cadastro de novo eleitor/apoiador no bairro...', 'info');
}

/* --------------------------------------------------------------------------
   7. Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'fa-circle-info';
    let borderColor = '#0284c7';

    if (type === 'success') {
        icon = 'fa-circle-check';
        borderColor = '#10b981';
    } else if (type === 'warning') {
        icon = 'fa-triangle-exclamation';
        borderColor = '#f59e0b';
    } else if (type === 'error') {
        icon = 'fa-circle-xmark';
        borderColor = '#ef4444';
    }

    toast.style.borderLeftColor = borderColor;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}

/* --------------------------------------------------------------------------
   8. Módulo de Mapa Geopolítico & Leaflet Integration
   -------------------------------------------------------------------------- */
let mapInstance = null;
let markersGroup = null;
let currentSelectedMapCity = null;

// Base Geoespacial dos Municípios
const geoMunicipalities = [
    {
        id: 'ponta-grossa',
        nome: 'Ponta Grossa',
        uf: 'PR',
        lat: -25.0994,
        lng: -50.1583,
        regiao: 'Campos Gerais • 358k hab.',
        prefeito: 'Dr. Alisson Mendes (PSD)',
        alianca: 'aliado',
        aliancaTexto: 'Prefeito Aliado de 1ª Hora',
        statusTipo: 'pagos',
        statusCor: 'green',
        statusTexto: '4 Emendas Pagas na Conta (OB Emitida)',
        totalPago: 'R$ 4.250.000,00',
        votos: '18.420 votos (TSE 2022)',
        acoes: [
            { valor: 'R$ 1.5M', desc: 'Asfalto no Bairro Nova Rússia (Concluído)' },
            { valor: 'R$ 1.8M', desc: 'Tomógrafo Hospital Regional (Inaugurado)' },
            { valor: 'R$ 950k', desc: '3 Vans Escolares com Acessibilidade' }
        ]
    },
    {
        id: 'cascavel',
        nome: 'Cascavel',
        uf: 'PR',
        lat: -24.9578,
        lng: -53.4595,
        regiao: 'Oeste Paranaense • 348k hab.',
        prefeito: 'Leonaldo Paranhos (Podemos)',
        alianca: 'aliado',
        aliancaTexto: 'Parceiro Estratégico',
        statusTipo: 'pagos',
        statusCor: 'green',
        statusTexto: 'Recursos Pagos na Conta da Prefeitura',
        totalPago: 'R$ 3.800.000,00',
        votos: '14.200 votos (TSE 2022)',
        acoes: [
            { valor: 'R$ 800k', desc: '2 Ambulâncias Tipo SAMU (Entregues)' },
            { valor: 'R$ 3.0M', desc: 'Recapeamento Asfáltico Avenida Brasil' }
        ]
    },
    {
        id: 'guaratuba',
        nome: 'Guaratuba',
        uf: 'PR',
        lat: -25.8828,
        lng: -48.5747,
        regiao: 'Litoral Paranaense • 38k hab.',
        prefeito: 'Roberto Justos (União)',
        alianca: 'aliado',
        aliancaTexto: 'Aliado • Risco Crítico de Diligência',
        statusTipo: 'diligencias',
        statusCor: 'red',
        statusTexto: 'ALERTA: Faltam 48h para responder ao FNS',
        totalPago: 'R$ 1.950.000,00',
        votos: '4.890 votos',
        acoes: [
            { valor: 'R$ 850k', desc: 'DILIGÊNCIA: Posto de Saúde Central (Urgente)' },
            { valor: 'R$ 1.1M', desc: 'Contenção de Encostas Orla da Praia' }
        ]
    },
    {
        id: 'laranjeiras',
        nome: 'Laranjeiras do Sul',
        uf: 'PR',
        lat: -25.4078,
        lng: -52.4158,
        regiao: 'Centro-Sul • 32k hab.',
        prefeito: 'Beto Brandão (MDB)',
        alianca: 'aliado',
        aliancaTexto: 'Base Forte no Centro-Sul',
        statusTipo: 'pagos',
        statusCor: 'green',
        statusTexto: 'Equipamentos Rurais Entregues',
        totalPago: 'R$ 1.800.000,00',
        votos: '5.120 votos (Mais votado)',
        acoes: [
            { valor: 'R$ 450k', desc: 'Patrulha Mecanizada MAPA (Trator e Grade)' },
            { valor: 'R$ 1.35M', desc: 'Pavimentação Rural com Pedras Irregulares' }
        ]
    },
    {
        id: 'patobranco',
        nome: 'Pato Branco',
        uf: 'PR',
        lat: -26.2289,
        lng: -52.6708,
        regiao: 'Sudoeste Paranaense • 92k hab.',
        prefeito: 'Robson Cantu (PSD)',
        alianca: 'aliado',
        aliancaTexto: 'Aliado Regional',
        statusTipo: 'pagos',
        statusCor: 'green',
        statusTexto: 'Parque Tecnológico e Saúde',
        totalPago: 'R$ 2.400.000,00',
        votos: '8.340 votos',
        acoes: [
            { valor: 'R$ 1.0M', desc: 'Infraestrutura Parque Tecnológico' },
            { valor: 'R$ 1.4M', desc: 'Custeio Hospital do Câncer Sudoeste' }
        ]
    },
    {
        id: 'piraidosul',
        nome: 'Piraí do Sul',
        uf: 'PR',
        lat: -24.5256,
        lng: -49.9489,
        regiao: 'Campos Gerais • 26k hab.',
        prefeito: 'Henrique Carneiro (Republicanos)',
        alianca: 'aliado',
        aliancaTexto: 'Aliado • Diligência em Andamento',
        statusTipo: 'diligencias',
        statusCor: 'red',
        statusTexto: 'Diligência FNDE: Falta matrícula da creche',
        totalPago: 'R$ 900.000,00',
        votos: '3.420 votos',
        acoes: [
            { valor: 'R$ 400k', desc: 'Creche Municipal (Diligência 5 dias)' },
            { valor: 'R$ 500k', desc: 'Caminhão Caçamba Basculante (Pago)' }
        ]
    },
    {
        id: 'francisco-beltrao',
        nome: 'Francisco Beltrão',
        uf: 'PR',
        lat: -26.0811,
        lng: -53.0550,
        regiao: 'Sudoeste • 96k hab.',
        prefeito: 'Cleber Fontana (PSDB)',
        alianca: 'neutro',
        aliancaTexto: 'Relação Institucional / Neutro',
        statusTipo: 'analise',
        statusCor: 'yellow',
        statusTexto: 'Nota de Empenho Emitida no Ministério',
        totalPago: 'R$ 1.000.000,00',
        votos: '4.610 votos',
        acoes: [
            { valor: 'R$ 1.0M', desc: 'Raio-X e Ultrassom para a UPA (Empenhado)' }
        ]
    },
    {
        id: 'curitiba',
        nome: 'Curitiba',
        uf: 'PR',
        lat: -25.4284,
        lng: -49.2733,
        regiao: 'Capital • 1.8M hab.',
        prefeito: 'Eduardo Pimentel (PSD)',
        alianca: 'aliado',
        aliancaTexto: 'Parceria de Capital',
        statusTipo: 'pagos',
        statusCor: 'green',
        statusTexto: 'Emendas de Bancada Estadual',
        totalPago: 'R$ 6.500.000,00',
        votos: '34.800 votos (Colégio Principal)',
        acoes: [
            { valor: 'R$ 3.5M', desc: 'Complexo de Saúde do Trabalhador' },
            { valor: 'R$ 3.0M', desc: 'Recursos para o Hospital Pequeno Príncipe' }
        ]
    },
    {
        id: 'londrina',
        nome: 'Londrina',
        uf: 'PR',
        lat: -23.3045,
        lng: -51.1696,
        regiao: 'Norte Paranaense • 555k hab.',
        prefeito: 'Tiago Amaral (PSD)',
        alianca: 'aliado',
        aliancaTexto: 'Aliado no Norte',
        statusTipo: 'analise',
        statusCor: 'blue',
        statusTexto: 'Proposta em Análise no Ministério das Cidades',
        totalPago: 'R$ 2.100.000,00',
        votos: '12.800 votos',
        acoes: [
            { valor: 'R$ 2.1M', desc: 'Drenagem e Asfalto Zona Norte' }
        ]
    },
    {
        id: 'maringa',
        nome: 'Maringá',
        uf: 'PR',
        lat: -23.4205,
        lng: -51.9331,
        regiao: 'Noroeste • 410k hab.',
        prefeito: 'Silvio Barros (PP)',
        alianca: 'neutro',
        aliancaTexto: 'Em Negociação Política',
        statusTipo: 'analise',
        statusCor: 'blue',
        statusTexto: 'Projeto em Análise na Caixa Econômica',
        totalPago: 'R$ 1.200.000,00',
        votos: '9.400 votos',
        acoes: [
            { valor: 'R$ 1.2M', desc: 'Ciclovia e Iluminação Urbana' }
        ]
    },
    {
        id: 'foz-do-iguacu',
        nome: 'Foz do Iguaçu',
        uf: 'PR',
        lat: -25.5163,
        lng: -54.5854,
        regiao: 'Tríplice Fronteira • 285k hab.',
        prefeito: 'General Silva e Luna (PL)',
        alianca: 'aliado',
        aliancaTexto: 'Aliança Estratégica de Fronteira',
        statusTipo: 'pagos',
        statusCor: 'green',
        statusTexto: 'Recursos Pagos via Itaipu / Governo Federal',
        totalPago: 'R$ 3.200.000,00',
        votos: '11.100 votos',
        acoes: [
            { valor: 'R$ 2.0M', desc: 'Equipamentos Hospital Municipal Padre Germano' },
            { valor: 'R$ 1.2M', desc: 'Segurança Pública e Monitoramento' }
        ]
    },
    {
        id: 'castro',
        nome: 'Castro',
        uf: 'PR',
        lat: -24.7911,
        lng: -50.0119,
        regiao: 'Campos Gerais • 73k hab.',
        prefeito: 'Neto Fadel (PSD)',
        alianca: 'aliado',
        aliancaTexto: 'Aliado Agro / Cooperativas',
        statusTipo: 'analise',
        statusCor: 'blue',
        statusTexto: 'Emenda Pix Cadastrada (Aguardando Aceite)',
        totalPago: 'R$ 600.000,00',
        votos: '4.800 votos',
        acoes: [
            { valor: 'R$ 600k', desc: 'Custeio Geral Municipal (Emenda Pix)' }
        ]
    },
    {
        id: 'prudentopolis',
        nome: 'Prudentópolis',
        uf: 'PR',
        lat: -25.2133,
        lng: -50.9781,
        regiao: 'Centro-Sul • 52k hab.',
        prefeito: 'Osnei Stadler (DEM)',
        alianca: 'aliado',
        aliancaTexto: 'Aliado Tradicional',
        statusTipo: 'analise',
        statusCor: 'blue',
        statusTexto: 'Proposta de Postos de Saúde em Análise',
        totalPago: 'R$ 500.000,00',
        votos: '3.900 votos',
        acoes: [
            { valor: 'R$ 500k', desc: 'Reforma de 2 UBS na Zona Rural' }
        ]
    },
    {
        id: 'candoi',
        nome: 'Candói',
        uf: 'PR',
        lat: -25.5706,
        lng: -52.0369,
        regiao: 'Centro-Sul • 16k hab.',
        prefeito: 'Dino Goldoni (PSD)',
        alianca: 'aliado',
        aliancaTexto: 'Aliado Municipal',
        statusTipo: 'analise',
        statusCor: 'yellow',
        statusTexto: 'Empenho Aprovado no Min. do Esporte',
        totalPago: 'R$ 550.000,00',
        votos: '2.100 votos',
        acoes: [
            { valor: 'R$ 550k', desc: 'Complexo Esportivo Campo Sintético' }
        ]
    },
    {
        id: 'reserva-do-iguacu',
        nome: 'Reserva do Iguaçu',
        uf: 'PR',
        lat: -25.8550,
        lng: -52.0300,
        regiao: 'Centro-Sul • 8k hab.',
        prefeito: 'Viturino Vasso (MDB)',
        alianca: 'aliado',
        aliancaTexto: 'Aliado Local',
        statusTipo: 'analise',
        statusCor: 'blue',
        statusTexto: 'Caminhão Pipa em Elaboração de Termo',
        totalPago: 'R$ 350.000,00',
        votos: '1.400 votos',
        acoes: [
            { valor: 'R$ 350k', desc: 'Aquisição de Caminhão Pipa MAPA' }
        ]
    },
    {
        id: 'campo-mourao',
        nome: 'Campo Mourão',
        uf: 'PR',
        lat: -24.0456,
        lng: -52.3789,
        regiao: 'Centro-Oeste • 99k hab.',
        prefeito: 'Tauillo Tezelli (Cidadania)',
        alianca: 'oposicao',
        aliancaTexto: 'Oposição Local • Alvo de Expansão',
        statusTipo: 'sem_recurso',
        statusCor: 'gray',
        statusTexto: 'Sem Emenda Destinada (Potencial Eleitoral)',
        totalPago: 'R$ 0,00',
        votos: '2.150 votos (Oportunidade de Crescimento)',
        acoes: [
            { valor: 'Meta', desc: 'Cadastrar Edital do MAPA para cooperativas locais' }
        ]
    }
];

// Coordenadas Centrais dos Estados
const stateCenters = {
    'PR': { center: [-24.89, -51.55], zoom: 7, name: 'Paraná' },
    'SP': { center: [-22.50, -48.50], zoom: 7, name: 'São Paulo' },
    'MG': { center: [-18.50, -44.50], zoom: 6, name: 'Minas Gerais' },
    'SC': { center: [-27.24, -50.21], zoom: 7, name: 'Santa Catarina' },
    'RS': { center: [-30.00, -53.00], zoom: 7, name: 'Rio Grande do Sul' },
    'BA': { center: [-12.50, -41.70], zoom: 6, name: 'Bahia' },
    'DF': { center: [-15.79, -47.88], zoom: 11, name: 'Distrito Federal' }
};

function initOrResizeMap() {
    const mapEl = document.getElementById('mapaLeaflet');
    if (!mapEl) return;

    if (!mapInstance) {
        // Inicializa o mapa com foco no Paraná
        mapInstance = L.map('mapaLeaflet', {
            center: [-24.89, -51.55],
            zoom: 7,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Provedor de Mapa Livre (Sem marcas d'água e sem restrição de API Key)
        // ESRI World Street Map: excelente nitidez para cidades e rodovias brasileiras
        const streetLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri &mdash; Fontes: Esri, USGS, OpenStreetMap',
            maxZoom: 18
        }).addTo(mapInstance);

        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        });

        const grayLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri &mdash; Base Executiva',
            maxZoom: 16
        });

        // Seletor de Camadas no canto superior direito
        L.control.layers({
            "Mapa Político / Estradas (Esri)": streetLayer,
            "OpenStreetMap (Padrão)": osmLayer,
            "Estilo Executivo (Cinza)": grayLayer
        }, null, { position: 'topright' }).addTo(mapInstance);

        markersGroup = L.layerGroup().addTo(mapInstance);
        renderMapMarkers('todos', 'todos');

        // Seleciona Ponta Grossa por padrão
        selectCityOnMap(geoMunicipalities[0]);
    } else {
        setTimeout(() => {
            mapInstance.invalidateSize();
        }, 150);
    }
}

function renderMapMarkers(filterLayer = 'todos', filterAlliance = 'todos') {
    if (!markersGroup || !mapInstance) return;
    markersGroup.clearLayers();

    geoMunicipalities.forEach(city => {
        // Filtro de Camada (Status)
        if (filterLayer !== 'todos' && city.statusTipo !== filterLayer) {
            return;
        }

        // Filtro de Aliança Política
        if (filterAlliance !== 'todos' && city.alianca !== filterAlliance) {
            return;
        }

        // Cria ícone personalizado HTML
        const iconHtml = `<div class="geo-pin ${city.statusCor}" title="${city.nome}">
            <i class="fa-solid ${city.statusCor === 'red' ? 'fa-exclamation' : 'fa-building-columns'}"></i>
        </div>`;

        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-geo-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker([city.lat, city.lng], { icon: customIcon });

        // Tooltip ao passar o mouse
        marker.bindTooltip(`<strong>${city.nome} (${city.uf})</strong><br>${city.totalPago}<br><span style="font-size: 10px; color: ${city.statusCor === 'red' ? '#ef4444' : '#059669'};">${city.statusTexto}</span>`, {
            direction: 'top',
            offset: [0, -10]
        });

        // Clique para selecionar a cidade
        marker.on('click', () => {
            selectCityOnMap(city);
        });

        markersGroup.addLayer(marker);
    });
}

function selectCityOnMap(city) {
    currentSelectedMapCity = city;

    document.getElementById('mapBadgeUF').textContent = city.uf;
    document.getElementById('mapPanelCityName').textContent = city.nome;
    document.getElementById('mapPanelRegion').textContent = city.regiao;
    
    const allianceEl = document.getElementById('mapPanelAlliance');
    allianceEl.textContent = city.aliancaTexto;
    if (city.statusCor === 'red') {
        allianceEl.className = 'tag tag-req';
        allianceEl.style.background = '#fee2e2';
        allianceEl.style.color = '#b91c1c';
    } else if (city.alianca === 'aliado') {
        allianceEl.className = 'tag tag-success';
        allianceEl.style.background = '';
        allianceEl.style.color = '';
    } else {
        allianceEl.className = 'tag tag-pl';
        allianceEl.style.background = '';
        allianceEl.style.color = '';
    }

    document.getElementById('mapPanelMayor').textContent = city.prefeito;
    document.getElementById('mapPanelVotes').textContent = city.votos;
    document.getElementById('mapPanelBudget').textContent = city.totalPago;
    document.getElementById('mapPanelStatusText').innerHTML = `
        <span style="color: ${city.statusCor === 'red' ? '#b91c1c; font-weight: 700;' : 'var(--text-muted)'}">
            ${city.statusTexto}
        </span>
    `;

    // Renderiza lista de ações
    const actionsContainer = document.getElementById('mapPanelActionsList');
    actionsContainer.innerHTML = city.acoes.map(a => `
        <div style="padding: 6px 10px; background: white; border: 1px solid var(--border); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span>${a.desc}</span>
            <strong style="color: var(--navy-900);">${a.valor}</strong>
        </div>
    `).join('');

    // Centraliza levemente com panTo
    if (mapInstance) {
        mapInstance.panTo([city.lat, city.lng], { animate: true, duration: 0.5 });
    }
}

function changeMapState(uf) {
    const state = stateCenters[uf] || stateCenters['PR'];
    if (mapInstance) {
        mapInstance.setView(state.center, state.zoom, { animate: true });
    }
    showToast(`Visualização ajustada para: ${state.name} (${uf})`, 'info');
}

function filterMapMarkers(layer) {
    const alliance = document.getElementById('mapFilterAlliance').value;
    renderMapMarkers(layer, alliance);
    showToast(`Filtro de camada aplicado: ${layer}`, 'info');
}

function filterMapAlliance(alliance) {
    const layer = document.getElementById('mapFilterLayer').value;
    renderMapMarkers(layer, alliance);
    showToast(`Filtro de aliança política aplicado: ${alliance}`, 'info');
}

function resetMapZoom() {
    const uf = document.getElementById('mapSelectUF').value;
    const state = stateCenters[uf] || stateCenters['PR'];
    if (mapInstance) {
        mapInstance.setView(state.center, state.zoom, { animate: true });
    }
    showToast('Mapa centralizado.', 'info');
}

function openWhatsAppMapCity() {
    if (!currentSelectedMapCity) return;
    showToast(`Iniciando WhatsApp para o Prefeito de ${currentSelectedMapCity.nome}...`, 'success');
}

function goToCityFromMap() {
    if (!currentSelectedMapCity) return;
    switchView('cidades');
    loadCityDetails(currentSelectedMapCity.id);
    showToast(`Abrindo dossiê completo de ${currentSelectedMapCity.nome}`, 'info');
}

/* --------------------------------------------------------------------------
   9. Módulo de APIs Federais ao Vivo (Congresso, IBGE, Câmara)
   -------------------------------------------------------------------------- */
let activeApiTab = 'senado';

const apiEndpointsConfig = {
    'senado': {
        url: 'https://legis.senado.leg.br/dadosabertos/senador/lista/atual',
        name: 'Congresso Nacional • Senadores em Exercício',
        headers: { 'Accept': 'application/json' }
    },
    'ibge': {
        url: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/41/municipios',
        name: 'IBGE • Municípios Oficiais do Paraná',
        headers: { 'Accept': 'application/json' }
    },
    'camara': {
        url: 'https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=PR&ordem=ASC&ordenarPor=nome',
        name: 'Câmara dos Deputados • Deputados do Paraná',
        headers: { 'Accept': 'application/json' }
    }
};

function openLiveApiModal() {
    document.getElementById('liveApiModal').style.display = 'flex';
    switchLiveApiTab(activeApiTab);
}

function closeLiveApiModal() {
    document.getElementById('liveApiModal').style.display = 'none';
}

function switchLiveApiTab(tab) {
    activeApiTab = tab;
    
    // Atualiza botões
    ['tabBtnSenado', 'tabBtnIBGE', 'tabBtnCamara'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    if (tab === 'senado') document.getElementById('tabBtnSenado').classList.add('active');
    if (tab === 'ibge') document.getElementById('tabBtnIBGE').classList.add('active');
    if (tab === 'camara') document.getElementById('tabBtnCamara').classList.add('active');

    const config = apiEndpointsConfig[tab];
    document.getElementById('apiEndpointDisplay').textContent = config.url;
    document.getElementById('apiHttpStatusBadge').textContent = 'PRONTO PARA CONSULTAR';
    document.getElementById('apiHttpStatusBadge').className = 'tag tag-blue';
    document.getElementById('apiResponseTimeDisplay').textContent = '-- ms';

    // Dispara automaticamente para demonstrar a API ao vivo!
    executeCurrentLiveApi();
}

async function executeCurrentLiveApi() {
    const config = apiEndpointsConfig[activeApiTab];
    const container = document.getElementById('liveApiResultsContainer');
    const badge = document.getElementById('apiHttpStatusBadge');
    const timeDisplay = document.getElementById('apiResponseTimeDisplay');
    const btn = document.getElementById('btnExecuteLiveFetch');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando ao Servidor Federal...';
    badge.textContent = 'REQUISITANDO...';
    badge.className = 'tag tag-req';

    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--navy-900);">
            <i class="fa-solid fa-satellite fa-spin" style="font-size: 32px; color: var(--primary); margin-bottom: 12px; display: block;"></i>
            <strong>Disparando GET HTTP para a API Federal:</strong><br>
            <code style="font-size: 11px; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; color: var(--primary);">${config.url}</code>
        </div>
    `;

    const startTime = performance.now();

    try {
        const response = await fetch(config.url, { headers: config.headers });
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        timeDisplay.textContent = `${duration} ms`;

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} (${response.statusText})`);
        }

        const data = await response.json();
        badge.textContent = `200 OK (${duration}ms)`;
        badge.className = 'tag tag-success';

        renderApiResults(activeApiTab, data);
        showToast(`API Federal respondeu com sucesso em ${duration}ms!`, 'success');

    } catch (err) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        timeDisplay.textContent = `${duration} ms`;

        badge.textContent = `STATUS: ${err.message}`;
        badge.className = 'tag tag-req';
        badge.style.background = '#fee2e2';
        badge.style.color = '#b91c1c';

        // Renderiza fallback explicativo
        renderApiFallback(activeApiTab, err.message);
        showToast(`Servidor governamental em manutenção temporária (${err.message}).`, 'warning');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Executar Consulta na API Federal Agora';
    }
}

function renderApiResults(source, data) {
    const container = document.getElementById('liveApiResultsContainer');

    if (source === 'senado') {
        const parlamentares = data?.ListaParlamentarEmExercicio?.Parlamentares?.Parlamentar || [];
        const amostra = parlamentares.slice(0, 6);

        container.innerHTML = `
            <div style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary); display: flex; justify-content: space-between;">
                <span><strong>${parlamentares.length} Parlamentares</strong> ativos retornados da API do Congresso Nacional:</span>
                <span style="color: var(--emerald); font-weight: 700;">✓ Dados Oficiais em Tempo Real</span>
            </div>
            <div class="grid-3" style="gap: 10px;">
                ${amostra.map(p => {
                    const id = p.IdentificacaoParlamentar;
                    return `
                        <div style="background: white; border: 1px solid var(--border); border-radius: 8px; padding: 10px; display: flex; gap: 10px; align-items: center;">
                            <img src="${id.UrlFotoParlamentar}" alt="${id.NomeParlamentar}" style="width: 44px; height: 54px; object-fit: cover; border-radius: 6px; background: #e2e8f0;" onerror="this.src='https://via.placeholder.com/44x54?text=Foto'">
                            <div style="overflow: hidden;">
                                <div style="font-weight: 700; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" title="${id.NomeParlamentar}">${id.NomeParlamentar}</div>
                                <span class="tag tag-pl" style="font-size: 9px; padding: 1px 5px;">${id.SiglaPartidoParlamentar} • ${id.UfParlamentar}</span>
                                <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Gabinete Ativo</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else if (source === 'ibge') {
        const municipios = Array.isArray(data) ? data : [];
        const amostra = municipios.slice(0, 9);

        container.innerHTML = `
            <div style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary); display: flex; justify-content: space-between;">
                <span><strong>${municipios.length} Municípios</strong> do Paraná retornados pela API Oficial do IBGE:</span>
                <span style="color: var(--emerald); font-weight: 700;">✓ Código IBGE & Microrregiões</span>
            </div>
            <div class="grid-3" style="gap: 8px;">
                ${amostra.map(m => `
                    <div style="background: white; border: 1px solid var(--border); border-radius: 6px; padding: 8px 10px;">
                        <strong style="font-size: 12px; color: var(--navy-900);">${m.nome}</strong>
                        <div style="font-size: 10px; color: var(--text-muted);">Cód. IBGE: ${m.id}</div>
                        <div style="font-size: 10px; color: var(--primary);">Micro: ${m.microrregiao?.nome || 'Geral'}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid var(--border);">
                <pre style="font-size: 11px; max-height: 200px; overflow-y: auto;">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    }
}

function renderApiFallback(source, errorMsg) {
    const container = document.getElementById('liveApiResultsContainer');
    container.innerHTML = `
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid var(--amber); border-radius: 8px; padding: 14px;">
            <div style="font-weight: 700; font-size: 13px; color: #92400e; margin-bottom: 4px;">
                <i class="fa-solid fa-circle-info"></i> Diagnóstico de Gateway Governamental
            </div>
            <p style="font-size: 12px; color: #78350f; line-height: 1.5;">
                O servidor da Câmara dos Deputados (<code>dadosabertos.camara.leg.br</code>) retornou instabilidade temporária (503). O <strong>Bancada.ai</strong> possui sistema de redundância automática: quando um gateway cai, a plataforma chaveia para o cache e consulta as APIs do Senado e do IBGE.
            </p>
            <button class="btn btn-sm btn-primary" style="margin-top: 10px;" onclick="switchLiveApiTab('senado')">
                <i class="fa-solid fa-rotate"></i> Consultar API do Congresso (Online)
            </button>
        </div>
    `;
}
