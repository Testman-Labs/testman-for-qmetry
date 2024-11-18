import { readFileSync } from "fs";
import { compile } from "handlebars";
import { launch } from "puppeteer";

export async function generatePDF(templatePath:string, data: any) {
    console.log("Generando PDF");

    //validar si la data es un json
    if (typeof data !== 'object') {
        console.warn('La data no es un objeto JSON');
        const decodedData = decodeURIComponent(data);
        data = JSON.parse(decodedData);
    }
    
    // Cargar y compilar la plantilla HTML
    const templateSource = readFileSync(templatePath, 'utf-8');
    const templateCompile = compile(templateSource);
    const html = templateCompile(data)

    const browser = await launch({
        headless: true,
        defaultViewport: {
            width: 750,
            height: 500,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: false,
            isLandscape: false
        }
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
        path: data.summary + '.pdf',
        format: 'A4',
        printBackground: true,
        // margin: { left: '0.5cm', top: '2cm', right: '0.5cm', bottom: '2cm' }
    });
    await browser.close();
    console.log('PDF generado con éxito');
    return pdf;
}