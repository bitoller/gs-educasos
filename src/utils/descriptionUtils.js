/**
 * Separa o texto da descrição em partes baseado nas quebras de linha e palavras-chave
 * @param {string} description - Texto completo da descrição
 * @returns {Object} Objeto com as partes separadas do texto
 */
export const parseDisasterDescription = (description) => {
  if (!description) {
    return {
      mainDescription: '',
      beforeText: '',
      duringText: '',
      afterText: ''
    };
  }

  let mainDescription = '';
  let beforeText = '';
  let duringText = '';
  let afterText = '';
  
  // Divide o texto em seções baseado nos marcadores
  const sections = description.split(/(?=Antes:|Durante:|Depois:|Após:)/);
  
  sections.forEach(section => {
    const trimmedSection = section.trim();
    
    if (!trimmedSection) return;
    
    if (trimmedSection.startsWith('Antes:')) {
      beforeText = trimmedSection.replace('Antes:', '').trim();
    } else if (trimmedSection.startsWith('Durante:')) {
      duringText = trimmedSection.replace('Durante:', '').trim();
    } else if (trimmedSection.startsWith('Depois:') || trimmedSection.startsWith('Após:')) {
      afterText = trimmedSection.replace(/Depois:|Após:/, '').trim();
    } else {
      mainDescription = trimmedSection;
    }
  });

  // Converte listas com hífens em texto com bullets
  const formatListText = (text) => {
    if (!text) return '';
    const lines = text.split('\n').map(line => line.trim());
    return lines.map(line => {
      if (line.startsWith('-')) {
        return '• ' + line.substring(1).trim();
      }
      return line;
    }).join('\n');
  };

  return {
    mainDescription,
    beforeText: formatListText(beforeText),
    duringText: formatListText(duringText),
    afterText: formatListText(afterText)
  };
}; 