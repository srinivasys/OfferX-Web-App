import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import DocumentContent from './inner-content';

type Props = RouteComponentProps<{ id: string }>;

const Document: React.FC<Props> = ({ match }) => {
    const { id } = match.params;

    return <DocumentContent id={id} />;
};

export default Document;
