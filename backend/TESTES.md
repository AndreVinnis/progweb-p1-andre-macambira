# Testes da API — Projeto 1 (S3)

API: Concessionária API · entidades: Concessionaria e Veiculo (1:N) · servidor: `npm run dev` em http://localhost:3000

Os dados ficam em memória, então a sequência abaixo vale **a partir de um servidor recém-iniciado e na ordem da tabela** (os ids dependem disso). O preço é guardado em **inteiro de centavos** (`precoCentavos`: R$ 89.900,00 = `8990000`), para não usar ponto flutuante em dinheiro.

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | GET | / | — | 200 | health check |
| 2 | POST | /concessionarias | {"nome":"AutoCampina","cnpj":"12.345.678/0001-90","cidade":"Campina Grande"} | 201 | id 1 |
| 3 | POST | /concessionarias | {"nome":"Nordeste Veículos","cnpj":"98.765.432/0001-10","cidade":"João Pessoa"} | 201 | id 2 |
| 4 | GET | /concessionarias | — | 200 | lista com 2 |
| 5 | POST | /concessionarias | {"nome":"Cópia","cnpj":"12.345.678/0001-90","cidade":"Patos"} | 409 | regra: CNPJ único |
| 6 | POST | /concessionarias | {"nome":"Sem CNPJ"} | 400 | campos obrigatórios |
| 7 | POST | /veiculos | {"marca":"Fiat","modelo":"Argo","ano":2024,"placa":"qwe1a23","precoCentavos":8990000,"concessionariaId":1} | 201 | id 1, placa gravada como QWE1A23 |
| 8 | POST | /veiculos | {"marca":"VW","modelo":"Polo","ano":2023,"placa":"RTY4B56","precoCentavos":9250000,"concessionariaId":2} | 201 | id 2 |
| 9 | GET | /veiculos | — | 200 | lista com 2 |
| 10 | GET | /veiculos?concessionariaId=1 | — | 200 | filtro 1:N, só o Argo |
| 11 | GET | /veiculos/1 | — | 200 | |
| 12 | GET | /veiculos/99 | — | 404 | veículo não existe |
| 13 | POST | /veiculos | {"marca":"Fiat","modelo":"Mobi","ano":2024,"placa":"ZZZ9Z99","precoCentavos":-100,"concessionariaId":1} | 400 | regra: preço > 0 |
| 14 | POST | /veiculos | {"marca":"Fiat","modelo":"Mobi","ano":2024,"placa":"ZZZ9Z99","precoCentavos":89.9,"concessionariaId":1} | 400 | regra: preço em centavos inteiros |
| 15 | POST | /veiculos | {"marca":"Fiat","modelo":"Mobi","ano":1800,"placa":"ZZZ9Z99","precoCentavos":6000000,"concessionariaId":1} | 400 | regra: ano entre 1900 e o ano seguinte ao atual |
| 16 | POST | /veiculos | {"marca":"Fiat","modelo":"Uno","ano":2024,"placa":"QWE1A23","precoCentavos":6000000,"concessionariaId":1} | 409 | regra: placa única |
| 17 | POST | /veiculos | {"marca":"Fiat","modelo":"Mobi","ano":2024,"placa":"ZZZ9Z99","precoCentavos":6000000,"concessionariaId":999} | 422 | concessionária não existe |
| 18 | POST | /veiculos | {"marca":"Fiat"} | 400 | campos obrigatórios |
| 19 | PUT | /veiculos/1 | {"precoCentavos":8500000} | 200 | |
| 20 | PUT | /veiculos/1 | {"concessionariaId":999} | 422 | regra vale também na atualização |
| 21 | PUT | /veiculos/1 | {"placa":"RTY4B56"} | 409 | placa de outro veículo |
| 22 | PUT | /concessionarias/1 | {"cidade":"Campina Grande - PB"} | 200 | |
| 23 | PUT | /concessionarias/2 | {"cnpj":"12.345.678/0001-90"} | 409 | CNPJ de outra concessionária |
| 24 | DELETE | /concessionarias/1 | — | 409 | regra: não remove concessionária com veículos |
| 25 | DELETE | /veiculos/1 | — | 204 | |
| 26 | DELETE | /concessionarias/1 | — | 204 | agora sem veículos |
| 27 | GET | /concessionarias/1 | — | 404 | |
| 28 | DELETE | /veiculos/1 | — | 404 | já removido |
| 29 | PUT | /veiculos/99 | {"precoCentavos":100} | 404 | atualizar inexistente |
| 30 | GET | /carros | — | 404 | rota que não existe |
| 31 | PUT | /veiculos/2 | {"placa":null,"marca":null,"x":1} | 400 | não apaga campo obrigatório |
| 32 | PUT | /concessionarias/2 | {"cnpj":null,"nome":"","foo":"bar"} | 400 | idem, texto vazio ou null |
| 33 | POST | /concessionarias | {"nome":1,"cnpj":{},"cidade":[]} | 400 | campos precisam ser texto |
| 34 | POST | /veiculos | {"marca":"Fiat","modelo":"Mobi","ano":2024,"placa":"ZZZ9Z99","precoCentavos":6000000,"concessionariaId":true} | 400 | id precisa ser inteiro positivo |
| 35 | PUT | /veiculos/2 | {"x":1,"modelo":"Polo Track"} | 200 | campo desconhecido "x" é ignorado |
