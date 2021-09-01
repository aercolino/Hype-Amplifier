// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_FIRST_PAGE = 26; // units
const WAIT_FOR_ELEMENT_TO_APPEAR = 100; // milliseconds
const WAIT_FOR_NEWS_TO_CHANGE = 500; // milliseconds

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
    const messages = document.querySelectorAll('div[data-click-id="body"]');
    const firstPageCompleted = messages.length === MESSAGES_ON_THE_FIRST_PAGE;
    if (firstPageCompleted) {
        return messages[0];
    }
    return undefined;
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

function waitForElement(selectorFn) {
    return new Promise((resolve) => {
        let element;
        const intervalId = setInterval(() => {
            element = selectorFn();
            if (element) {
                clearInterval(intervalId);
                resolve(element);
            }
        }, WAIT_FOR_ELEMENT_TO_APPEAR);
    });
}


chrome.extension.sendRequest({ getLocalStorage: "points_weight" }, function (response) {
    let newsContainer;
    let newsWidth;
    let observer;
    let newsCount = 0;
    let intervalId;

    function amplification() {
        const rows = movableRowsNodesList();
        if (rows.length === 0) return;

        const amp = new RedditAmplifier(rows, pointsCountList(), commentsCountList(), newsWidth, response && response.points_weight);
        amp.amplifyList();
    }

    function amplifyIfNewsChanged() {
        const childrenCount = newsContainer.childElementCount;
        if (childrenCount === newsCount) {
            clearInterval(intervalId);
            observer.observe(newsContainer, { childList: true });
            return;
        }
        newsCount = childrenCount;
        try {
            amplification();
        }
        catch (e) {
            console.error(e);
            clearInterval(intervalId);
        }
    }

    waitForElement(firstMessageElement)
        .then((firstMessage) => {
            newsContainer =  firstMessage.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            newsWidth = firstMessage.clientWidth;
            observer = new MutationObserver(() => {
                observer.disconnect();
                intervalId = setInterval(amplifyIfNewsChanged, WAIT_FOR_NEWS_TO_CHANGE);
            });
            intervalId = setInterval(amplifyIfNewsChanged, WAIT_FOR_NEWS_TO_CHANGE);
        });
});
