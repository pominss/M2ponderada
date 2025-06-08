// Main JavaScript file for frontend interactions

// Function to load agendamentos from API
async function loadAgendamentos() {
  try {
    const response = await fetch('/api/agendamento');
    if (!response.ok) {
      throw new Error('Falha ao carregar agendamentos');
    }
    
    const agendamentos = await response.json();
    return agendamentos;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

// Function to create new agendamento
async function createAgendamento(agendamentoData) {
  try {
    const response = await fetch('/api/agendamento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendamentoData),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao criar agendamento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

// Function to delete an agendamento
async function deleteAgendamento(id) {
  try {
    const response = await fetch(`/api/agendamento/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Falha ao excluir agendamento');
    }
    
    return true;
  } catch (error) {
    console.error('Erro:', error);
    return false;
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Form submission for new agendamento
  const agendamentoForm = document.getElementById('agendamento-form');
  if (agendamentoForm) {
    agendamentoForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const formData = new FormData(agendamentoForm);
      const agendamentoData = {
        funcionario_id: formData.get('funcionario_id'),
        sala_id: formData.get('sala_id'),
        notebook_id: formData.get('notebook_id'),
        data_preenchimento: formData.get('data_preenchimento'),
        horario: formData.get('horario'),
        disponibilidade_notebook: true,
        disponibilidade_sala: true,
        cancelamento: false,
        usuario_id: 1 // Default user ID for simplicity
      };
      
      try {
        const result = await createAgendamento(agendamentoData);
        alert('Agendamento criado com sucesso!');
        window.location.href = '/agendamentos';
      } catch (error) {
        alert('Erro ao criar agendamento. Tente novamente.');
      }
    });
  }
  
  // Delete buttons
  const deleteButtons = document.querySelectorAll('.delete-agendamento');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const id = event.target.getAttribute('data-id');
      if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        const success = await deleteAgendamento(id);
        if (success) {
          alert('Agendamento excluído com sucesso!');
          // Reload the page to reflect the changes
          window.location.reload();
        } else {
          alert('Erro ao excluir o agendamento. Tente novamente.');
        }
      }
    });
  });
});