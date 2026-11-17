# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/`

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Concessionárias | carregando | Network → throttling 3G → F5 | spinner "Carregando concessionárias…" |
| Concessionárias | vazio | API recém-iniciada | "Nenhuma concessionária ainda…" |
| Concessionárias | erro | Ctrl+C na API → F5 | "Não consegui falar com a API…" + Tentar de novo |
| Concessionárias | sucesso | cadastrar uma concessionária | tabela com 1 linha |
| Concessionárias | erro de regra | cadastrar duas concessionárias com o mesmo CNPJ | aviso "Já existe uma concessionária com este CNPJ" (409) |
| Veículos | carregando | Network → throttling 3G → F5 | spinner "Carregando veículos…" |
| Veículos | vazio | sem veículos cadastrados | "Nenhum veículo ainda…" |
| Veículos | erro | Ctrl+C na API → F5 | "Não consegui falar com a API…" + Tentar de novo |
| Veículos | sucesso | escolher a concessionária no `<select>` e cadastrar o veículo | tabela com o nome da concessionária, não o id |
| Veículos | erro de regra | cadastrar veículo com ano `1899` | aviso "'ano' deve ser um inteiro entre 1900 e 2027" (400) |

## Camadas
- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/`
