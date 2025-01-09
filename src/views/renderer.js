const mascaraData = new Inputmask({
  alias: "datetime",
  inputFormat: "dd/mm/yyyy",
  outputFormat: "yyyy-mm-dd"
});

// Busca registros no arquivo JSON e atualiza a tabela
async function obterDados() {
  const botaoFiltro = document.getElementById("filtro");
  let filtroAniversario = botaoFiltro.getAttribute("data-filtro-aniversario");
  let dados = await window.electronAPI.obterDados();

  if (filtroAniversario == "true") {
    const dataAtual = new Date().toISOString().split('T')[0];
    dados = filtrarAniversariantes(dataAtual, dados);
  }

  renderizarTabela(dados);
}
  
// Adiciona um novo registro
async function adicionar(newData) {
  const success = await window.electronAPI.adicionar(newData);
  if (success) {
    obterDados(); // Atualiza a tabela
    document.getElementById('nome').value = '';
    document.getElementById('nascimento').value = '';
  } else {
    alert('Erro ao salvar os dados.');
  }
}

// Atualiza um registro existente
async function editar(index, updatedData) {
  const data = await window.electronAPI.obterDados();
  data[index] = updatedData;
  await window.electronAPI.sobrescrever(data); // Sobrescreve os dados no arquivo
  obterDados();
}

// Exclui um registro
async function deletar(index) {
  const data = await window.electronAPI.obterDados();
  data.splice(index, 1); // Remove o item pelo índice
  await window.electronAPI.sobrescrever(data); // Sobrescreve os dados no arquivo
  obterDados();
}

// Renderiza a tabela
function renderizarTabela(data) {
  const tableBody = document.getElementById('data-table');
  tableBody.innerHTML = ''; // Limpa a tabela

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nome}</td>
      <td>${formatarData(item.nascimento)}</td>
      <td>
        <button class="btn btn-primary" onclick="manipuladorEditar(${index})">Editar</button>
        <button class="btn btn-danger" onclick="manipuladorExclusao(${index})">Excluir</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Lida com o evento de edição
async function manipuladorEditar(index) {
  const modalElement = document.getElementById('editModal');
  const nomeInput = document.getElementById('editarNome');
  const nascimentoInput = document.getElementById('editarNascimento');
  const saveButton = document.getElementById('saveButton');
  const dados = await window.electronAPI.obterDados();
  nomeInput.value = dados[index].nome;
  nascimentoInput.value = formatarData(dados[index].nascimento);
  if(!nascimentoInput.inputmask) {
    mascaraData.mask(nascimentoInput);
  }

  // Exibir o modal usando o Bootstrap
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Evento do botão "Salvar"
  saveButton.onclick = () => {
    const nome = nomeInput.value.trim();
    let nascimento = nascimentoInput.inputmask.unmaskedvalue();


    if (nome && nascimento) {
      editar(index, { nome, nascimento });
      modal.hide(); // Fechar o modal
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };
}

// Lida com o evento de exclusão
async function manipuladorExclusao(index) {
  const modalElement = document.getElementById('deleteModal');
  const mensagem = document.getElementById('deleteItem');
  const saveButton = document.getElementById('deleteButton');
  const dados = await window.electronAPI.obterDados();
  mensagem.innerHTML = `Tem certeza que deseja excluir o cadastro com nome "
    <strong>${dados[index].nome}</strong>
  "`;
  // Exibir o modal usando o Bootstrap
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Evento do botão "Salvar"
  saveButton.onclick = () => {
    deletar(index)
    modal.hide(); // Fechar o modal
  };
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`
}

function filtrarAniversariantes(dataAtual, dados) {
  const hoje = new Date(dataAtual);
  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();

  return dados.filter(pessoa => {
    const aniversario = new Date(pessoa.nascimento);
    return aniversario.getMonth() == mesAtual && aniversario.getDate() == diaAtual;
  })
}

function alterarFiltro() {
  const botaoFiltro = document.getElementById("filtro");
  let filtroAniversario = botaoFiltro.getAttribute('data-filtro-aniversario');
  if (filtroAniversario == "true") {
    botaoFiltro.innerHTML = 'Aniversariantes do dia'
    botaoFiltro.setAttribute("data-filtro-aniversario", "false");
  } else {
    botaoFiltro.innerHTML = 'Todos'
    botaoFiltro.setAttribute('data-filtro-aniversario', "true")
  }

  obterDados();
}

// Evento ao carregar a página
window.onload = () => {
  obterDados();

  // Aplicando a máscara de data (DD/MM/YYYY)
  var input = document.getElementById("nascimento");
  if(!input.inputmask) {
    mascaraData.mask(input);
  }

  document.getElementById('data-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    let nascimento = document.getElementById('nascimento');
    nascimento = nascimento.inputmask.unmaskedvalue()
    if (nome && nascimento) {
      adicionar({ nome, nascimento });
    }
  });
};
