# Version 2


## Functionalities to Implement

1. done - UX: Make it work both on Hacker News and Reddit, while keeping the spread based on points and comments

2. done - UX: Replace the slider with two controls

    1. points: an input box, accepting any positive integer between 0 and 100 (defaulted to 50)
    2. comments: a computed label, always set to the difference between 100 and the input value above

3. done - Code: Use a manifest of version 3

4. done - UX: On Reddit, use 5 stars to represent hype, not the spread; on Hacker News, keep using the spread

    1. Reddit: Use the stars, except in Reddit Home, with a _compact_ view
    2. Hacker News: Use the spread

    --

    + with a spread of 0%: 0 blue stars
    + with a spread between 0% (excluded) and 20% (included): 1 blue star
    + with a spread between 20% (excluded) and 40% (included): 2 blue stars
    + with a spread between 40% (excluded) and 60% (included): 3 blue stars
    + with a spread between 60% (excluded) and 80% (included): 4 blue stars
    + with a spread between 80% (excluded) and 100% (included): 5 blue stars

5. done - Code: Remove jQuery / jQuery UI dependencies

6. done - Code: Organize everything into classes


## Additional Functionalities

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


## Reddit Pages


### Stars

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


### Spread

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


### No Stars Nor Spread

+ User / Comments / Hot
+ User / Comments / New
+ User / Comments / Top / Now
+ User / Comments / Top / Today
+ User / Comments / Top / This Week
+ User / Comments / Top / This Month
+ User / Comments / Top / This Year
+ User / Comments / Top / All Time


## Hacker News Pages


### Stars

(none)


### Spread

+ Home `/`
+ New `/newest`
+ Past `/front`
+ Ask `/ask`
+ Show `/show`


### No Stars Nor Spread

+ Threads `/threads?id=<username>`
+ Comments `/newcomments`
+ Jobs `/jobs`
