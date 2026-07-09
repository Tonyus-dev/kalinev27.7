# Contrato Canônico do K∧LINE Ledger

O K∧LINE Ledger / Mnemósine Ledger define um contrato comum para eventos aprováveis entre superfícies e facetas da K∧LINE.

Conceitos do contrato:

- `LedgerEvent`
- `LedgerFacet`
- `LedgerVisibility`
- `LedgerStatus`
- `LedgerEventType`
- `LedgerSource`

## LedgerFacet

Facetas possíveis no Ledger:

- `kaline`
- `kharis`
- `kuan`
- `klio`

Klio pode existir como facet no Ledger porque é faceta privada da K∧LINE. Isso NÃO reintroduz Klio na V27 pública.

## LedgerVisibility

- `private` — só para faceta/app de origem.
- `facet_only` — compartilhado apenas com a faceta indicada.
- `shared` — compartilhável dentro da K∧LINE se aprovado.

## LedgerStatus

- `draft` — rascunho.
- `candidate` — candidato a registro.
- `approved` — aprovado para uso.
- `discarded` — descartado.
- `archived` — arquivado.

## LedgerEventType

- `decision`
- `handoff`
- `summary`
- `memory_candidate`
- `commercial_context`
- `care_context`
- `technical_context`
- `local_sync`
- `online_sync`

## LedgerSource

- `chat`
- `manual`
- `system`
- `import`

## Regra de uso

- `draft` e `candidate` não são verdade final.
- `approved` pode ser usado como contexto.
- `discarded` não deve ser usado.
- `archived` só deve ser usado como histórico, não como contexto ativo.
- Eventos `private` não devem aparecer fora da origem.
- Eventos `facet_only` só podem ir para `targetFacet`.
- Eventos `shared` podem circular dentro da K∧LINE, se `approved`.

O Ledger não cria chat entre facetas, não cria multiagente e não permite conversa interna simulada.
