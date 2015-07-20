//Pulls.js

var opts = {
    lines: 13, // The number of lines to draw
    length: 10, // The length of each line
    width: 2, // The line thickness
    radius: 3, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};

var spinner;
$(document).ready(function () {
    var target = document.getElementById('status');
    spinner = new Spinner(opts).spin(target);
});

var github = new Github({
    API_URL: "http://github.cerner.com/api/v3",
    token: "72324b82868ae87bb438fdf2507a9df35420e154",
    auth: "oauth"
})

var user = github.getUser();

function Pull(description, repo, number, link) {
    this.descrption = description;
    this.repo = repo;
    this.number = number;
    this.link = link
}

var pullRequests = [];
user.watchedRepos(function (err, repos) {
    if (!err) {
        for (i = 0; i < repos.length; i++) {
            var currentRepo = repos[i];
            var repo = github.getRepo(currentRepo.owner.login, currentRepo.name);
            repo.listPulls("open", function (err, pulls) {
                if (!err) {
                    var message = document.getElementById("no-pull");
                    message.hidden = true;

                    for (j = 0; j < pulls.length; j++) {
                        var pull = new Pull(pulls[j].title, pulls[j].base.repo.name, pulls[j].number, pulls[j].url);
                        pullRequests.push(pull);
                        addToTable(pull);
                    }

                    var table = document.getElementById("myTable");
                    table.hidden = false;
                }
                currentRepo = null;
                repo = null;
            });
        }

    }
    if (pullRequests.length <= 0) {
        var table = document.getElementById("myTable");
        table.hidden = true;

        var message = document.getElementById("no-pull");
        message.hidden = false;

        spinner.stop();
    }
});
function addToTable(Pull) {
    var table = document.getElementById("myTable");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "<a href=" + Pull.link.replace("api/v3/repos/", "").replace("pulls", "pull") + ">" + Pull.descrption + "<br />" + Pull.repo + "</a>";
}

$(document).ready(function () {
    $('body').on('click', 'a', function () {
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
});