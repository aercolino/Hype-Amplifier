// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (!(request.getLocalStorage && request.getLocalStorage == 'points_weight')) {
        sendResponse({});
        return;
    }
    if (!localStorage['points_weight']) {
        localStorage['points_weight'] = 50;
    }
    sendResponse({ points_weight: localStorage['points_weight'] });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    switch (true) {
        case tab.url.search('^https://news.ycombinator.com/') > -1:
        case tab.url.search('^https://www.reddit.com/') > -1:
            chrome.pageAction.show(tabId);
            break;
    }

    // Tab.url (https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab)
    // The last committed URL of the main frame of the tab. This property is only present if the
    // extension's manifest includes the "tabs" permission and may be an empty string if the tab has
    // not yet committed.
});
