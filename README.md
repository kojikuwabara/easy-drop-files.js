# EasyDropFiles.js

EasyDropFiles is a JavaScript class for handling drag-and-drop file uploads with ease. It supports file reading, data conversion, and various event listeners to create a seamless user experience for handling files in web applications.

## Features

- Drag and drop file upload
- File reading and conversion to various formats (text, Blob, DataURL)
- Event listeners for drag, drop, and file input changes

## Installation

To use EasyDropFiles, simply include the `easydropfiles.js` file in your project:

```html
<script src="path/to/easydropfiles.js"></script>
```

## Usage
### Creating an Instance

```javascript
const easyDropFiles = new EasyDropFiles();
```

### Creating a Drop Area

```javascript
const dropAreaInfo = easyDropFiles.createDropArea('#parentElement');
```

### Adding Event Listeners

```javascript
//Screen drawing at dragging
easyDropFiles.addDragEventListener('#dropArea');

//File load on drop
easyDropFiles.addDropEventListener('#dropArea',  () => {
    console.log('Files loaded:', easyDropFiles.loadedFiles);
});

//Screen rendering on drag and file load on drop
easyDropFiles.addDragAndDropEventListener('#dropArea', '#inputElement', () => {
    console.log('Files loaded:', easyDropFiles.loadedFiles);
});

//Screen drawing when drag, file load when drop, output loaded data after drop
easyDropFiles.addDragAndDropHandler('#dropArea', '#outputElement', '#inputElement', 'text');

```

### Setting Loaded Data to an HTML Element

```javascript
easyDropFiles.setLoadedDataToElement('#outputElement', 'text');
```

## Methods
### Constructor
- constructor(): Initializes a new EasyDropFiles instance.

## File Loading and Conversion
- loadFiles(event): Loads files from a drag-and-drop or input change event.
- resetLoadedFiles(): Resets the loaded files.

## Event Listeners
- addDragEventListener(dropAreaSelector)
  : Adds drag event listeners to a drop area element.
- addDropEventListener(dropAreaSelector, callbackFunction, ...args)
  : Adds a drop event listener to a drop area element.
- addChangeEventListener(inputSelector, callbackFunction, ...args)
  : Adds a change event listener to a file input element.
- addDragAndDropEventListener(dropAreaSelector, inputSelector, callbackFunction, ...args)
  : Adds drag and drop event listeners to the specified drop area and input element.
- addDragAndDropHandler(dropAreaSelector, outputSelector, inputSelector, fileType, options)
  : Adds a drag and drop event handler to the specified drop area and sets the loaded data to the output element.

## Data Setting
- setLoadedDataToElement(outputSelector, fileType, options)
  : Sets the loaded data to the specified HTML element.

## Properties
### Getters
- loadedArrayBuffers: Returns the array buffers of the loaded files.
- loadedDataURLs: Returns the Data URLs of the loaded files.
- loadedTexts: Returns the text content of the loaded files.
- loadedJoinedText: Returns the joined text content of the loaded files.
- loadedFileCount: Returns the count of loaded files.
- dropAreaInfo: Returns information about the drop area.
- loadedFiles: Returns the loaded files.

### Setters
- separatorForJoin: Sets the separator for joining text.
- onDragoverCSS: Sets the CSS for the dragover event.
- dropAreaCSS: Sets the CSS for the drop area.

## License
This project is licensed under the [MIT License](https://github.com/kojikuwabara/easy-drop-files.js/blob/main/LICENSE). See the LICENSE file for details.

## Author
Koji Kuwabara - [GitHub](https://github.com/kojikuwabara)
