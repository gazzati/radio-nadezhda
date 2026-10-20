import fs from 'node:fs/promises';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outDir = '/Users/gazzati/pet/radio-nadezhda/outputs';
await fs.mkdir(outDir, { recursive: true });
const wb = Workbook.create();
const sh = wb.worksheets.add('Бюджет запуска');
sh.showGridLines = false;
sh.tabColor = '#213D67';

sh.getRange('A1:F1').merge();
sh.getRange('A1').values = [['«Территория гор» — бюджет надёжного запуска']];
sh.getRange('A2:F2').merge();
sh.getRange('A2').values = [['Разовые расходы и ежемесячная стоимость эксплуатации']];

sh.getRange('A4:D4').values = [['Разовые расходы', 'Цена, ₽', 'Статус', 'Комментарий']];
sh.getRange('A5:D12').values = [
  ['RadioBOSS Standard', 6599, 'Нужно купить', 'Для физического лица; бессрочная лицензия'],
  ['RadioBOSS Advanced', 8299, 'Вариант', 'Можно выбрать вместо Standard'],
  ['Сервер: переезд на VPS 4 CPU / 4 ГБ RAM', 0, 'Оценить', 'Стоимость учитывается в ежемесячных расходах'],
  ['Микрофон', 15000, 'Если нет', 'Средний ориентир'],
  ['Звуковая карта / аудиоинтерфейс', 12000, 'Если нет', 'Средний ориентир'],
  ['Кабели, стойка, мелкие аксессуары', 5000, 'Если нет', 'Резерв на подключение'],
  ['Первичная настройка и тестирование', 0, 'Своими силами', 'При самостоятельной настройке'],
  ['Итого разовые расходы', 38599, '', 'Без учёта необязательного Advanced'],
];

sh.getRange('A15:C15').values = [['Ежемесячные расходы', 'Цена, ₽/мес', 'Комментарий']];
sh.getRange('A16:C20').values = [
  ['VPS для AzuraCast', 1200, 'Ориентир для 4 CPU / 4 ГБ RAM; текущий сервер слабоват для надёжной работы'],
  ['Резервные копии', 300, 'Ориентир; зависит от выбранного хранилища'],
  ['Обновление RadioBOSS после первого года', 0, 'Не обязательно: купленная лицензия продолжает работать'],
  ['Музыкальные права', 0, 'Нужно определить отдельно по каталогу музыки'],
  ['Итого ежемесячно', 1500, 'Расчёт в рублях'],
];

sh.getRange('A23:C23').values = [['Ключевые итоги', 'Значение, ₽', 'Примечание']];
sh.getRange('A24:C27').values = [
  ['Старт без новой техники', 6599, 'Если микрофон и аудиокарта уже есть'],
  ['Старт с техникой', 38599, 'Текущая оценка'],
  ['Первый год эксплуатации', 56599, 'Без музыкальных прав'],
  ['Первый год без новой техники', 24599, 'Без музыкальных прав'],
];

sh.getRange('A31:F31').merge();
sh.getRange('A31').values = [['Допущения: домен, SSL, сайт и текущая серверная площадка уже есть. AzuraCast бесплатен. VPS и музыкальные права указаны ориентировочно. Цены RadioBOSS взяты с официального сайта; перед покупкой проверьте актуальную цену и статус оплаты.']];

sh.getRange('A1:F31').format.font = { name: 'Arial', size: 10, color: '#213D67' };
sh.getRange('A1:F1').format = { font: { name: 'Arial', size: 16, bold: true, color: '#FFFFFF' }, fill: '#213D67' };
sh.getRange('A2:F2').format = { font: { name: 'Arial', size: 10, italic: true, color: '#5C6E87' } };
for (const addr of ['A4:D4','A15:C15','A23:C23']) sh.getRange(addr).format = { fill: '#D9E5F0', font: { bold: true, color: '#213D67' }, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true };
for (const addr of ['A12:D12','A20:C20','A24:B27']) sh.getRange(addr).format.font = { bold: true, color: '#213D67' };
sh.getRange('B5:B12').format.numberFormat = '#,##0';
sh.getRange('B16:B20').format.numberFormat = '#,##0';
sh.getRange('B24:B27').format.numberFormat = '#,##0';
sh.getRange('A4:D12').format.borders = { insideHorizontal: { style: 'thin', color: '#D9E2EC' }, bottom: { style: 'thin', color: '#D9E2EC' } };
sh.getRange('A15:C20').format.borders = { insideHorizontal: { style: 'thin', color: '#D9E2EC' }, bottom: { style: 'thin', color: '#D9E2EC' } };
sh.getRange('A23:C27').format.borders = { insideHorizontal: { style: 'thin', color: '#D9E2EC' }, bottom: { style: 'thin', color: '#D9E2EC' } };
sh.getRange('B5:B11').format.fill = '#FFF2CC';
sh.getRange('B16:B19').format.fill = '#FFF2CC';
sh.getRange('B24').format.fill = '#FFF2CC';
sh.getRange('A31:F31').format = { font: { name: 'Arial', size: 9, italic: true, color: '#5C6E87' }, wrapText: true };
sh.getRange('A1:F31').format.verticalAlignment = 'center';
sh.getRange('A1:F31').format.autofitColumns();
sh.getRange('A1:A31').format.columnWidth = 38;
sh.getRange('B1:B31').format.columnWidth = 16;
sh.getRange('C1:C31').format.columnWidth = 24;
sh.getRange('D1:D31').format.columnWidth = 62;
sh.getRange('E1:F31').format.columnWidth = 4;
sh.getRange('A31:F31').format.rowHeight = 42;
sh.freezePanes.freezeRows(4);

wb.recalculate();
const check = await wb.inspect({ kind: 'table', range: 'Бюджет запуска!A23:D27', include: 'values,formulas', tableMaxRows: 10, tableMaxCols: 8 });
console.log(check.ndjson);
const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, summary: 'formula error scan' });
console.log(errors.ndjson);
const preview = await wb.render({ sheetName: 'Бюджет запуска', range: 'A1:F31', scale: 1, format: 'png' });
await fs.writeFile(`${outDir}/radio-budget-preview.png`, new Uint8Array(await preview.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(`${outDir}/radio-budget.xlsx`);
console.log('SAVED', `${outDir}/radio-budget.xlsx`);
