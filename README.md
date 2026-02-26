# NICAR Network

This project shows two [interactive visualizatiosns](https://nicar.network) of data from the past 11 years of NICAR (National Institute for Computer-Assisted Reporting) conference schedules.

It was developed for my NICAR 2026 Lightning Talk, forked from an excellent [sigma.js demo](https://github.com/jacomyal/sigma.js/tree/main/packages/demo). It's built using [Vite](https://vitejs.dev/), and uses [react-sigma](https://sim51.github.io/react-sigma/), to interface sigma.js with React.

You can view the live visualization [here](https://nicar.network). With GitHub pages configured, after making changes to the `main` branch, you need to run the command `npm run deploy` for the latest changes to be reflected in the live visualization.

I made changes to the sigma.js demo to make it a standalone website, including adding a navbar to toggle between the two network visualizations, and removing some unused features.

## Python Scripts

In the `scripts/` subdirectory, you can run Python scripts that were used to generate the network and visualization:

### `00__download_schedules.py`

Downloads all NICAR schedules between 2015 and 2026. I couldn't find the 2021 schedule online, so I asked the conference organizers, who kindly sent me a copy.

### `01__process_speakers.py`

Processes the speaker names and affiliations from different schedule formats into a standard form, performs data cleaning (consolidating speaker and outlet names), uses [NetworkX](https://networkx.org/en/) to convert the data into a graph, and exports the graph as a GraphML file.

### `02__process_descriptions.py`

Processes the session descriptions and titles from different schedule formats into a standard form, extracts named entities using [spaCy](https://spacy.io/usage/linguistic-features#named-entities), performs data cleaning (consolidating entities and ignoring certain categories), uses [NetworkX](https://networkx.org/en/) to convert the data into a graph, and exports the graph as a GraphML file.

### `03__visualize_speakers.py`

After visualising the network using [Gephi](https://gephi.org/) (using the Force Atlas 2 algorithm, with the "LinLog mode" and "Prevent Overlap" options enabled, and exporting as the file `graphml/speakers_layout.graphml`), this script converts the node, edge, and speaker outlet data into a format readable by the modified sigma.js demo.

### `04__visualize_descriptions.py`

After visualising the network using [Gephi](https://gephi.org/) (using the Force Atlas 2 algorithm, with the "LinLog mode" and "Prevent Overlap" options enabled, running a community detection algorithm to identify clusters, and exporting as the file `graphml/descriptions_layout.graphml`), this script converts the node, edge, and cluster data into a format readable by the modified sigma.js demo.

## NPM Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
