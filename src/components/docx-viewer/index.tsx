import React, { useEffect, useState } from 'react';
import { convertDocxToHtml } from '../../lib/utils/convert-docx';
import PageLoader from '../loader';

type Props = {
    url: string;
    docxSelector?: string;
};

const DocxViewer: React.FC<Props> = ({ url, docxSelector = 'docx' }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function () {
            const html = (await convertDocxToHtml(url)) as string;
            const docElement = document.createElement('div');
            docElement.innerHTML = html;
            const container = document.getElementById(docxSelector) as HTMLDivElement;
            container.appendChild(docElement);
            setLoading(false);
        })();
    }, [url]);

    return (
        <div className="docx-reset">
            <div id={docxSelector} className="docx-container">
                {loading && <PageLoader text="Preparing docx" />}
            </div>
        </div>
    );
};

export default DocxViewer;
