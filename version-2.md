# Version 2


## About functionalities

1. done - Make it work both on Hacker News and Reddit, while keeping the spread based on points and comments

2. done - Replace the slider with two controls

    1. points: an input box, accepting any positive integer between 0 and 100 (defaulted to 50)
    2. comments: a computed label, always set to the difference between 100 and the input value above

3. done - Use a manifest of version 3

4. Allow the user to pin a message, which will freeze its horizontal position

    1. the user pins / unpins a message using the button that appears when she hovers the title
    2. as soon as a message is pinned, a new spread is applied, like if that message didn't exist
    3. as soon as a message is unpinned, a new spread is applied, like if that message existed again
    4. option checkbox "Display pin", whose change is immediately reflected in the page

5. Allow the user to replace the usual spread with stars

    1. option checkbox "Use stars", whose change is immediately reflected in the page

    **Details**

    1. "Use stars" not checked (default)
        1. Reddit Card: Use the stars
        2. Reddit Classic: Don't use the stars
        3. Reddit Compact: Don't use the stars
        4. Hacker News: Don't use the stars

    2. "Use stars" checked
        1. Reddit Card: Use the stars
        2. Reddit Classic: Use the stars
        3. Reddit Compact: Use the stars
        4. Hacker News: Use the stars

    **Style**

    1. with a spread between 0% (included) and 20% (excluded): 1 blue star
    2. with a spread between 20% (included) and 40% (excluded): 2 blue stars
    3. with a spread between 40% (included) and 60% (excluded): 3 teal stars
    4. with a spread between 60% (included) and 80% (excluded): 4 yellow stars
    5. with a spread between 80% (included) and 100% (excluded): 5 green stars
    6. with a spread of 100%: 5 red stars

---


### Additional functionalities

I now think that these aren't that useful.

6. Allow the user to navigate the current spread

    1. the user navigates a spread using the arrow buttons that appear when she hovers the title
    2. the app will scroll to and highlight the prev / next entry
    3. option checkbox "Display arrows", whose change is immediately reflected in the page

7. Allow to invert the spread, i.e. with the least hyped news on the leftmost positions

    1. option checkbox "Invert spread", whose change is immediately reflected in the page
