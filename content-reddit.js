// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_FIRST_PAGE = {
    card: 5,
    classic: 25,
    compact: 25,
}; // units
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

function pointsElements(messagesListElement) {
    return messagesListElement.querySelectorAll(':scope [data-click-id="upvote"][id]~div');
}

function commentsElements(messagesListElement) {
    return messagesListElement.querySelectorAll(':scope [data-click-id="comments"]');
}

function waitForMessagesListElement(pathname) {
    // Reddit DOM structure on 2021-08
    const isUserPage = pathname.startsWith('/user/');
    const isUserPostsPage = isUserPage && pathname.endsWith('/posts/');
    function innermostMessagesList() {
        try {
            if (! isUserPage || isUserPostsPage) {
                return document.querySelector('div.Post')
                    .parentElement.parentElement.parentElement;
            }
            if (isUserPage) {
                // 1- A user's pinned posts will appear in the overview page
                // 2- We don't want to compute the hype of pinned posts
                // 3- The difference between pinned and ordinary posts is that
                // the latter have a child with data-click-id="background" 
                return document.querySelector('div.Post>[data-click-id="background"]')
                    .parentElement.parentElement.parentElement
                    .parentElement.parentElement.parentElement;
            }
            // All other cases, will be caught by the timeout in waitForElement
        }
        catch (e) {
            return undefined;
        }
    }
    return Amplifier.waitForElement(pathname, innermostMessagesList);
}

function waitForFirstMessageElement(pathname, messagesListElement) {
    function firstMessage() {
        const messages = messagesListElement.children;
        const firstPageCompleted = messages.length >= MESSAGES_ON_THE_FIRST_PAGE[currentView()];
        if (firstPageCompleted) {
            return messages[0];
        }
        return undefined;
    }
    return Amplifier.waitForElement(pathname, firstMessage);
}

function amplifiableElements() {
    return document.querySelectorAll('div[data-click-id="background"]');
}

function currentView() {
    const viewSelectionElement = document.querySelector('#LayoutSwitch--picker');
    return viewSelectionElement ? viewSelectionElement.textContent : 'card';
    // No viewSelectionElement happens on users pages, which always use 'card'
}


chrome.storage.local.get(['points_weight'], function (response) {
    let messagesListElement;
    let messagesWidth;
    let messagesListObserver;
    let previousMessagesCount = 0;
    let nextCheck;

    function amplification() {
        const rows = amplifiableElements();
        if (rows.length === 0) return;

        const pointsCountList = Amplifier.countList(pointsElements(messagesListElement));
        const commentsCountList = Amplifier.countList(commentsElements(messagesListElement));
        const amp = new RedditAmplifier(rows, pointsCountList, commentsCountList, messagesWidth, response && response.points_weight);
        amp.amplifyList();
    }

    function amplifyIfNewsChanged() {
        const messagesCount = messagesListElement.childElementCount;
        if (messagesCount === previousMessagesCount) {
            // As soon as we see that no news were added since the previous check, we stop checking again later
            clearInterval(nextCheck);
            // and instead start observing the news container again, waiting for the infinite scroll to kick in
            messagesListObserver.observe(messagesListElement, { childList: true });
            return;
        }
        previousMessagesCount = messagesCount;
        try {
            amplification();
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }

    function setup(pathname) {
        waitForMessagesListElement(pathname)
            .then((element) => {
                messagesListElement = element;
                return waitForFirstMessageElement(pathname, element);
            })
            .then((firstMessage) => {
                messagesWidth = firstMessage.clientWidth;
                messagesListObserver = new MutationObserver(() => {
                    // This observer is only used to detect when the Reddit page starts loading a new block of news (infinite scrolling)
                    messagesListObserver.disconnect();
                    // From then on, we look for newly added news, between adjacent checks, at regular intervals of time
                    nextCheck = setInterval(amplifyIfNewsChanged, WAIT_FOR_NEWS_DELAY);
                });
                // Initially, we look for newly added news. Here a timeout would be enough, but it's easier to re-use the interval setup
                nextCheck = setInterval(amplifyIfNewsChanged, WAIT_FOR_NEWS_DELAY);
            })
            .catch((reason) => {
                console.log(`Failed setup for ${pathname} because`, reason.message ?? reason);
            });
    }

    setup(document.location.pathname);

    chrome.runtime.onMessage.addListener((request) => {
        if (request !== 'runAgain') return;
        clearInterval(nextCheck);
        messagesListObserver?.disconnect();
        previousMessagesCount = 0;
        setup(document.location.pathname);
    });
});
