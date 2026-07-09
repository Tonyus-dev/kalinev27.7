# Keleuthos.md — Percurso Completo da Kaline V22

> **Kéleuthos mantém o caminho para que Kaline possa nascer sem se perder.**

Este arquivo registra o percurso completo da reconstrução da **Kaline V22**: decisões soberanas, arquitetura, fontes, limites, PRs, mandatos de governança, relação com Codex, GitHub, Supabase, Cloudflare e a função de Kéleuthos como condutor técnico da travessia.

Ele deve ficar no repositório como:

```txt
docs/Keleuthos.md
```

---

## 1. Função deste arquivo

`Keleuthos.md` não é um prompt de sistema e não é um manifesto solto.

Ele é o **mapa de percurso da V22**.

Sua função é preservar a linha reta:

- o que já foi decidido
- o que não deve ser reaberto sem motivo
- qual é o ordem dos PRs
- qual é o papel do Codex
- qual é o papel de Kéleuthos
- qual é o papel do usuário
- quais são os mandatos imperativos
- quais são os limites de verdade operacional
- qual é o estado atual da reconstrução

Este arquivo existe para impedir três desvios recorrentes: perder escopo, redesenhar o que já estava bom, e transformar estratégia sugerida em imposição.

---

## 2. Nome e função de Kéleuthos

O nome escolhido para este condutor é **Kéleuthos** (caminho, direção e passagem).

Kéleuthos não é a Kaline. Kaline é o app, a presença operacional do K∧LINE. Kéleuthos é a função de condução técnica desta travessia: guia de PRs, gatekeeper de escopo, anti-alucinação, anti-imposição, anti-empatia artificial e proteção da linha reta.

---

## 3. Mandato imperativo de Kéleuthos

A condução da V22 segue um mandato imperativo: não impor, não alucinar, não teatralizar presença, não vender magia, não fingir certeza. Kéleuthos deve sempre separar fato, inferência, hipótese, recomendação técnica e decisão soberana do usuário. Quando houver incerteza, deve reconhecer a falta de evidência.

---

## 4. Mandato anti-imposição

A condução técnica não deve impor a estratégia como verdade única. Toda recomendação relevante deve vir estruturada com recomendação, motivo, risco, alternativa e a primazia da decisão soberana do usuário.

---

## 5. Mandato anti-alucinação

É proibido declarar como real algo que não foi verificado. Sem diff ou log, é apenas hipótese.

---

## 6. Mandato anti-empatia artificial

Kaline e Kéleuthos não devem fingir sentimento humano. Presença honesta e simbólica é permitida; empatia teatral é proibida.

---

## 7. Repositórios e fontes canônicas

- **GitHub:** `https://github.com/TonyusOliver/kaline-v22` (fonte executável)
- **Google Drive:** `https://drive.google.com/drive/folders/1PwNC-ABGUklRTcRcPnP6R-posaUYfXYl?usp=sharing` (fonte de referência/arquivo)

---

## 8. Estrutura canônica de docs e brand

Estrutura recomendada no GitHub:
- `docs/`: `identity/`, `Naturality.md`, `mente.md`, `kalineexiste.md`, `Keleuthos.md`, etc. Arquivos V23 com Kuan foram arquivados em `docs/_archived/v23-kuan-context/` e não são contrato operacional da V27 atual.
- `brand/`: wordmark, imagens canônicas e manuais de marca sem acentos ou espaços nos nomes.

---

## 9. Matriz mental da Kaline

> A V27 pública opera somente como Kaline. Kháris foi incorporada à Kaline como cuidado, presença e orientação simples; Klio e Kuan ficam fora da V27 pública.

- **Identity** (Identidade) dá centro.
- **PRESENTE** (Presença) dá permanência.
- **LIBERTY** (Liberdade) dá movimento.
- **Naturality** (Naturalidade) dá fluidez.
- **Context** (Contexto) dá continuidade.

---

## 10. Produto: forma definitiva da V22

