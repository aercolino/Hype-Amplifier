// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_FIRST_PAGE = 25; // units
const WAIT_FOR_NEWS_DELAY = 500; // milliseconds

class RedditAmplifier extends Amplifier {
    constructor(rows, pointsCountList, commentsCountList, maxAmplitude, pointsRatio) {
        super(pointsCountList, commentsCountList, maxAmplitude, pointsRatio);
        this.rows = rows;
        this.currentView = currentView();
    }

    amplifyItem(index, { pointsCount, commentsCount }) {
        const row = this.rows[index];
        if (this.currentView === 'card') {
            const title = row.querySelector(':scope h3');
            const percentage = this.getPercentage({ pointsCount, commentsCount });
            const stars = Amplifier.ratingStarsElement(percentage);
            const previousRating = row.querySelector(':scope .rating');
            if (previousRating) previousRating.remove();
            title.before(stars);
            return;
        }
        const amplitude = this.getAmplitude({ pointsCount, commentsCount });
        row.style.marginLeft = `${amplitude}px`;
    }
}

function pointsElements() {
    return document.querySelectorAll('button[data-click-id="upvote"][id]~div');
}

function commentsElements() {
    return document.querySelectorAll('a[data-click-id="comments"]');
}

function firstMessageElement() {
    const messages = document.querySelectorAll('div.Post');
    const firstPageCompleted = messages.length >= MESSAGES_ON_THE_FIRST_PAGE;
    if (firstPageCompleted) {
        return messages[0];
    }
    return undefined;
}

function amplifiableElements() {
    return document.querySelectorAll('div[data-click-id="background"]');
}

function currentView() {
    return document.querySelector('#LayoutSwitch--picker').textContent; // -> 'classic'
}


chrome.storage.local.get(['points_weight'], function(response) {
    let newsContainer;
    let newsWidth;
    let observer;
    let newsCount = 0;
    let intervalId;

    function amplification() {
        const rows = amplifiableElements();
        if (rows.length === 0) return;

        const pointsCountList = Amplifier.countList(pointsElements());
        const commentsCountList = Amplifier.countList(commentsElements());
        const amp = new RedditAmplifier(rows, pointsCountList, commentsCountList, newsWidth, response && response.points_weight);
        amp.amplifyList();
    }

    function amplifyIfNewsChanged() {
        const childrenCount = newsContainer.childElementCount;
        if (childrenCount === newsCount) {
            // As soon as we see that no news were added since the previous check, we stop checking again later
            clearInterval(intervalId);
            // and instead start observing the news container again, waiting for the infinite scroll to kick in
            observer.observe(newsContainer, { childList: true });
            return;
        }
        newsCount = childrenCount;
        try {
            amplification();
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }

    Amplifier.waitForElement(firstMessageElement)
        .then((firstMessage) => {
            // As of 2021-08, this is how you go from the message to the smallest news container in the Reddit page
            newsContainer = firstMessage.parentElement.parentElement.parentElement;
            newsWidth = firstMessage.clientWidth;
            observer = new MutationObserver(() => {
                // This observer is only used to detect when the Reddit page starts loading a new block of news (infinite scrolling)
                observer.disconnect();
                // From then on, we look for newly added news, between adjacent checks, at regular intervals of time
                intervalId = setInterval(amplifyIfNewsChanged, WAIT_FOR_NEWS_DELAY);
            });
            // Initially, we look for newly added news. Here a timeout would be enough, but it's easier to re-use the interval setup
            intervalId = setInterval(amplifyIfNewsChanged, WAIT_FOR_NEWS_DELAY);
        });
});
