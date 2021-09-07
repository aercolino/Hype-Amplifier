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

5. Allow the user to replace the usual spread with a progress bar, whose length equals the spread

    Example

    ```html
    <progress value="15" max="100" style="width: 600px;"></progress>
    ```

    1. option checkbox "Use thermometer", whose change is immediately reflected in the page


---


### Additional functionalities

I now think that these aren't that useful.

6. Allow the user to navigate the current spread

    1. the user navigates a spread using the arrow buttons that appear when she hovers the title
    2. the app will scroll to and highlight the prev / next entry
    3. option checkbox "Display arrows", whose change is immediately reflected in the page

7. Allow to invert the spread, i.e. with the least hyped news on the leftmost positions

    1. option checkbox "Invert spread", whose change is immediately reflected in the page
