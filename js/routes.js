Path.map("#/home").to(function() {
    $("#stage").load("screens/home.html");
});

Path.map("#/list").to(function() {
    $("#stage").load("screens/list.html");
});

Path.map("#/storedetails/:name").to(function() {
    selectedstore = this.params['name'];
    $("#stage").load("screens/storedetails.html");
});

Path.map("#/about").to(function() {
    $("#stage").load("screens/about.html");
});

Path.map("#/policy").to(function() {
    $("#stage").load("screens/policy.html");
});

Path.map("#/terms").to(function() {
    $("#stage").load("screens/terms.html");
});

Path.root("#/home");
Path.listen();