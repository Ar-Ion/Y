// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

window.electronAPI.latest_content_loaded((content) => {

    latestContent.innerHTML = '';

    content.forEach((entry) => {

        var title = entry.title;
        var description = entry.description;
        var date = entry.date_created;

        latestContent.innerHTML += '<div class="card col-md-3 text-center m-4 p-0">
          <div class="card-header">
            Featured
          </div>
          <div class="card-body">
            <h5 class="card-title">' + title + '</h5>
            <p class="card-text">' + description + '</p>
            <a href="#" class="btn btn-primary">Access content</a>
          </div>
          <div class="card-footer text-muted">
            <span>' + getNumberOfDays(date, null) + '</span> days ago
          </div>
        </div>';
    })
});
