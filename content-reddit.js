// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_FIRST_PAGE = 5; // units
const MESSAGES_ON_THE_USER_PAGES = 2; // units
const WAIT_FOR_NEWS_DELAY = 500; // milliseconds

class RedditAmplifier extends Amplifier {
    constructor(...args) {
        super(...args);
        this.pathname = '';
        this.messagesListElement = null;
        this.messagesWidth = 0;
        this.previousMessagesCount = 0;
        this.nextCheck = undefined;
        this.messagesListObserver = null;
        this.rows = [];
        this.currentView = '';
    }

    amplifyList({ pointsCountList, commentsCountList, rows }) {
        this.currentView = RedditAmplifier.getCurrentView();
        this.rows = rows;
        super.amplifyList({ pointsCountList, commentsCountList });
    }

    amplifyItem(index, percentage) {
        const row = this.rows[index];
        if (['card', 'classic'].includes(this.currentView)) {
            const title = row.querySelector(':scope h3');
            const previousRating = row.querySelector(':scope .hna-rating');
            if (previousRating) previousRating.remove();
            const stars = Amplifier.getStars(percentage);
            title.before(stars);
            return;
        }
        const amplitude = Amplifier.getAmplitude({ percentage, maxAmplitude: this.messagesWidth });
        row.style.marginLeft = `${amplitude}px`;
        row.classList.add('hna-spread');
    }

    pointsElements() {
        return this.messagesListElement.querySelectorAll(':scope [data-click-id="upvote"][id]~div');
    }

    commentsElements() {
        return this.messagesListElement.querySelectorAll(':scope [data-click-id="comments"]');
    }

    isUserPage() {
        return this.pathname.startsWith('/user/');
    }

    static isUserAnonymous() {
        return !!document.querySelector('a[href^="https://www.reddit.com/login"]')
    }

    static ancestorElement(element, levels) {
        let result = element;
        for (let i = 0; i < levels; i++) {
            result = result.parentElement;
        }
        return result;
    }

    waitForMessagesListElement() {
        // Reddit DOM structure on 2021-08
        const isUserPage = this.isUserPage();
        const isUserPostsPage = isUserPage && this.pathname.endsWith('/posts/');
        function messagesListIsAvailable() {
            try {
                if (!isUserPage || isUserPostsPage) {
                    const firstPost = document.querySelector('div.Post');
                    return RedditAmplifier.ancestorElement(firstPost, 3);
                }
                if (isUserPage) {
                    // 1- A user's pinned posts will appear in the overview page
                    // 2- We don't want to compute the hype of pinned posts
                    // 3- The difference between pinned and ordinary posts is that
                    //    the latter have a child with data-click-id="background"
                    const firstPost = document.querySelector('div.Post>[data-click-id="background"]').parentElement;
                    return RedditAmplifier.isUserAnonymous()
                        ? RedditAmplifier.ancestorElement(firstPost, 5)
                        : RedditAmplifier.ancestorElement(firstPost, 7);
                }
                // All other cases, will be caught by the timeout in waitForCondition
            }
            catch (e) {
                return undefined;
            }
        }
        return Amplifier.waitForCondition(this.pathname, messagesListIsAvailable);
    }

    waitForFirstPage() {
        const amp = this;
        function firstPageIsAvailable() {
            const messagesOnTheFirstPage = amp.isUserPage() ? MESSAGES_ON_THE_USER_PAGES : MESSAGES_ON_THE_FIRST_PAGE;
            return amp.messagesListElement.childElementCount >= messagesOnTheFirstPage;
        }
        return Amplifier.waitForCondition(this.pathname, firstPageIsAvailable);
    }

    static amplifiableElements() {
        return document.querySelectorAll('div[data-click-id="background"]');
    }

    static getCurrentView() {
        const viewSelectionElement = document.querySelector('#LayoutSwitch--picker');
        return viewSelectionElement ? viewSelectionElement.textContent : 'card';
        // No viewSelectionElement exists on users pages, which always use 'card'
    }

    amplification() {
        const pointsCountList = Amplifier.countList(this.pointsElements());
        const commentsCountList = Amplifier.countList(this.commentsElements());
        const rows = RedditAmplifier.amplifiableElements();
        this.amplifyList({ pointsCountList, commentsCountList, rows });
    }

    amplifyIfNewsChanged() {
        const messagesCount = this.messagesListElement.childElementCount;
        if (messagesCount === this.previousMessagesCount) {
            // As soon as we see that no news were added since the previous check, we stop checking again later
            clearInterval(this.nextCheck);
            // and instead start observing the news container again, waiting for the infinite scroll to kick in
            this.messagesListObserver.observe(this.messagesListElement, { childList: true });
            return;
        }
        this.previousMessagesCount = messagesCount;
        try {
            this.amplification();
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }

    start() {
        this.pathname = document.location.pathname;
        clearInterval(this.nextCheck);
        this.messagesListObserver?.disconnect();
        this.previousMessagesCount = 0;

        this.waitForMessagesListElement()
            .then((element) => {
                this.messagesListElement = element;
                return this.waitForFirstPage();
            })
            .then(() => {
                const firstMessage = this.messagesListElement.children[0];
                this.messagesWidth = firstMessage.clientWidth;
                this.messagesListObserver = new MutationObserver(() => {
                    // This observer is only used to detect when the Reddit page starts loading a new block of news (infinite scrolling)
                    this.messagesListObserver.disconnect();
                    // From then on, we look for newly added news, between adjacent checks, at regular intervals of time
                    this.nextCheck = setInterval(this.amplifyIfNewsChanged.bind(this), WAIT_FOR_NEWS_DELAY);
                });
                // Initially, we look for newly added news. Here a timeout would be enough, but it's easier to re-use the interval start
                this.nextCheck = setInterval(this.amplifyIfNewsChanged.bind(this), WAIT_FOR_NEWS_DELAY);
            })
            .catch((reason) => {
                console.log(`Failed start for ${this.pathname} because`, reason.message ?? reason);
            });
    }
}


chrome.storage.local.get(['points_weight'], function doTheMagic({ points_weight: pointsWeight }) {
    const amp = new RedditAmplifier(pointsWeight);
    amp.start();

    chrome.runtime.onMessage.addListener((request) => {
        if (request !== 'runAgain') return;
        amp.start();
    });
});
