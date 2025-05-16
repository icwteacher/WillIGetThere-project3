/**
 * Bereken een nieuwe correctiefactor op basis van het verschil tussen verwacht en werkelijk verbruik.
 * @param {number} huidigeFactor - De huidige correctiefactor.
 * @param {number} verwachtVerbruik - Het verwachte verbruik.
 * @param {number} werkelijkVerbruik - Het werkelijke verbruik.
 * @returns {number} - De nieuwe correctiefactor.
 */
function pasCorrectiefactorAan(huidigeFactor, verwachtVerbruik, werkelijkVerbruik) {
    if (typeof verwachtVerbruik !== 'number' || typeof werkelijkVerbruik !== 'number') {
        throw new Error('Verwacht en werkelijk verbruik moeten nummers zijn.');
    }
    if (werkelijkVerbruik === 0) {
        throw new Error('Werkelijk verbruik kan niet nul zijn.');
    }
    const verschil = werkelijkVerbruik / verwachtVerbruik;
    return huidigeFactor * verschil;
}

// Voorbeeldgebruik
const origineleWaarden = [100, 200, 300];
let factor = 1.1; // +10%
let gecorrigeerdeWaarden = pasCorrectiefactorToe(origineleWaarden, factor);

console.log('Originele waarden:', origineleWaarden);
console.log('Gecorrigeerde waarden:', gecorrigeerdeWaarden);

// Stel dat de gebruiker het werkelijke verbruik opgeeft
const werkelijkVerbruik = 620; // Bijvoorbeeld door de gebruiker ingevoerd
const verwachtVerbruik = gecorrigeerdeWaarden.reduce((acc, waarde) => acc + waarde, 0);

factor = pasCorrectiefactorAan(factor, verwachtVerbruik, werkelijkVerbruik);
gecorrigeerdeWaarden = pasCorrectiefactorToe(origineleWaarden, factor);

console.log('Nieuwe correctiefactor:', factor);
console.log('Nieuwe gecorrigeerde waarden:', gecorrigeerdeWaarden);

module.exports = {
    berekenCorrectiefactor,
    pasCorrectiefactorToe,
    pasCorrectiefactorAan
};  