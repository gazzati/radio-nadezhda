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

sh.getRange('A4:F4').values = [['Разовые расходы', 'Количество', 'Цена, ₽', 'Сумма, ₽', 'Статус', 'Комментарий']];
sh.getRange('A5:F12').values = [
  ['RadioBOSS Standard', 1, 6599, null, 'Нужно купить', 'Для физического лица; бессрочная лицензия'],
  ['RadioBOSS Advanced', 0, 8299, null, 'Вариант', 'Можно выбрать вместо Standard'],
  ['Сервер: переезд на VPS 4 CPU / 4 ГБ RAM', 1, 0, null, 'Оценить', 'Стоимость учитывается в ежемесячных расходах'],
  ['Микрофон', 1, 15000, null, 'Если нет', 'Средний ориентир'],
  ['Звуковая карта / аудиоинтерфейс', 1, 12000, null, 'Если нет', 'Средний ориентир'],
  ['Кабели, стойка, мелкие аксессуары', 1, 5000, null, 'Если нет', 'Резерв на подключение'],
  ['Первичная настройка и тестирование', 1, 0, null, 'Своими силами', 'При самостоятельной настройке'],
  ['Итого разовые расходы', null, null, null, null, 'Без учёта необязательного Advanced'],
];
sh.getRange('D5:D11').formulas = [['=B5*C5'],['=B6*C6'],['=B7*C7'],['=B8*C8'],['=B9*C9'],['=B10*C10'],['=B11*C11']];
sh.getRange('D12').formulas = [['=SUM(D5:D11)']];

sh.getRange('A15:E15').values = [['Ежемесячные расходы', 'Количество', 'Цена, ₽/мес', 'Сумма, ₽/мес', 'Комментарий']];
sh.getRange('A16:F20').values = [
  ['VPS для AzuraCast', 1, 1200, null, 'Ориентир для 4 CPU / 4 ГБ RAM; текущий сервер слабоват для надёжной работы'],
  ['Резервные копии', 1, 300, null, 'Ориентир; зависит от выбранного хранилища'],
  ['Обновление RadioBOSS после первого года', 0, 0, null, 'Не обязательно: купленная лицензия продолжает работать'],
  ['Музыкальные права', 1, 0, null, 'Нужно определить отдельно по каталогу музыки'],
  ['Итого ежемесячно', null, null, null, 'Расчёт в рублях'],
];
sh.getRange('D16:D19').formulas = [['=B16*C16'],['=B17*C17'],['=B18*C18'],['=B19*C19']];
sh.getRange('D20').formulas = [['=SUM(D16:D19)']];

sh.getRange('A23:E23').values = [['Ключевые итоги', 'Значение', 'Единица', 'Расчёт', 'Примечание']];
sh.getRange('A24:E27').values = [
  ['Старт без новой техники', null, '₽', 'RadioBOSS + без техники', 'Если микрофон и аудиокарта уже есть'],
  ['Старт с техникой', null, '₽', 'RadioBOSS + микрофон + интерфейс + кабели', 'Текущая оценка'],
  ['Первый год эксплуатации', null, '₽', 'Старт с техникой + 12 × ежемесячные', 'Без музыкальных прав'],
  ['Первый год без новой техники', null, '₽', 'Старт без техники + 12 × ежемесячные', 'Без музыкальных прав'],
];
sh.getRange('B24').formulas = [['=D5']];
sh.getRange('B25').formulas = [['=D12']];
sh.getRange('B26').formulas = [['=B25+12*D20']];
sh.getRange('B27').formulas = [['=B24+12*D20']];

sh.getRange('A31:F31').merge();
sh.getRange('A31').values = [['Допущения: домен, SSL, сайт и текущая серверная площадка уже есть. AzuraCast бесплатен. VPS и музыкальные права указаны ориентировочно. Цены RadioBOSS взяты с официального сайта; перед покупкой проверьте актуальную цену и статус оплаты.']];

sh.getRange('A1:F31').format.font = { name: 'Arial', size: 10, color: '#213D67' };
sh.getRange('A1:F1').format = { font: { name: 'Arial', size: 16, bold: true, color: '#FFFFFF' }, fill: '#213D67' };
sh.getRange('A2:F2').format = { font: { name: 'Arial', size: 10, italic: true, color: '#5C6E87' } };
for (const addr of ['A4:F4','A15:F15','A23:E23']) sh.getRange(addr).format = { fill: '#D9E5F0', font: { bold: true, color: '#213D67' }, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true };
for (const addr of ['D12:F12','D20:F20','A25:B28']) sh.getRange(addr).format.font = { bold: true, color: '#213D67' };
sh.getRange('C5:D12').format.numberFormat = '#,##0';
sh.getRange('C16:D20').format.numberFormat = '#,##0';
sh.getRange('B24:B27').format.numberFormat = '#,##0';
sh.getRange('A4:F12').format.borders = { insideHorizontal: { style: 'thin', color: '#D9E2EC' }, bottom: { style: 'thin', color: '#D9E2EC' } };
sh.getRange('A15:F20').format.borders = { insideHorizontal: { style: 'thin', color: '#D9E2EC' }, bottom: { style: 'thin', color: '#D9E2EC' } };
sh.getRange('A23:E28').format.borders = { insideHorizontal: { style: 'thin', color: '#D9E2EC' }, bottom: { style: 'thin', color: '#D9E2EC' } };
sh.getRange('B5:C11').format.fill = '#FFF2CC';
sh.getRange('B16:C19').format.fill = '#FFF2CC';
sh.getRange('B24').format.fill = '#FFF2CC';
sh.getRange('A31:F31').format = { font: { name: 'Arial', size: 9, italic: true, color: '#5C6E87' }, wrapText: true };
sh.getRange('A1:F31').format.verticalAlignment = 'center';
sh.getRange('A1:F31').format.autofitColumns();
sh.getRange('A1:A31').format.columnWidth = 34;
sh.getRange('B1:B31').format.columnWidth = 14;
sh.getRange('C1:C31').format.columnWidth = 14;
sh.getRange('D1:D31').format.columnWidth = 16;
sh.getRange('E1:E31').format.columnWidth = 18;
sh.getRange('F1:F31').format.columnWidth = 58;
sh.getRange('A31:F31').format.rowHeight = 42;
sh.freezePanes.freezeRows(4);

wb.recalculate();
const check = await wb.inspect({ kind: 'table', range: 'Бюджет запуска!A23:F28', include: 'values,formulas', tableMaxRows: 10, tableMaxCols: 8 });
console.log(check.ndjson);
const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, summary: 'formula error scan' });
console.log(errors.ndjson);
const preview = await wb.render({ sheetName: 'Бюджет запуска', range: 'A1:F31', scale: 1, format: 'png' });
await fs.writeFile(`${outDir}/radio-budget-preview.png`, new Uint8Array(await preview.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(`${outDir}/radio-budget.xlsx`);
console.log('SAVED', `${outDir}/radio-budget.xlsx`);
