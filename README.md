# Fullstack evaluation template

## How to use
The files included in this repository are here to get you started by giving
you an idea on how you might start the project.

To start the server open a terminal window on unix/linux based systems and change
directory to the project root. Then execute this command:

```
  ./server
```

The command assumes you have a PHP binary in your system path. If you don't you
will get an error and the server will not start.

After starting the server go to:

```
http://localhost:8765/index.html  
```

## Information
There are 2 ways to make an API call with this framework.
    1. When an element with an ID of "submit" is clicked.
    2. By adding onload="api.call()" to the body element.
        /reusability-examples/trivia.html.
