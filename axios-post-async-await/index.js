const baseUrl = "https://ih-crud-api.herokuapp.com/characters";

// const getCharacters = () => {
//     // get characters from the api
//     axios.get(baseUrl).then(response => {
//         const data = response.data;

//         let str = "";

//         data.forEach(character => {
//             str += `<li>${character.id} ${character.name}</li>`;
//         });

//         // insert characters in the list in the html
//         document.getElementById("characters-list").innerHTML = str;
//     });
// };



const getCharacters = async () => {
    // get characters from the api
    const response = await axios.get(baseUrl)
    const data = response.data;
    let str = "";
    data.forEach(character => {
        str += `<li>${character.id} ${character.name}</li>`;
    });
    // insert characters in the list in the html
    document.getElementById("characters-list").innerHTML = str;
};


getCharacters();

// document.querySelector("form").onsubmit = event => {
//     event.preventDefault();
//     const name = document.getElementById("name").value;
//     const occupation = document.getElementById("occupation").value;
//     const debt = document.getElementById("debt").checked; // checkbox
//     const weapon = document.getElementById("weapon").value;

//     console.log(name, occupation, debt, weapon);

//     axios
//         .post("https://ih-crud-api.herokuapp.com/characters", {
//             name: name,
//             occupation: occupation,
//             debt: debt,
//             weapon: weapon
//         })
//         .then(response => {
//             getCharacters();
//         });
// };


document.querySelector("form").onsubmit = async event => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const occupation = document.getElementById("occupation").value;
    const debt = document.getElementById("debt").checked; // checkbox
    const weapon = document.getElementById("weapon").value;

    console.log(name, occupation, debt, weapon);

    try {
        const response = await axios.post(baseUrl, {
            name: name,
            occupation: occupation,
            debt: debt,
            weapon: weapon
        });
        console.log(response);
        getCharacters();
    } catch (err) {
        console.log(err);
    }
};