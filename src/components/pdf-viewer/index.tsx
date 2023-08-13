import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { LoadingIndicator } from 'react-select/dist/declarations/src/components/indicators';
import PageLoader from '../loader';

type Props = {
    url: string;
    scale?: number;
    width?: number | undefined;
    customCenter?: string;
};

const PdfViewer: React.FC<Props> = ({
    url,
    scale = 1.0,
    width = 500,
    customCenter = 'd-flex justify-content-center',
}) => {
    const [numPages, setNumPages] = useState<any>(null);

    return (
        <Document
            loading={<PageLoader text={'Loading offer document...'} />}
            renderMode="svg"
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
            {Array.from(Array(numPages), (e, i) => i + 1).map((item) => (
                <Page className={customCenter} scale={scale} width={width} key={item} pageNumber={item} />
            ))}
        </Document>
    );
};

export default PdfViewer;
