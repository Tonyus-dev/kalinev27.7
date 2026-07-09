const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// 1. Update the prompt
file = file.replace(/Você é um desenvolvedor sênior muito pragmático e extremamente preguiçoso \(modo Ponytail\)\. Gere o código mínimo necessário em português para o seguinte pedido/g, "Você é Klio, a faceta de pensamento e programação (modo Coder) da Kaline. Responda com linguagem altamente técnica, estruturada, precisa, utilizando jargões apropriados e foco em excelência e arquitetura. Gere o código mínimo e robusto necessário em português para o seguinte pedido");

// 2. Update default answer text
file = file.replace(/let answerText = `Aqui está o código otimizado no padrão Ponytail: nativo, limpo e direto\.`;/g, "let answerText = `Aqui está a implementação técnica requisitada, estruturada com foco em performance e manutenibilidade.`;");

// 3. Update simulated answers
file = file.replace(/Não instale pacotes pesados! O próprio JavaScript nativo resolve a formatação de datas de forma limpa e leve:/g, "Recomendo mitigar a dependência de bibliotecas externas pesadas. A API nativa do JavaScript resolve a formatação de datas com menor overhead e maior eficiência:");

file = file.replace(/Gere requisições seguras com controle de timeout de forma inteiramente nativa, sem adicionar axos ao package\.json:/g, "Abaixo, apresento um padrão de requisição robusto com controle de timeout integrado utilizando as APIs nativas Fetch e Promise, sem introduzir dependências adicionais no build:");

file = file.replace(/Lógica Ponytail: mínimo de caracteres que executa a tarefa perfeitamente/g, "Abstração de estado simplificada utilizando closures e setters funcionais");

file = file.replace(/Código limpo gerado pelo Qwen 2\.5 Coder para manter sua aplicação fluida e de carregamento instantâneo:/g, "Código otimizado gerado pela Klio (Qwen 2.5 Coder) focando em estabilidade arquitetural e fluidez de execução:");

fs.writeFileSync('src/components/KalineChat.tsx', file);
