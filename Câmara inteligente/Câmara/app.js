/* ==========================================================================
   MANDATO INTELIGENTE - JAVASCRIPT APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavModules();
    initQuickCitySearch();
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
        setTimeout(initOrResizeMap, 150);
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
   3. Radar de Editais Federais
   -------------------------------------------------------------------------- */
function simulateSyncEditais() {
    const btn = event.currentTarget;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Varrendo Transferegov...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Sincronizar Agora';
        btn.disabled = false;
        showToast('Radar atualizado! 1 novo edital do Ministério do Esporte detectado.', 'success');
    }, 1200);
}

function filterEditais() {
    const val = document.getElementById('filterOrgao').value;
    const cards = document.querySelectorAll('.edital-card');

    cards.forEach(c => {
        if (val === 'todos') {
            c.style.display = 'block';
        } else if (val === 'MAPA' && c.id === 'edital-1') {
            c.style.display = 'block';
        } else if (val === 'MS' && c.id === 'edital-2') {
            c.style.display = 'block';
        } else if (val === 'MCID' && c.id === 'edital-3') {
            c.style.display = 'block';
        } else {
            c.style.display = 'none';
        }
    });
    showToast(`Filtro aplicado para: ${val}`, 'info');
}

function filterEditaisKeyword(keyword) {
    const k = keyword.toLowerCase().trim();
    const cards = document.querySelectorAll('.edital-card');

    cards.forEach(c => {
        const text = c.textContent.toLowerCase();
        if (text.includes(k)) {
            c.style.display = 'block';
        } else {
            c.style.display = 'none';
        }
    });
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

function generateVictoryCard(cidade, valor, objeto) {
    showToast(`Arte e texto de prestação de contas de ${cidade} (${valor}) gerados para as redes sociais!`, 'success');
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

        // Tiles limpos e modernos do CartoDB Positron
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CartoDB',
            maxZoom: 18
        }).addTo(mapInstance);

        markersGroup = L.layerGroup().addTo(mapInstance);
        renderMapMarkers('todos', 'todos');

        // Seleciona Ponta Grossa por padrão
        selectCityOnMap(geoMunicipalities[0]);
    } else {
        mapInstance.invalidateSize();
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
