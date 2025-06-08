/**
 * Sala Calendar - Simple calendar for displaying room availability
 */
class SalaCalendar {
  constructor(containerId, agendamentos) {
    this.container = document.getElementById(containerId);
    this.agendamentos = agendamentos;
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEvents();
  }
  
  render() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    
    let calendarHTML = `
      <div class="calendar-header">
        <button id="prev-month" class="btn btn-sm btn-secondary">&lt;</button>
        <h4>${this.getMonthName(this.currentMonth)} ${this.currentYear}</h4>
        <button id="next-month" class="btn btn-sm btn-secondary">&gt;</button>
      </div>
      <table class="calendar-table">
        <thead>
          <tr>
            <th>Dom</th>
            <th>Seg</th>
            <th>Ter</th>
            <th>Qua</th>
            <th>Qui</th>
            <th>Sex</th>
            <th>Sáb</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    let dayCount = 1;
    let calendarRows = '';
    
    // Create weeks
    for (let i = 0; i < 6; i++) {
      let rowHTML = '<tr>';
      
      // Create days
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || dayCount > daysInMonth) {
          rowHTML += '<td class="empty"></td>';
        } else {
          const dateToCheck = new Date(this.currentYear, this.currentMonth, dayCount);
          const hasAgendamento = this.checkAgendamentos(dateToCheck);
          const isToday = this.isToday(dateToCheck);
          let classes = 'calendar-day';
          
          if (hasAgendamento) classes += ' has-agendamento';
          if (isToday) classes += ' today';
          
          rowHTML += `<td class="${classes}" data-date="${this.formatDate(dateToCheck)}">${dayCount}</td>`;
          dayCount++;
        }
      }
      
      rowHTML += '</tr>';
      calendarRows += rowHTML;
      
      if (dayCount > daysInMonth) break;
    }
    
    calendarHTML += calendarRows;
    calendarHTML += `
        </tbody>
      </table>
    `;
    
    this.container.innerHTML = calendarHTML;
  }
  
  attachEvents() {
    document.getElementById('prev-month').addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.render();
      this.attachEvents(); // Reattach events after re-rendering
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.render();
      this.attachEvents(); // Reattach events after re-rendering
    });
    
    const calendarDays = this.container.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
      day.addEventListener('click', () => {
        const dateStr = day.getAttribute('data-date');
        if (dateStr) {
          this.showAgendamentosForDay(dateStr);
        }
      });
    });
  }
  
  checkAgendamentos(date) {
    const dateStr = this.formatDate(date);
    return this.agendamentos.some(agendamento => {
      const agendaDate = agendamento.data_preenchimento ? agendamento.data_preenchimento.split('T')[0] : null;
      return agendaDate === dateStr;
    });
  }
  
  showAgendamentosForDay(dateStr) {
    const agendamentosForDay = this.agendamentos.filter(agendamento => {
      const agendaDate = agendamento.data_preenchimento ? agendamento.data_preenchimento.split('T')[0] : null;
      return agendaDate === dateStr;
    });
    
    const modalHTML = `
      <div class="modal" id="agendamentos-modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h3>Agendamentos para ${this.formatDatePtBr(dateStr)}</h3>
          ${this.renderAgendamentosTable(agendamentosForDay)}
        </div>
      </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Show modal
    const modal = document.getElementById('agendamentos-modal');
    modal.style.display = 'block';
    
    // Close modal when X is clicked
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modalContainer);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modalContainer);
      }
    });
  }
  
  renderAgendamentosTable(agendamentos) {
    if (agendamentos.length === 0) {
      return '<p>Não existem agendamentos para este dia.</p>';
    }
    
    let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Horário</th>
            <th>Funcionário</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    agendamentos.forEach(agendamento => {
      tableHTML += `
        <tr>
          <td>${agendamento.horario || 'Não informado'}</td>
          <td>${agendamento.funcionario_nome || 'Não informado'}</td>
          <td>${agendamento.observacao || '-'}</td>
        </tr>
      `;
    });
    
    tableHTML += `
        </tbody>
      </table>
    `;
    
    return tableHTML;
  }
  
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  formatDatePtBr(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  
  isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  getMonthName(monthIndex) {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthIndex];
  }
}