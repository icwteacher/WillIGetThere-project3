let gebruikersXML = `<?xml version="1.0"?><gebruikers></gebruikers>`;

function toggleWachtwoord() {
    const wachtwoordInput = document.getElementById("wachtwoord");
    wachtwoordInput.type = wachtwoordInput.type === "password" ? "text" : "password";
}

document.getElementById("LoginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Voorkom standaard form redirect

    const email = document.getElementById("email").value;
    const wachtwoord = document.getElementById("wachtwoord").value;

    if (!email || !wachtwoord) return;

    // XML-parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gebruikersXML, "application/xml");

    // Nieuwe gebruiker maken
    const nieuweGebruiker = xmlDoc.createElement("gebruiker");
    const emailNode = xmlDoc.createElement("email");
    const wachtwoordNode = xmlDoc.createElement("wachtwoord");
    
    emailNode.textContent = email;
    wachtwoordNode.textContent = wachtwoord;
    nieuweGebruiker.appendChild(emailNode);
    nieuweGebruiker.appendChild(wachtwoordNode);
    
    xmlDoc.documentElement.appendChild(nieuweGebruiker);

    // XML opnieuw als string opslaan
    const serializer = new XMLSerializer();
    gebruikersXML = serializer.serializeToString(xmlDoc);

    // Gebruikers tonen
    toonGebruikers(xmlDoc);

    // Optioneel: form leegmaken
    document.getElementById("LoginForm").reset();
});

function toonGebruikers(xmlDoc) {
    let output = "<h3>Geregistreerde Gebruikers:</h3><ul>";
    const gebruikers = xmlDoc.getElementsByTagName("gebruiker");
    
    for (let i = 0; i < gebruikers.length; i++) {
        const email = gebruikers[i].getElementsByTagName("email")[0].textContent;
        output += `<li>${email}</li>`;
    }
    output += "</ul>";

    let listDiv = document.getElementById("gebruikerList");
    if (!listDiv) {
        listDiv = document.createElement("div");
        listDiv.id = "gebruikerList";
        document.body.appendChild(listDiv);
    }
    listDiv.innerHTML = output;
}
