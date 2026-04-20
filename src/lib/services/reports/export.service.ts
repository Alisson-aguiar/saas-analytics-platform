import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface ExportOptions {
    filename: string;
    scale?: number;
    backgroundColor?: string;
}

export class ExportService {
    async exportToPDF(elementId: string, options: ExportOptions): Promise<boolean> {
        try {
            console.log("📄 Iniciando exportação para PDF...");

            const element = document.getElementById(elementId);
            if (!element) {
                console.error("❌ Elemento não encontrado:", elementId);
                return false;
            }

            const canvas = await html2canvas(element, {
                scale: options.scale || 2,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${options.filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);

            console.log("✅ PDF exportado com sucesso!");
            return true;
        } catch (error) {
            console.error("❌ Erro ao exportar PDF:", error);
            return false;
        }
    }

    async exportToPNG(elementId: string, options: ExportOptions): Promise<boolean> {
        try {
            console.log("🖼️ Iniciando exportação para PNG...");

            const element = document.getElementById(elementId);
            if (!element) {
                console.error("❌ Elemento não encontrado:", elementId);
                return false;
            }

            const canvas = await html2canvas(element, {
                scale: options.scale || 2,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                useCORS: true
            });

            const link = document.createElement('a');
            link.download = `${options.filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            console.log("✅ PNG exportado com sucesso!");
            return true;
        } catch (error) {
            console.error("❌ Erro ao exportar PNG:", error);
            return false;
        }
    }

    async printReport(elementId: string): Promise<boolean> {
        try {
            console.log("🖨️ Iniciando impressão...");

            const element = document.getElementById(elementId);
            if (!element) {
                console.error("❌ Elemento não encontrado:", elementId);
                return false;
            }

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert("Por favor, permita pop-ups para imprimir o relatório.");
                return false;
            }

            const styles = `
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          @media print { body { padding: 0; } }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
        </style>
      `;

            const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório</title>
          ${styles}
        </head>
        <body>
          ${element.outerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 250);
            };
          <\/script>
        </body>
        </html>
      `;

            printWindow.document.write(printContent);
            printWindow.document.close();

            return true;
        } catch (error) {
            console.error("❌ Erro ao imprimir:", error);
            return false;
        }
    }
}

export const exportService = new ExportService();