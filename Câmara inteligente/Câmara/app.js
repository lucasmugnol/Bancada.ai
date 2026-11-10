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
        'campo': { name: 'Luciana Santos (Liderança Regional)', role: 'Campo • Distrito Vila Esperança', initials: 'LS' }
    };

    const info = userInfoMap[targetView] || userInfoMap['cockpit'];
    document.getElementById('userNameDisplay').textContent = info.name;
    document.getElementById('userRoleDisplay').textContent = info.role;
    document.getElementById('avatarInitials').textContent = info.initials;

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
