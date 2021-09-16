// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

const MESSAGES_ON_THE_FIRST_PAGE = {
    card: 5,
    classic: 25,
    compact: 25,
}; // units
const WAIT_FOR_NEWS_DELAY = 500; // milliseconds

class RedditAmplifier extends Amplifier {
    amplifyList({ pointsCountList, commentsCountList, rows, maxWidth }) {
        this.rows = rows;
        this.maxWidth = maxWidth;
        this.currentView = RedditAmplifier.currentView();
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
        const amplitude = Amplifier.getAmplitude({ percentage, maxAmplitude: this.maxWidth });
        row.style.marginLeft = `${amplitude}px`;
        row.classList.add('hna-spread');
    }

    static pointsElements(messagesListElement) {
        return messagesListElement.querySelectorAll(':scope [data-click-id="upvote"][id]~div');
    }

    static commentsElements(messagesListElement) {
        return messagesListElement.querySelectorAll(':scope [data-click-id="comments"]');
    }

    static waitForMessagesListElement(pathname) {
        // Reddit DOM structure on 2021-08
        const isUserPage = pathname.startsWith('/user/');
        const isUserPostsPage = isUserPage && pathname.endsWith('/posts/');
        function messagesListIsAvailable() {
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
                // All other cases, will be caught by the timeout in waitForCondition
            }
            catch (e) {
                return undefined;
            }
        }
        return Amplifier.waitForCondition(pathname, messagesListIsAvailable);
    }

    static waitForFirstPage(pathname, messagesListElement) {
        function firstPageIsAvailable() {
            return messagesListElement.childElementCount >= MESSAGES_ON_THE_FIRST_PAGE[RedditAmplifier.currentView()];
        }
        return Amplifier.waitForCondition(pathname, firstPageIsAvailable);
    }

    static amplifiableElements() {
        return document.querySelectorAll('div[data-click-id="background"]');
    }

    static currentView() {
        const viewSelectionElement = document.querySelector('#LayoutSwitch--picker');
        return viewSelectionElement ? viewSelectionElement.textContent : 'card';
        // No viewSelectionElement exists on users pages, which always use 'card'
    }

}


chrome.storage.local.get(['points_weight'], function doTheMagic({ points_weight: pointsWeight }) {
    let messagesListElement;
    let messagesWidth;
    let messagesListObserver;
    let previousMessagesCount = 0;
    let nextCheck;

    function amplification() {
        const rows = RedditAmplifier.amplifiableElements();
        if (rows.length === 0) return;

        const pointsCountList = Amplifier.countList(RedditAmplifier.pointsElements(messagesListElement));
        const commentsCountList = Amplifier.countList(RedditAmplifier.commentsElements(messagesListElement));
        const amp = new RedditAmplifier(pointsWeight);
        amp.amplifyList({ pointsCountList, commentsCountList, rows, maxWidth: messagesWidth });
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
        RedditAmplifier.waitForMessagesListElement(pathname)
            .then((element) => {
                messagesListElement = element;
                return RedditAmplifier.waitForFirstPage(pathname, element);
            })
            .then(() => {
                const firstMessage = messagesListElement.children[0];
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
