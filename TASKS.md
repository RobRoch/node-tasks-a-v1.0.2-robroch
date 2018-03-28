Programming Tasks
=
Programming Tasks for Node - Tasks A.
See: [README](README.md).

Introduction
-
You will create a simple HTTP server in Node.js.
You can use any framework of your choice or no framework at all if you prefer.

You can use any module from npm that can help you with the tasks.
Please list the modules you used in [USER](USER.md)
and explain very briefly why do you think it's a good choice.

Please code in a style that is most readable and maintainable in your opinion.
You can use all new features of Node that work without transpilation
in Node v8.x, excluding those that require the `--harmony` flag.
The code doesn't have to work on any earlier version of Node.

Dependencies:

The `node_modules` directory should not be included in the tarball.
All the dependencies should be installed with `npm install`.

Running the program:

The program should be started with `npm start` and should run in the foreground.
It must be terminated with Ctrl-C.

Requirements:

* Compatible with Node v8.x
* No need for `--harmony` flag
* No transpilation steps
* No external services
* No bundled dependencies

Tasks
-
Completing the tasks will result in a single application.
Every new task adds a simple functionality.

For every task you can use any framework or module
that you want or you can use no framework or module at all.
Please do what you think is the most reasonable choice.

Remember about the correct response codes and content types.

### Create an application
Create an application that can be started with
`npm start` and stopped with Ctrl-C.
It should listen on port 3456 for HTTP requests.

### Configurable port
Program should listen on a port read during startup from
file `data/port.txt` and default to 3456
if no port can be read from that file.

### GET /test
Add `GET /test` endpoint that returns JSON data:
```js
{"test": {"ok": true}}
```
Input: none. Output: JSON.

### GET /file-a endpoint
Add `GET /file-a` endpoint that returns the contents of
`data/files/file-a.txt` that is read from the disk into memory
once on the server startup.

Input: none. Output: plain text.

### GET /json-a endpoint
Add `GET /json-a` endpoint that returns the `data` field of
`data/files/json-a.json` that is read once on the server startup.

Input: none. Output: JSON.

### GET /file-b endpoint
Add `GET /file-b` endpoint that returns the contents of
`data/files/file-b.txt` that is read from the disk into memory
on every request and then served from memory.

Input: none. Output: plain text.

### GET /json-b endpoint
Add `GET /json-b` endpoint that returns the `data` field of
`data/files/json-b.json` that is read from the disk
on every request and then served from memory.

Input: none. Output: JSON.

### GET /file endpoint
Add `GET /file` endpoint that returns the contents
of a text file from `data/files` directory
with a file name read from the `name` query parameter.

Input: `name` (query). Output: plain text.

### GET /size endpoint
Add `GET /size` endpoint that returns the size in bytes
of a file from `data/files` directory
with a file name read from the `name` query parameter.

The output is in the form of `{"size": 123}`

Input: `name` (query). Output: JSON.

### GET /filenames endpoint
Add `GET /filenames` endpoint that returns a list of file names
from `data/files` as JSON in this form:
```js
[{"name": "file1.txt"}, {"name": "file2.txt"}]
```

Input: none. Output: JSON.

### GET /sizes endpoint
Add `GET /sizes` endpoint that makes an HTTP request
to the `GET /filenames` endpoint and for every file name returned
makes an HTTP request to `GET /size` endpoint to get its size.

It should return a response in this format:
```js
[{"name": "file1.txt", "size": 123},
{"name": "file2.txt", "size": 456}]
```

Input: none. Output: JSON.

### GET /txt
Add `GET /txt` endpoint that returns the current contents of
all of the `*.txt` files in `data/files` concatenated as plain text.

Input: none. Output: plain text.

### GET /strings
Add `GET /strings` endpoint that reads the value of `X-JSON-Data` header,
parses the JSON and gets a `param` field from that object.
Then, on every request, it starts the program
`data/scripts/strings.js` as a child process
with a single parameter `param` taken from the parsed JSON
and sends its output as an HTTP response.

An example input header: `X-JSON-Data: {"param": "abc"}`
should start `data/scripts/strings.js abc`.

Input: X-JSON-Data (header). Output: plain text.

### PUT /data/{id}
Add `PUT /data/{id}` endpoint that remembers in memory
the object passed as JSON in the request body.
It should return JSON response of `{"ok": true}` on success
or `{"error": true}` on error.
The data is not persistent between server restarts.

Input: JSON (body). Output: JSON.

### GET /data/{id}
Add `GET /data/{id}` endpoint that serves from memory
the object remembered in the past `PUT /data/{id}` requests.
It should return JSON response of the saved object on success
or `{"error": true}` on error.

Input: id (path parameter). Output: JSON.

### DELETE /data/{id}
Add `DELETE /data/{id}` endpoint that removes from memory the object
remembered in the past `PUT /data/{id}` requests.
It should return JSON response of `{"ok": true}` on success
or `{"error": true}` on error.

Input: id (path parameter). Output: JSON.

### GET /linked/callback

Files in `data/linked` are structured like this:

* `names` directory has files named `NAME.txt` that contain numbers.
* `values` directory has files named `NUMBER.txt` that contain values.

Add `GET /linked/callback` endpoint
that reads the list of files in `data/linked/names` directory
and for every file (e.g. for `a.txt`)
it reads the number it contains (e.g. `1`)
and reads the file for that number in `data/linked/values` directory
(e.g. `1.txt`).

Return an array of objects that contain `name`, `id` and `value`
where `name` is the file name from `data/linked/names`
with no `.txt` suffix, `id` is the number and `value` is the content
of file from `data/linked/values` with no newline characters.

Use only node-style callbacks for all asynchronous operations
with no promises and no `await` expressions.

Example output:

```js
[{"name": "a", "id": 1, "value": "Value A"}, ...]
```

Input: none. Output: JSON.

### GET /linked/promise
Add `GET /linked/promise` endpoint
that has the same output as `GET /linked/callback`
but uses promises instead of callbacks
for all file I/O and all helper functions.

Input: none. Output: JSON.

### GET /linked/await
Add `GET /linked/await` endpoint
that has the same output as `GET /linked/callback`
but uses `async function` syntax with `await` expressions
and no explicit continuation-passing style callbacks.

Input: none. Output: JSON.

### Tests
Add tests for the `/data/{id}` endpoints
using a test framework of your choice.
Choose the kind of tests that are most reasonable in your opinion.
The tests should be run with `npm test` command.

