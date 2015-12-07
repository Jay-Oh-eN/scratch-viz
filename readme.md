## Scratch Viz

This experimental [ScratchX](http://scratchx.org/) extension aims to make data visualization more accessible to a wider audience.  More than that however, this extension is an exploration of proper abstractions for data visualization concepts in an effort to teach more effectively.

## Getting Started

See the [user documentation](http://jay-oh-en.github.io/scratch-viz/index.html) or head over to the wiki for the [developer documentation](https://github.com/Jay-Oh-eN/scratch-viz/wiki).

## Developers

From its inception, the Scratch Viz project has been designed to be modular to encourage contributions.  Since the data visualization primitives of the project are inherently composable they lend themselves well to extension.  And D3.js (the underlying library powering the Scratch Viz blocks) has often been analogized to data visualization building blocks (or LEGOs) due to the place it sits in the hierarchy of abstraction.

### Architecture

Scratch Viz is inspired by the principles of Wilkinson's [Grammar of Graphics](http://www.amazon.com/The-Grammar-Graphics-Statistics-Computing/dp/0387245448) and by making the distinction between the data layer and the aesthetic layer, visualizations are inherently modular and flexible. As such, there are only a few fundamental components necessary to understand the extension which can be composed to create more complex programs and visualizations:

* Data blocks
    * Loading (CSV, TSV, JSON)
    * Aggregation (count, sum, mean, etc.)
    * Filtering/Selection
* Visualization blocks (visual encodings)
    * Marks (circle, rectangle, line, etc.)
    * Channels (position, size, color, etc.)
    * Scales (linear, logarithmic, etc.)

This repository is structured to allow easy extension and contribution of new visual and data blocks.

    blocks/             Folder containing ScratchX block definitions
    docs/               Documentation
    examples/           Example Scratch projects (`.sbx` files)
    test/               Unit tests for the custom blocks
    index.js            ScratchX extension specification

### Contributing

To contribute a new block (new aggregation, data loading, channel, etc.):

1. [Fork](#) this repository.
2. Add an extension file to the `blocks/` directory
    * Look at the existing [template.js](#) file for a reference of the expected structure
3. Write a test file using [tape](https://github.com/substack/tape) in the `test/` directory.
4. Create a documentation file describing its intended use. Name it accordingly.
    * Use [scratchblocks](http://scratchblocks.github.io/) to create an example of how to use the block.
    * Create a example project and upload a [SBX]() file that uses your new block to the `examples/` directory.
6. Issue a [pull request]() an your block will be merged in.

#### Debugging

1. Build Javascript functions
2. Place `debugger;` in `draw()`
3. Inspect Vega object: `copy(viz)`
4. Run in [Vega editor](http://vega.github.io/vega-editor) to test correctness
5. Verify visualization makes it to pop-up window

__Notes: Cannot currently support spaces in headers or fields.  You must surround in quotes for this to work__

## Road Map

### 0.0.1

#### Objectives

* Develop block (user facing) API
* Create essential blocks to make basic charts
    * scatter
    * bar
* Implement library (developer facing) architecture
    * `window.open()`
    * `window.postMessage()`
    * Rendering/drawing handled by [Vega](vega.github.io)
        * Declarative in nature
        * Serializable as standard JSON (to send with `postMessage()`)
    * Internal `viz` object to keep state

#### Tasks

- [x] Marks
    - [x] circle
    - [x] rectangle
- [x] Scales
    - [x] logarithmic (log)
    - [x] ordinal
    - [x] time/dates (time)
    - [x] power/exponent (pow)
    - [x] square root (sqrt)
- [x] Channels
    - [x] x position
    - [x] y position
    - [x] size
    - [x] color

### 0.0.2

#### Objectives

* Create documentation and example to increase usability
* Encourage learning about science and math
    * Create educational materials specifically for kids + novices
    * Power of data visualization

#### Tasks

- [x] Marks
    - [x] line
    - [x] area
- [ ] Data
    - [ ] Integrate [Cloud Data](http://wiki.scratch.mit.edu/wiki/Cloud_Data) blocks
        - [ ] Create Surveys and visualize results
        - [ ] Encourage sharing of open data
- [ ] Add alerts when blocks are not combined right
    - [ ] Static analysis of Grammar
- [x] Write documentation
    - [ ] Basic Getting Started Tutorial
    - [x] Reference projects (`.sbx`) for each chart type
    - [ ] Bl.ocks.org reference of Vega output (with image of blocks to generate it)
    - [ ] Create Math curriculum
        - [ ] Make interactive version of Khan Academy videos
    - [ ] Create short screen cast
- [ ] Write tutorial on writing ScratchX extensions
    - [ ] ScratchX for Javascript developers
    - [ ] Javascript for Scratchers

### 0.1.0

#### Objectives

* Solidify standards for development
    * Debugging
    * Testing
    * Documentation
* Make extension modular to encourage sustainable development

#### Tasks

- [ ] Functionality to save Visualization as Gist
    - [ ] Vega export
    - [ ] Anonymous gist export
    - [ ] Block export (with [scratchblocks](http://scratchblocks.github.io/))
    - [ ] Vega server side render to SVG for thumbnail
    - [ ] Github Oath login
- [ ] Create test suite for each block
- [ ] Create range block to specify output range of block scale
- [ ] Automated CI integration with Travis
- [ ] Whitespace in input cells?
- [ ] Modularize block specifications with [rollup.js](http://rollupjs.org/)
- [ ] Verify syntax with JSlint
- [ ] Write a style guide

### 0.1.1

#### Objectives

* Expand functionality of extension to create more chart types
* Introduce interactivity to encourage narrative

#### Tasks

- [ ] Aggregation blocks
- [ ] Maps!
- [ ] arc/pie
- [ ] Interactive blocks
- [ ] Vega parity

### 0.1.2

#### Objectives

* Enhance the developer experience
    * Encourage more outside extension collaboration
* Enhance the social features to encourage Scratcher collaboration

#### Tasks

- [ ] Side by side editor (like Block Builder)
- [ ] Remixability (and lineage tracking)
- [ ] Anonymous analytics into how people are using the custom blocks
- [ ] Composability + Abstraction
    - [x] Allow users to use Scratch-Viz blocks in their own custom blocks. Open possibility for Scratchers (without using Javascript) to define their own charts.
- [ ] Integrate with [Mesh](http://wiki.scratch.mit.edu/wiki/Mesh)

## License

* Code: [MIT License](LICENSE)
* Content: <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Scratch Viz</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">Jonathan Dinu</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>
