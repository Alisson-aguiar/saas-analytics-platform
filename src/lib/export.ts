/**
 * Funções utilitárias para exportar dados em vários formatos
 */

// Função simples para converter JSON para CSV
export function jsonToCSV(data: any[]): string {
  if (!data.length) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Adiciona cabeçalhos
  csvRows.push(headers.join(','));

  // Adiciona linhas
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape valores que contêm vírgulas, aspas ou quebras de linha
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// Exportar para JSON
export function exportToJSON(data: any, filename: string) {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.replace(/\.[^/.]+$/, "")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Erro ao exportar para JSON:", error);
    return false;
  }
}

// Exportar para CSV
export function exportToCSV(data: any[], filename: string) {
  try {
    const csv = jsonToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.replace(/\.[^/.]+$/, "")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Erro ao exportar para CSV:", error);
    return false;
  }
}

// Exportar para TXT
export function exportToTXT(data: any, filename: string) {
  try {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Erro ao exportar para TXT:", error);
    return false;
  }
}

// Gerar relatório HTML para impressão/PDF
export function generateReportHTML(title: string, data: any, analysisResults?: any): string {
  const timestamp = new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          background: #f9f9f9;
        }
        .report-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .report-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        .report-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        .section {
          background: white;
          padding: 25px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .section h2 {
          color: #667eea;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 15px 0;
        }
        .stat-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #667eea;
        }
        .stat-card h3 {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
        }
        .stat-card .value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #e9ecef;
        }
        table td {
          padding: 12px;
          border-bottom: 1px solid #e9ecef;
        }
        table tr:hover {
          background: #f8f9fa;
        }
        .insight-card {
          background: #e8f4fd;
          border-left: 4px solid #2196f3;
          padding: 15px;
          margin: 10px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 0.9rem;
        }
        @media print {
          body {
            padding: 0;
            background: white;
          }
          .report-header {
            background: #667eea !important;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <h1>${title}</h1>
        <p>Relatório de Análise de Dados</p>
        <div class="report-meta">
          <span>Gerado: ${timestamp}</span>
          <span>Plataforma AnalyticsPro</span>
        </div>
      </div>
      
      ${analysisResults ? `
      <div class="section">
        <h2>Resumo da Análise</h2>
        <div class="stats-grid">
          ${analysisResults.totalRows ? `
          <div class="stat-card">
            <h3>Total de Linhas</h3>
            <div class="value">${analysisResults.totalRows.toLocaleString()}</div>
          </div>
          ` : ''}
          ${analysisResults.totalColumns ? `
          <div class="stat-card">
            <h3>Total de Colunas</h3>
            <div class="value">${analysisResults.totalColumns}</div>
          </div>
          ` : ''}
          ${analysisResults.numericColumns ? `
          <div class="stat-card">
            <h3>Colunas Numéricas</h3>
            <div class="value">${analysisResults.numericColumns}</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      ${data && typeof data === 'object' ? `
      <div class="section">
        <h2>Visualização dos Dados</h2>
        ${Array.isArray(data) && data.length > 0 ? `
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.slice(0, 10).map(row => `
                <tr>
                  ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${data.length > 10 ? `<p style="text-align: center; margin-top: 10px;">... e mais ${data.length - 10} linhas</p>` : ''}
        ` : `
          <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto;">
            ${JSON.stringify(data, null, 2)}
          </pre>
        `}
      </div>
      ` : ''}
      
      <div class="section">
        <h2>Insights e Recomendações</h2>
        <div class="insight-card">
          <strong>Qualidade dos Dados:</strong> ${analysisResults?.issues?.length === 0 ? 'Boa - Nenhum problema grave encontrado' : 'Requer atenção - Verifique problemas de qualidade dos dados'}
        </div>
        <div class="insight-card">
          <strong>Status da Análise:</strong> Concluída com sucesso em ${timestamp}
        </div>
        <div class="insight-card">
          <strong>Próximos Passos:</strong> Considere executar análises adicionais para obter insights mais profundos
        </div>
      </div>
      
      <div class="footer">
        <p>Relatório gerado pela Plataforma AnalyticsPro SaaS</p>
        <p>© ${new Date().getFullYear()} AnalyticsPro. Todos os direitos reservados.</p>
      </div>
      
      <script>
        // Adiciona botão de impressão apenas para visualização
        if (!window.location.href.startsWith('blob:')) {
          const printBtn = document.createElement('button');
          printBtn.className = 'no-print';
          printBtn.style.cssText = '
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            font-weight: 600;
            z-index: 1000;
          ';
          printBtn.innerHTML = '🖨️ Imprimir Relatório';
          printBtn.onclick = () => window.print();
          document.body.appendChild(printBtn);
        }
      </script>
    </body>
    </html>
  `;
}

// Exportar para PDF (usando impressão do navegador)
export function exportToPDF(title: string, data: any, analysisResults?: any) {
  try {
    const html = generateReportHTML(title, data, analysisResults);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();

      // Aguarda o carregamento e imprime
      printWindow.onload = () => {
        printWindow.print();
      };

      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao exportar para PDF:", error);
    return false;
  }
}

// Exportar para PNG (captura de tela simplificada)
export function exportToPNG(title: string, elementId?: string) {
  try {
    if (typeof window === 'undefined') return false;

    const element = elementId
      ? document.getElementById(elementId)
      : document.body;

    if (!element) {
      alert("Elemento não encontrado para exportar PNG");
      return false;
    }

    // Esta é uma implementação simples - em produção, use html2canvas
    alert("A exportação PNG requer a biblioteca html2canvas. Instale com: npm install html2canvas");
    return false;

    // Código com html2canvas (descomente quando instalar):
    /*
    import html2canvas from 'html2canvas';
    
    html2canvas(element).then(canvas => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = \`\${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png\`;
      link.click();
    });
    */
  } catch (error) {
    console.error("Erro ao exportar para PNG:", error);
    return false;
  }
}

// Função utilitária para download de qualquer arquivo
export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  try {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
    return false;
  }
}