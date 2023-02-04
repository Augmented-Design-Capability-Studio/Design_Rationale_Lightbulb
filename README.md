# Design Rationale Lightbulb

This is a Figma plugin/widget that helps designers capture design rationale.

## Development guide

This plugin/widget is built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/).\*

### Pre-requisites

- [Node.js](https://nodejs.org) – v16
- [Figma desktop app](https://figma.com/downloads/)

### Installation guide

- Go to `widget/` folder by `cd widget` and install the widget following the install guide in `README.md`. This will run a widget that appears as a lightbulb and allows people record design rationale with it.

- Go to `plugin/` folder by `cd plugin` and install the plugin following the install guide in `README.md`. This will run a plugin Lightbulb Switch that create a new lightbulb widget.

## Installation guide for non-engineers

You will need an IDE to build this plugin/widget. We recommend using [Visual Studio Code](https://visualstudio.microsoft.com/#vscode-section) if you don't know which one to choose.

1. Click the green "<> Code" button to open a dropdown menu. Choose "Download ZIP" and save it to a location of your choice.

2. Unzip the file and open the folder in your IDE.

### Building it

3. Open the terminal in your IDE, type `cd widget` or `cd plugin` and press enter. [Opening terminal in VS Code](https://code.visualstudio.com/docs/terminal/basics)

4. You should see `[~/.../Design_Rationale_Lightbulb/widget] (main) $ ` (or `[~/.../plugin]`) . Now type `npm install` and press enter.

5. The terminal will run for a bit, installing necessary packages. Wait for it to finish.

6. Type `npm run build` and press enter. This will create a `/build` folder under `/widget` (or `/plugin`).

## Installing it on Figma Desktop

7. Go to Figma Desktop and open a file. In the toolbar, select Widgets > Development > Import widget from Manifest... . (Select Plugins > Development > Import plugin from Manifest... when installing the plugin.)

8. Select `manifest.json` in `Design_Rationale_Lightbulb/widget` or `Design_Rationale_Lightbulb/plugin`.

9. Voila! You have successfully installed the widget or the plugin. To install another one, follow the same steps from step 3.

## Tutorial

### Using it in FigJam

1. Go to a location of your choice on the canvas and right-click. Select Widgets > Development > (Choose the option with no name.)

2. The lightbulb widget will appear on the canvas!

3. Click on the `+` sign to open up input forms. To open or close the lightbulb pane, click the lightbulb itself.

### Using it in Figma

1. Create a lightbulb with the widget first. Go to a location of your choice on the canvas and right-click. Select Widgets > Development > (Choose the option with no name.)

2. A lightbulb widget will appear on the canvas. Move it to a location on the canvas that is unused. Hide and lock the widget.

3. Select a frame that you want to attach the lightbulb to. Run the plugin by going to Plugins > Development > Lightbulb Switch.

4. The plugin will make a copy of the lightbulb widget and attach it to the upper right corner of the frame.