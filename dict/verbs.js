// Получаем все ячейки таблицы
const tableCells = document.querySelectorAll('.table-data');

// Добавляем обработчик нажатия для каждой ячейки
tableCells.forEach(cell => {
  cell.addEventListener('click', () => {
    // Копируем текст ячейки в буфер обмена
    const textToCopy = cell.textContent;
    navigator.clipboard.writeText(textToCopy);
    
    // Создаем элемент для всплывающего уведомления
    const notification = document.createElement('div');
    notification.classList.add('copy-notification');
    notification.textContent = "Текст скопирован в буфер обмена!";

    // Добавляем уведомление в DOM и удаляем его через несколько секунд
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 1000);
  });

  // Добавляем обработчики событий для подсветки при наведении мыши
  cell.addEventListener('mouseover', () => {
    cell.classList.add('hover-highlight');
  });

  cell.addEventListener('mouseout', () => {
    cell.classList.remove('hover-highlight');
  });
});
