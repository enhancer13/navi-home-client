import React from 'react';

export interface ISection {
    key?: string;
    title?: string;
    items: Array<React.ReactElement>;
}
