# StocksRadar

## Instrukcja uruchamiania

Cześć,
projekt został wygenerowany za pomocą NXa i polecane jest uruchamiać go za jego pośrednictwem. Można wykorzystać do tego NX Console, można również korzystać z CLI.

Obowiązkowo należy pobrać paczki z npma oraz uruchomić backend:
```
npm i --legacy-peer-deps
```
```
docker run -p 32770:8080 --rm kubamichalek/statscore-websocket-recruitment
```

Następnie można zaserwować showcase, który zawiera w sobie tabelę, ale także kilka drobiazgów takich jak przycisk zmiany motywu między jasnym i ciemnym (domyślnie port 4200):
```
npx nx serve stocks-radar-host
```
Tabela jest zrealizowana jako osobna paczka w bibliotece i ma skonfigurowanego swojego storybooka, którego warto uruchomić aby podejrzeć rzadko występujące stany, takie jak error lub loading (domyślnie port 4400):
```
npx nx storybook table
```
Komponent ma przygotowany szereg testów wywoływanych z poziomu NXa:
```
npx nx test stocks-radar-host
```
Użycie @testing-library było nieobowiązkowe, więc zamiast tego użyłem Cypressa i przygotowałem krótkie testy E2E:
```
npx nx run stocks-radar-host-e2e:e2e
```

## Przemyślenia
- Do zapewnienia pojedynczego wywoływania animacji przy zmianie wartości komórki wykorzystałem operator shareReplay() z dowolnej długości kolejką i limitem czasowym. To rozwiązanie wydało się być najmniej problemowe.
- Na podstawie obecności symbolu na liście (właściwie w mapie) niedawno aktualizowanych danych, przypisywane są odpowiednie klasy odpowiedzialne za animację jednokrotnego lub trzykrotnego błyśnięcia komórką. Korzystam z angularowych zmiennych @let w templatce, aby nie powielać niepotrzebnie zapytań do store.
- Aby dodać coś ekstra od siebie, dodałem funkcjonalność wyszukiwania i funkcjonalność dodawania symboli do ulubionych, aby zawsze pojawiały się na górze listy.
- Dodałem też tryb jasny i tryb ciemny oraz pełnię animacji między nimi. Wybierałem spośród kolorów tailwinda. https://tailscan.com/colors
- Wygląd tabeli zainspirowany jest tymi materiałami: https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables https://codingartistweb.com/2021/01/glassmorphism-weather-card-ui-css/
- Aby uzyskać lepszy efekt dla glassmorphismu, wykorzystałem darmowe zdjęcia z unsplasha jako tło. Ponadto wykorzystałem pewien trick, aby się animowały przy swojej zamianie.

Dziękuję za uwagę i pozdrawiam.