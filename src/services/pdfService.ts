import html2pdf from 'html2pdf.js';

interface ExportPDFOptions {
    elementId: string;
    filename: string;
    onBeforeExport?: () => void;
}

export const pdfService = {
    exportToPDF: async ({ elementId, filename, onBeforeExport }: ExportPDFOptions) => {
        await document.fonts.ready;
        const element = document.getElementById(elementId);
        if (!element) return;

        if (onBeforeExport) {
            onBeforeExport();
        }

        // Give render clear time
        setTimeout(() => {
            const opt = {
                margin: 0,
                filename: filename,
                image: { type: 'jpeg' as const, quality: 1 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'px', format: [794, 1123] as [number, number], orientation: 'portrait' as const }
            };

            html2pdf().set(opt).from(element).save();
        }, 100);
    }
};
