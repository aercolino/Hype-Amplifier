# Version 2


## About functionalities

1. done - Make it work both on Hacker News and Reddit, while keeping the spread based on points and comments

2. done - Replace the slider with two controls

    1. points: an input box, accepting any positive integer between 0 and 100 (defaulted to 50)
    2. comments: a computed label, always set to the difference between 100 and the input value above

3. done - Use a manifest of version 3

4. On Reddit, use 5 stars to represent hype, not the spread; on Hacker News, keep using the spread

    1. Reddit: Use the stars, except in Reddit Home, with a _compact_ view
    2. Hacker News: Use the spread

    **Style**

    1. with a spread between 0% (included) and 20% (excluded): 1 blue star
    2. with a spread between 20% (included) and 40% (excluded): 2 blue stars
    3. with a spread between 40% (included) and 60% (excluded): 3 blue stars
    4. with a spread between 60% (included) and 80% (excluded): 4 blue stars
    5. with a spread between 80% (included) and 100% (excluded): 5 blue stars
    6. with a spread of 100%: 5 red stars


---


### Additional functionalities

I now think that these aren't that useful.

1. Allow the user to navigate the current spread

    1. the user navigates a spread using the arrow buttons that appear when she hovers the title
    2. the app will scroll to and highlight the prev / next entry
    3. option checkbox "Display arrows", whose change is immediately reflected in the page

2. Allow the user to pin a message, which will freeze its horizontal position

    1. the user pins / unpins a message using the button that appears when she hovers the title
    2. as soon as a message is pinned, a new spread is applied, like if that message didn't exist
    3. as soon as a message is unpinned, a new spread is applied, like if that message existed again
    4. option checkbox "Display pin", whose change is immediately reflected in the page

3. Allow to invert the spread, i.e. with the least hyped news on the leftmost positions

    1. option checkbox "Invert spread", whose change is immediately reflected in the page


## About implementation

I've been refactoring today the `Amplifier`, `RedditAmplifier`, and `HackerNewsAmplifier` classes.

My intention is to bring the `amplification`, `amplifyIfNewsChanged`, and `setup` functions into the amplifier classes, so that all the code will feel better organized, and the `doTheMagic` function will be reduced to instantiating the amplifier class and call `setup` (and it's `chrome.runtime.onMessage` counterpart).


## Reddit Pages

+ Home / Card / Best
+ Home / Card / Hot
+ Home / Card / New
+ Home / Card / Rising
+ Home / Card / Top / Now
+ Home / Card / Top / Today
+ Home / Card / Top / This Week
+ Home / Card / Top / This Month
+ Home / Card / Top / This Year
+ Home / Card / Top / All Time
+ Home / Classic / Best
+ Home / Classic / Hot
+ Home / Classic / New
+ Home / Classic / Rising
+ Home / Classic / Top / Now
+ Home / Classic / Top / Today
+ Home / Classic / Top / This Week
+ Home / Classic / Top / This Month
+ Home / Classic / Top / This Year
+ Home / Classic / Top / All Time
+ Home / Compact / Best
+ Home / Compact / Hot
+ Home / Compact / New
+ Home / Compact / Rising
+ Home / Compact / Top / Now
+ Home / Compact / Top / Today
+ Home / Compact / Top / This Week
+ Home / Compact / Top / This Month
+ Home / Compact / Top / This Year
+ Home / Compact / Top / All Time

+ User / Overview / Hot
+ User / Overview / New
+ User / Overview / Top / Now
+ User / Overview / Top / Today
+ User / Overview / Top / This Week
+ User / Overview / Top / This Month
+ User / Overview / Top / This Year
+ User / Overview / Top / All Time
+ User / Posts / Hot
+ User / Posts / New
+ User / Posts / Top / Now
+ User / Posts / Top / Today
+ User / Posts / Top / This Week
+ User / Posts / Top / This Month
+ User / Posts / Top / This Year
+ User / Posts / Top / All Time
+ User / Comments / Hot
+ User / Comments / New
+ User / Comments / Top / Now
+ User / Comments / Top / Today
+ User / Comments / Top / This Week
+ User / Comments / Top / This Month
+ User / Comments / Top / This Year
+ User / Comments / Top / All Time
