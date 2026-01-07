document.addEventListener('DOMContentLoaded', () => {
    const root = document.body;

    // Fő konténer létrehozása
    const container = document.createElement('div');
    container.className = 'container';
    root.appendChild(container);

    // Cím és számláló
    const title = document.createElement('h2');
    title.innerHTML = '🧑‍🚀 Jelenleg az űrben';
    container.appendChild(title);

    const count = document.createElement('div');
    count.className = 'count';
    container.appendChild(count);

    // Szűrő legördülő
    const filterRow = document.createElement('div');
    filterRow.className = 'filter-row';
    const select = document.createElement('select');
    select.className = 'station-filter';
    filterRow.appendChild(select);
    container.appendChild(filterRow);

    // Kártyák gridje
    const grid = document.createElement('div');
    grid.className = 'grid';
    container.appendChild(grid);

    // Betöltés és hibaüzenet
    const msg = document.createElement('div');
    msg.className = 'msg';
    container.appendChild(msg);

    // Adatok tárolása
    let allPeople = [];

    // Lekérés
    async function fetchData() {
        try {
            const res = await fetch('http://api.open-notify.org/astros.json');
            if (!res.ok) throw new Error('Hálózati hiba');
            const data = await res.json();
            allPeople = data.people;
            count.textContent = `${data.number} fő tartózkodik.`;
            fillStations();
            renderCards();
            msg.textContent = '';
        } catch (e) {
            msg.textContent = 'Nem sikerült betölteni az adatokat!';
        }
    }

    // Szűrő feltöltése
    function fillStations() {
        const stations = Array.from(new Set(allPeople.map(p => p.craft)));
        select.innerHTML = '';
        const allOpt = document.createElement('option');
        allOpt.value = '';
        allOpt.textContent = 'Összes űrállomás';
        select.appendChild(allOpt);
        stations.forEach(st => {
            const opt = document.createElement('option');
            opt.value = st;
            opt.textContent = st;
            select.appendChild(opt);
        });
    }

    // Kártyák kirajzolása
    function renderCards() {
        grid.innerHTML = '';
        const filter = select.value;
        let filtered = allPeople;
        if (filter) {
            filtered = allPeople.filter(p => p.craft === filter);
        }
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="msg">Nincs találat.</div>';
            return;
        }
        filtered.forEach(person => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="name">${person.name}</div>
                <div class="craft">Űrállomás: ${person.craft}</div>
            `;
            grid.appendChild(card);
        });
    }

    // Szűrés
    select.addEventListener('change', renderCards);

    // Adatok betöltése
    fetchData();
});