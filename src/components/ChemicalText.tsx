import React from 'react';
import { formatChemHtml } from '../utils/formatChem';

interface ChemicalTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export const ChemicalText: React.FC<ChemicalTextProps> = ({
  text,
  className = '',
  as: Component = 'span'
}) => {
  if (!text) return null;

  const html = formatChemHtml(text);

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
