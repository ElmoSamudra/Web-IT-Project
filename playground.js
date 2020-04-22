const unsplash = require('unsplash-js')

unsplash.search.photos("dogs", 1, 10, { orientation: "portrait" })
    .then(toJson)
    .then(json => {
        console.log(json);

    });

