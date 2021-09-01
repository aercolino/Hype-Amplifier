// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

class RedditAmplifier extends Amplifier {
    constructor(rows, pointsCountList, commentsCountList, maxAmplitude, pointsRatio) {
        super(pointsCountList, commentsCountList, maxAmplitude, pointsRatio);
        this.rows = rows;
    }

    amplifyItem(index, amplitude) {
        const row = this.rows[index];
        row.style.marginLeft = `${amplitude}px`;
    }
}

function upButtonsNodesList() {
    return document.querySelectorAll('button[data-click-id="upvote"][id]');
}

function commentsNodesList() {
    return document.querySelectorAll('a[data-click-id="comments"]');
}

function firstMessageElement() {
    return document.querySelector('div[data-click-id="body"]');
}

function movableRowsNodesList() {
    return document.querySelectorAll('div[data-click-id="background"]');
}

function pointsCountList() {
    const result = [];
    const nodesList = upButtonsNodesList();
    if (nodesList.length === 0) return result;

    for (element of nodesList) {
        const value = Amplifier.parseCount(element.nextElementSibling.textContent);
        result.push(value);
    }
    return result;
}

function commentsCountList() {
    const result = [];
    const nodesList = commentsNodesList();
    if (nodesList.length === 0) return result;

    for (element of nodesList) {
        const value = Amplifier.parseCount(element.textContent.split(' ')[0]);
        result.push(value);
    }
    return result;
}


chrome.extension.sendRequest({ getLocalStorage: "points_weight" }, function (response) {
    let newsCount = 0;
    let intervalId;
    let newsContainer;
    let clientWidth;
    function runCallbackIfNewsChanged(callback) {
        if (!newsContainer) {
            try {
                const firstMessage = firstMessageElement();
                newsContainer =  firstMessage.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                clientWidth = firstMessage.clientWidth;
            }
            catch (e) {
                return;
            }
        }
        const childrenCount = newsContainer.childElementCount;
        if (childrenCount === newsCount) {
            return;
        }
        newsCount = childrenCount;
        try {
            callback();
        }
        catch (e) {
            console.error(e);
            clearInterval(intervalId);
        }
    }
    intervalId = setInterval(runCallbackIfNewsChanged, 500, function () {
        const rows = movableRowsNodesList();
        if (rows.length === 0) return;

        const amp = new RedditAmplifier(rows, pointsCountList(), commentsCountList(), clientWidth, response && response.points_weight);
        amp.amplifyList();
    });
});
