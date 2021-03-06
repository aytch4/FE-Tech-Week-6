class Habitat {
    constructor(habitat) {
        this.habitat = habitat;
        this.animals = [];
    }
    
    addAnimal(name, number) {
        console.log("in addAnimal")
        console.log("Name" + name)
        console.log.log("Number" + number)
        this.animals.push(new Animal(name, number));
//        location.reload()
    }
}

class Animal {
    constructor(name, number) {
        this.name = name;
        this.number = number;
    }
}

class HabitatService {
    static url = "https://crudcrud.com/api/9051bd1a13694487827985406b3bbb0e/unicorns";    

    static getAllHabitats() {
        return $.get(this.url);
    }

    static getHabitat(id) {
        return $.get(this.url + `/${id}`);
    }

    static createHabitat(habitat) {
        console.log("habitat create" + habitat);
        return $.ajax({
            url: this.url, 
            dataType: 'json',
            data: JSON.stringify(habitat),
            contentType: 'application/json',
            type: "POST"
        });
    }

    static updateHabitat(habitat) {
        console.log("habitat update" + habitat);
        return $.ajax({
            url: this.url+ `/${habitat._id}`,
           // dataType: 'json',
            data: JSON.stringify({
                "habitat" : habitat.habitat,
                "animals" : habitat.animals}),
            contentType: 'application/json',
            type: 'PUT'
        });
    };

    static deleteHabitat(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: "DELETE"
        })
    }
}

class DOMManager {
    static habitats;

    static getAllHabitats() {
        console.log("inside getAllHabitats")
        HabitatService.getAllHabitats().then(habitats => this.render(habitats));
    }

    static createHabitat(name) {
        console.log("inside DOMManager createHabitat")
        HabitatService.createHabitat(new Habitat(name))
            .then(() => {
                return HabitatService.getAllHabitats();
            })
            .then((habitats) => this.render(habitats));
    }

    static deleteHabitat(id) {
        HabitatService.deleteHabitat(id)
            .then(() => {
                console.log("deleteHabitat")
                return HabitatService.getAllHabitats();
            })
            .then((habitats) => this.render(habitats));
    }

    static addAnimal(id) {
        console.log(this.habitat + "this.habitat in static AddAnimal")
        console.log("This is the type of variable" + typeof this.habitat)
        console.log(this.habitat)
        for (let habitat of this.habitats) {
            console.log("Hooray in the for loop")
            if (habitat._id == id) {
                console.log("Hooray in the for if")
                habitat.animals.push(new Animal($(`#${habitat._id}-animal-name`).val(), $(`#${habitat._id}-animal-number`).val()));
                console.log("HabitatService.updateHabitat(habitat) ")
                console.log("habitat")
                console.log(habitat)
                HabitatService.updateHabitat(habitat) 
                    .then(() => {
                        console.log("updateHabitat in addAnimal")
                        return HabitatService.getAllHabitats();
                    })
                    .then(habitats => this.render(habitats));
                }
            }

            console.log("bottom of addAnimal method")
        }
//Jolene's way
    // static deleteAnimal(habitatId, animalName) {
    //     for (let animal of this.habitats) {
    //         if (habitat._id == habitatId) {
    //             for (let i = 0; i < habitat.animals; i++) {
    //                 const animal = habitat.animals[i];
    //                  if (animal.name == animalName) {
    //                     habitat.animals.splice(i, 1);
    //                     HabitatService.updateHabitat(habitat)
    //                         .then(() => {
    //                             return HabitatService.getAllHabitats();
    //                         })
    //                         //need to fix habitats if it is undefined 
    //                         .then(habitats => this.render(habitats));
    //                 }
    //             }
    //         }
    //     }
    // }

    static deleteAnimal(habitatId, animalId) {
        for (let habitat of this.habitats) {
            if (habitat._id == habitatId) {
                for (let animal of habitat.animals) {
                    if (animal.name == animalId) {
                        habitat.animals.splice(habitat.animals.indexOf(animal, 1));
                        HabitatService.updateHabitat(habitat)
                            .then(() => {
                                return HabitatService.getAllHabitats();
                            })
                            .then(habitats => this.render(habitats));
                    }
                }
            }
        }
    }

    static render(habitats) {
        this.habitats = habitats;
        $("#app").empty();
        for(let habitat of habitats) {
            $("#app").prepend(
                `<div id="${habitat._id}" class="card text-white bg-dark mb-3">
                    <div class="card-header">
                        <h2>${habitat.habitat}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteHabitat('${habitat._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card text-white bg-dark mb-3">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${habitat._id}-animal-name" class="form-control" placeholder="Animal Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${habitat._id}-animal-number" class="form-control" placeholder="Number of Animals">
                                </div>
                            </div>
                            <button id="${habitat._id}-new-animal" onclick="DOMManager.addAnimal('${habitat._id}')" class="btn btn-primary form-control">Add</button>
                            </div>
                    </div>
                </div>
            </div>
            <br>`
            );
            for (let animal of habitat.animals) {
                $(`#${habitat._id}`).find(".card-body").append(
                    `<p>
                        <span id="name-${animal.name}"><strong>Name:  </strong> ${animal.name}</span>
                        <span id="number-${animal.name}"><strong>Number:  </strong> ${animal.number}</span><br>
                        <button class="btn btn-danger" onclick="DOMManager.deleteAnimal('${habitat._id}', '${animal.name}')">Delete Animal</button>`
                );
            }
        }
    }
}

$('#create-new-habitat').click(() => {
    DOMManager.createHabitat($('#new-habitat-name').val());
    $('#new-habitat-name').val('');
    console.log("new habitat name")
    console.log($('#new-habitat-name').val(''))
});

DOMManager.getAllHabitats();
