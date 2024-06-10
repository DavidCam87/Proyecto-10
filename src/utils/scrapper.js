const puppeteer = require("puppeteer");
const fs = require("fs");

const listJuegos = [];

const scrapper = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  repeatProcess(page);
};

const repeatProcess = async (page, browser) => {

  const arrayDivjuego = await page.$$(".card--standard");
  for (const portatilDiv of arrayDivjuego) {
    let caratula = await portatilDiv.$eval("img", (el) => el.src);
    let titulo = await portatilDiv.$eval(".full-unstyled-link", (el) => el.textContent.trim());
    let precio;
    //console.log(title);
    //console.log(img);
    try {
      precio = await portatilDiv.$eval(".price__regular", (el) => {
        const precioSpan = el.querySelector(".price-item.price-item--regular");
        if (precioSpan) {
          const precioTexto = precioSpan.innerText.trim();
          const precio = precioTexto.replace("€", "").replace("EUR", "").trim();
          const precioNumerico = parseFloat(precio.replace(',', '.'));
          if (!isNaN(precioNumerico)) {
            return precioNumerico;
          }
        }
        return "Error en precio";
      });
      const juego = {
        caratula: caratula,
        titulo: titulo,
        precio: precio
      };
      listJuegos.push(juego);
    } catch (error) {
      console.log(error.message);
    };
  };

  try {
    await page.$eval("[aria-label='Página siguiente']", (el) => el.click());
    await page.waitForNavigation();
    repeatProcess(page, browser);
  } catch (error) {
    write(listJuegos);
    await browser.close();
  };
};

const write = (listjuegos) => {
  fs.writeFileSync("products.json", JSON.stringify(listjuegos), () => {
    console.log("Escritura completada");
  });
}

module.exports = { scrapper };