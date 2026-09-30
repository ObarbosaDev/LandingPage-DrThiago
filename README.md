# Pinheiro Barbosa Advocacia

Site institucional do advogado Thiago Pinheiro Barbosa (OAB/DF 87938), com atuação em Brasília e atendimento digital.

**Site oficial:** [www.pinheirobarbosaadvocacia.com.br](https://www.pinheirobarbosaadvocacia.com.br/)

## Recursos

- Layout responsivo para computadores, tablets e celulares.
- Apresentação profissional e áreas de atuação.
- Canais de atendimento e formulário com validação, que prepara uma mensagem para envio pelo WhatsApp.
- Página de política de privacidade e página de erro 404.
- Favicon com proporção preservada nas três páginas.

## Estrutura

```text
.
├── index.html
├── 404.html
├── politica-de-privacidade.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   └── images/                 # Fotografias, logotipo e favicon
├── package.json
├── vercel.json
└── README.md
```

## Stack

- HTML
- CSS
- JavaScript
- Bootstrap via CDN
- Font Awesome via CDN
- Fonte Manrope via Google Fonts

## Desenvolvimento local

Abra o arquivo `index.html` no navegador ou use um servidor estático local apontando para a raiz do projeto. É necessário acesso à internet para carregar as bibliotecas e fontes externas.

O projeto não exige instalação de dependências nem etapa de build. O `package.json` contém apenas os metadados do projeto, sem scripts de execução ou testes.

## Manutenção

- Conteúdo e links da página principal: `index.html`.
- Layout, cores e ajustes responsivos: `assets/css/styles.css`.
- Formulário, validação e integração com o WhatsApp: `assets/js/script.js`.
- Fotografias, logotipo e ícones: `assets/images/`.
- Textos de privacidade: `politica-de-privacidade.html`.

Ao alterar os contatos, revise também os links no HTML e a configuração `CONFIG.whatsapp` no JavaScript.

## Deploy

Projeto estático. Na Vercel, use:

- Framework Preset: `Other`
- Root Directory: `./`
- Build Command: vazio
- Output Directory: `.` (definido em `vercel.json`)

O arquivo `vercel.json` também habilita URLs sem a extensão `.html` e remove a barra final dos caminhos.

## Contato Configurado

- WhatsApp: [+55 61 98150-3261](https://wa.me/5561981503261)
- Instagram: [@adv.pinheirobarbosa](https://www.instagram.com/adv.pinheirobarbosa/)
- E-mail: [drpinheirobarbosa.adv@gmail.com](mailto:drpinheirobarbosa.adv@gmail.com)