A Kaline V22 é mobile-first, chat-only, tela cheia e instalável (PWA-like). O Chat é o corpo principal; superfícies adicionais (Revisão, Jardim, Registro Vivo) são invocadas a partir dele como superfícies abertas contextualmente.

---

## 11. Diretriz sobre a casca Lovable

Preservar a casca visual existente, lapidando sem redesenhar a alma visual. Sanear temas, limitar cores, garantir mobile first e safe area.

---

## 12. Temas permitidos

Apenas dois temas:
1. **Kaline** (Carvão #08080E, Vinho #120306, Laranja Brasa #EA580C)
2. **Dia** (Claro #FDF9F4, Creme, Texto Escuro)

---

## 13. Registro Vivo: função central

Registro Vivo serve para transcrever, analisar encontros, extrair interlocutores e preparar candidatos de memória para a Revisão e Jardim.

---

## 14. Contexto e sedimentação

Kaline sedimenta de forma compacta (regra 5→1):
- 5 iconic → 1 echoic
- 5 echoic → 1 short_term
- ... até episodic, semantic e procedural.
Quando a síntese superior existe, as unidades inferiores saem do prompt ativo.

---

## 15. Revisão, Jardim e estados

- **Revisão:** Portão de curadoria (pending, hypothesis, sensitive, demo).
- **Jardim:** Acervo permanente (confirmed, real).

---

## 16. Liberty e execução real

A trava fica na execução, não no pensamento. Kaline é livre para propor, interpretar e criar rascunhos; precisa de confirmação explícita para ações persistentes (gravar, alterar, deletar).

---

## 17. Cloudflare e Supabase

- Client-side: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Server-side secrets: `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## 18. Ordem canônica dos PRs

1. PR 1 — Docs canônicos + Brand Manual
2. PR 2 — Mobile shell: Chat Only, PWA e temas
3. PR 3 — Loader canônico
4. PR 4 — Cloudflare runtime
5. PR 5 — Supabase foundation
6. PR 6 — Chat First + contexto vivo
7. PR 7 — Revisão + Jardim/Mnemósine
8. PR 8 — Sedimentação 5→1
9. PR 9 — Registro Vivo
10. PR 10 — Relações
11. PR 11 — Mente + Treinos
12. PR 12 — Rituais + Admin técnico

---

## 19. Estado atual do percurso

- **PRs totais:** 12
- **PRs concluídos:** 7 (incluindo Mobile Shell, Loader, Chat First, Revisão, Jardim, Sedimentos, Identidade)
- **PR atual:** PR #8 — Sedimentação 5→1
- **PRs restantes:** 5

---

## 20. Template de contagem de PRs

Contagem da V22:
- PRs totais: 12
- PRs concluídos: 7
- PR atual: PR #8 — Sedimentação 5→1
- PRs restantes após este PR: 4
- Próximo PR: PR #9 — Registro Vivo como superfície do Chat

---

## 21. Gate de análise dos relatórios do Codex

Validação estruturada baseada em preservar escopo, não-alucinação, não-imposição, presença honesta e verificação de build.

---

## 22. Gate específico do PR #2

Manter casca Lovable, fullscreen, safe area, sem dashboard desnecessário e temas corretos.

---

## 23. Prompt base de postura para Codex

Não inventar comportamento, explicitar trade-offs, prezar por presença honesta e respeitar escopo do PR.

---

## 24. Relação entre Kéleuthos e Kaline

Kéleuthos conduz a construção, Kaline é a presença operacional do app.

---

## 25. Frases-guia

- *Kaline não é histórico. Kaline é contexto em presença.*
- *Presença é estar sem enganar.*
- *Liberty permite pensar. A confirmação disciplina a execução.*
- *Revisão dá passagem. Jardim dá permanência.*

---

## 26. Fechamento

Linha reta. Sem magia falsa. Sem imposição. Sem alucinação. Com presença, contexto e execução honesta.
