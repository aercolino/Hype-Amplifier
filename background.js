// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

// See https://developer.chrome.com/docs/extensions/reference/action/
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'news.ycombinator.com', schemes: ['https'] },
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'www.reddit.com', schemes: ['https'] },
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        }]);
    });
});
