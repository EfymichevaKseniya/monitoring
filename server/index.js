const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAndSaveToFile(url, outputFileName) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url);

  let result = [];
  const startDay = new Date().setHours(8, 0, 0, 0); // Начало периода для парсинга
  const endDay = new Date().setHours(18, 0, 0, 0); // Конец периода для парсинга
  let updateTime = Date.parse(new Date()); // Актуальные дата и время

  while (startDay <= updateTime && updateTime <= endDay) {
    page.reload();
    const data = await page.evaluate(() => {
      const element = document.querySelector('.version');
      return element ? element.innerText.split('Подключений:')[1].trim().split('/')[0] : null;
    });

    let existingData = [];

    try {
      const fileContent = fs.readFileSync(outputFileName, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (err) {}

    // Append the new data to the array
    const foundedData = data && { time: new Date().toISOString(), data };
    existingData.push(foundedData);

    if (existingData.length !== 0) {
      result = existingData
    } else {
      result.push(foundedData)
    }

    fs.writeFileSync(outputFileName, JSON.stringify(result, null, 2), 'utf8');

    await new Promise(r => setTimeout(r, 8 * 60 * 1000)); // 8 минут ожидания до следующего парсинга
    updateTime += 8 * 60 * 1000;
  }

  await browser.close();
  return result;
}

scrapeAndSaveToFile('http://10.100.100.120:15201/html1.html', 'output.json')
  .then(data => console.log(data));

const express = require('express')
const app = express()
const PORT = 5000;

app.get('/connections', (req, res) => {
  fs.readFile('output.json', (err, data) => {
    if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
    }

    // Отправляем содержимое файла через HTTP GET запрос
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
      res.end(data);
  });
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});