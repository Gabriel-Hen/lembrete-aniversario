// Busca registros no arquivo JSON e atualiza a tabela
async function fetchData() {
    const data = await window.electronAPI.fetchData();
    renderTable(data);
  }
  
  // Adiciona um novo registro
  async function addData(newData) {
    const success = await window.electronAPI.addData(newData);
    if (success) {
      fetchData(); // Atualiza a tabela
    } else {
      alert('Erro ao salvar os dados.');
    }
  }
  
  // Atualiza um registro existente
  async function editData(index, updatedData) {
    const data = await window.electronAPI.fetchData();
    data[index] = updatedData;
    await window.electronAPI.addData(data); // Sobrescreve os dados no arquivo
    fetchData();
  }
  
  // Exclui um registro
  async function deleteData(index) {
    const data = await window.electronAPI.fetchData();
    data.splice(index, 1); // Remove o item pelo índice
    await window.electronAPI.addData(data); // Sobrescreve os dados no arquivo
    fetchData();
  }
  
  // Renderiza a tabela
  function renderTable(data) {
    const tableBody = document.getElementById('data-table');
    tableBody.innerHTML = ''; // Limpa a tabela
  
    data.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.dob}</td>
        <td>
          <button onclick="handleEdit(${index})">Editar</button>
          <button onclick="handleDelete(${index})">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Lida com o evento de edição
  function handleEdit(index) {
    const name = prompt('Digite o novo nome:');
    const dob = prompt('Digite a nova data de nascimento (YYYY-MM-DD):');
  
    if (name && dob) {
      editData(index, { name, dob });
    }
  }
  
  // Lida com o evento de exclusão
  function handleDelete(index) {
    if (confirm('Tem certeza de que deseja excluir este registro?')) {
      deleteData(index);
    }
  }
  
  // Evento ao carregar a página
  window.onload = () => {
    fetchData();
  
    document.getElementById('data-form').addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = document.getElementById('name').value;
      const dob = document.getElementById('dob').value;
  
      if (name && dob) {
        addData({ name, dob });
      }
    });
  };
  