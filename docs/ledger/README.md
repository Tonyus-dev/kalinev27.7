# K∧LINE Ledger / Mnemósine Ledger

O K∧LINE Ledger, também chamado de Mnemósine Ledger, é o registro comum de eventos aprováveis entre superfícies e facetas da K∧LINE.

Ele existe para preservar decisões, handoffs, sínteses e candidatos de memória sem criar conversa interna falsa entre facetas. A regra central é: facetas não conversam em loop; facetas deixam eventos aprováveis.

Este PR cria somente o contrato canônico do Ledger. Ele não implementa UI, storage, Supabase ativo, evento automático, seed ou integração real. Supabase vem depois como implementação planejada.

| Camada | Função | Exemplo |
| --- | --- | --- |
| /docs/identity | cânone da identidade | "Kaline é a identidade central" |
| Sedimento | candidato local revisável | "Antônio parece preferir respostas curtas hoje" |
| Jardim | memória local aprovada | "Antônio prefere modo Ponytail" |
| Ledger | evento/handoff/decisão | "Kaline → Klio: evitar abrir três frentes técnicas" |

Diferenças importantes:

- Identidade define quem Kaline é e quais limites a V27 pública respeita.
- Sedimento é candidato local revisável, não verdade final.
- Jardim é memória local aprovada.
- Ledger é evento, handoff ou decisão aprovável entre superfícies/facetas.

O Ledger não substitui `/docs/identity`, não substitui o Jardim e não autoriza a V27 pública a virar Klio/Coder.
