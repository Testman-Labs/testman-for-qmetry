import { describe, expect, test } from "@jest/globals";
import { generatePDF } from "../../src/utils/pdf";

describe("report_cycle", () => {

    test("should generate report", async () => {
        const report_data = {
            headerColor: "#000000",
            headerLogo: `https://e7.pngegg.com/pngimages/243/790/png-clipart-your-company-logo-doing-business-as-company-logo-name-creative-company-logo-free-logo-design-template-text.png`,
            summary: "SDR-1819_CREDITO FLEXIBLE_20240815",
            customField: [
                {
                    name: "Quarter",
                    value: "Q3"
                },
                {
                    name: "Sprint",
                    value: "Sprint 1"
                },
                {
                    name: "Squad",
                    value: "Sqeeee"
                }
            ],
            fechaInicio: "13/11/2024",
            fechaFin: "13/11/2024",
            ejecutado: "Joe Doe",
            componentes: "Componente 1, Componente 2",
            historia: [
                {
                    key: "SDR-1819",
                    summary: "CREDITO FLEXIBLE",
                }
            ],
            pruebas: [{
                tctcmID: "12891291",
                tceID: "97838273",
                key: "TCT-123",
                summary: "Test de Lorem Ipsum 1",
                status: "Exitoso",
                ambiente: "No definido",
                attach: { 
                    url: "https://www.psdstamps.com/wp-content/uploads/2022/04/test-stamp-png.png", 
                    name: "adjunto1.png" 
                }
            }],
            ambiente: "Certificacion",
            estado: "Exitoso"
        };
        const pdf = await generatePDF("tests/report_cycle/testcycle.html", report_data);
        expect(pdf).toBeDefined();
    });
});