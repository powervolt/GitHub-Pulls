var github = new Github({
    API_URL: "http://github.cerner.com/api/v3",
    token: "72324b82868ae87bb438fdf2507a9df35420e154",
    auth: "oauth"
});

var user = github.getUser();

setInterval(function () {
    run()
}, 10000);

function run() {
    var num =0;
    user.watchedRepos(function (err, repos) {
        if (!err) {
            for (i = 0; i < repos.length; i++) {
                var currentRepo = repos[i];
                var repo = github.getRepo(currentRepo.owner.login, currentRepo.name);
                repo.listPulls("open", function (err, pulls) {
                    if (!err) {
                        num = num + pulls.length;
                        chrome.browserAction.setBadgeText({text: num.toString()});
                    }
                });
            }
        }


    });

}
