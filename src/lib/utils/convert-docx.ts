import mammoth from 'mammoth';

export async function convertDocxToHtml(url: string) {
    return new Promise((resolve) => {
        const jsonFile = new XMLHttpRequest();
        jsonFile.open('GET', url, true);
        jsonFile.send();
        jsonFile.responseType = 'arraybuffer';
        jsonFile.onreadystatechange = () => {
            if (jsonFile.readyState === 4 && jsonFile.status === 200) {
                (async function () {
                    try {
                        const { value } = await mammoth.convertToHtml(
                            { arrayBuffer: jsonFile.response },
                            { includeDefaultStyleMap: true }
                        );
                        resolve(value);
                    } catch (err) {
                        resolve('');
                    }
                })();
            }
        };
    });
}

//import html2canvas from "html2canvas";
//import {jsPDF} from "jspdf";

/*
                    html2canvas(aaa).then(function(canvas) {
                        aaa.innerHTML = ""
                        aaa.appendChild(canvas);

                        const doc = new jsPDF('p', 'mm');

                        const imgData = canvas.toDataURL('image/png');
                        const pageWidth= doc.internal.pageSize.getWidth() - 10;
                        const pageHeight= doc.internal.pageSize.getHeight();

                        const imgHeight = canvas.height * pageWidth / canvas.width;
                        const pageCount = Math.ceil(imgHeight / pageHeight);

                        doc.addImage(imgData, 'PNG', 5, 0, pageWidth, 0);

                        if (pageCount > 0) {
                            let j = 1;
                            while (j !== pageCount) {
                                doc.addPage();
                                doc.addImage(imgData, 'PNG', 5, - (j * pageHeight), pageWidth, 0);
                                j++;
                            }
                        }
                        // how to add paddings https://github.com/parallax/jsPDF/issues/1893
                        doc.save( 'file.pdf');// todo var blob = doc.output('blob'); https://stackoverflow.com/questions/51786132/how-to-save-pdf-file-from-jspdf-on-a-server-in-javascript/51787493
                    });*/
