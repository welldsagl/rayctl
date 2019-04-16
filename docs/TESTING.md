# Testing

This library implements unit and functional tests with 
[Mocha](https://mochajs.org/), and [Chai](https://www.chaijs.com/) for the
assertions.

In particular, Mocha is extended by [@oclif/test](https://github.com/oclif/test)
which implements in turn [fancy-test](https://github.com/jdxcode/fancy-test).

All the tests can be found in the `test/` directory, which replicates the 
structure of the `src/` directory.

Tests can be launched manually by the `test` script defined in the
`package.json`. They will also be triggered automatically by a hook defined in
[husky](https://github.com/typicode/husky) when a `git commit` is executed. 

## Writing a test
To write a new test for the `<name>` file, a `<name>.test.js` file  should be 
added to the corresponding directory as defined above.

The methodology used to test can be followed by taking example from the existing
ones.

Especially, a `helper.js` module, exports some tools which are helpful to
create tests:

* `tempDir`: a variable containing the path to a temporary directory. It will be 
used by default from `clean`, `createDir` and `run` as the root path.

* `createDir`: a function to create an empty `rayctl` folder in which the 
`rayctl` commands can be executed.
It takes an optional argument `option`.
By default it uses `tempDir` as root path, otherwise a `dir` can be specified 
in the `options`.

* `clean`: a function to delete the `rayctl` folder.
It takes an optional argument `option`.
By default it uses `tempDir` as root path, otherwise a `dir` can be specified 
in the `options`.

* `run`: executes a `rayctl` command and returns an object containing  the shell 
output obtained, from which the `stdout` and `stderr` can be accessed. 
The first argument `command` is mandatory and accepts a string containing the 
command `rayctl` will execute. All the CLI `args` and `flags` should be included in
this string. A second optional argument is `option`.
The available options are: 
  - `before`: a string containing a shell command to be executed before the 
  `rayctl` command
  - `after`: a string containing a shell command to be executed before the
   `rayctl` command
  - `silent`: a boolean to skip the return of the shell output. By default it is
  false
  - `dir`: the directory in which the command should be executed. By default it 
  uses `tempDir`
    





