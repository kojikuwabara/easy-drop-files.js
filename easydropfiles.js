////////////////////////////////////////////////////////////////////////////////////////////////////
// EasyDropFiles.js
////////////////////////////////////////////////////////////////////////////////////////////////////
/*!
 * @classdesc Class representing a Drag and Drop utility.
 *
 * @author    Koji Kuwabara (https://github.com/kojikuwabara/easy-drop-files.js)
 * @copyright 2024 Koji Kuwabara
 * @version   v1.0.0
 * @licence   Licensed under MIT (https://opensource.org/licenses/MIT)
 */
////////////////////////////////////////////////////////////////////////////////////////////////////
// Overview
////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  constructor:
 *  Property:
 *    - loadedFiles        #getter
 *    - loadedArrayBuffers #getter
 *    - loadedDataURLs     #getter
 *    - loadedTexts        #getter
 *    - loadedJoinedText   #getter
 *    - loadedFileCount    #getter
 *    - dropAreaInfo       #getter
 *    - separatorForJoin   #setter
 *    - onDragoverCSS      #setter
 *    - dropAreaCSS        #setter
 *  Method:
 *    - toText
 *    - toBlob
 *    - toDataURL
 *    - addCssForDrag
 *    - loadFiles
 *    - resetLoadedFiles
 *    - createDropArea
 *    - addDragEventListener
 *    - addDropEventListener
 *    - addChangeEventListener
 *    - addDragAndDropEventListener
 *    - setLoadedDataToElements
 *    - addDragAndDropHandler
 */
class EasyDropFiles { 
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private properties
	////////////////////////////////////////////////////////////////////////////////////////////////////
	#loadedFiles      = [];
	#separatorForJoin = "\n";
	#uploadIcon       = `%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2296%22%20height%3D%2296%22%20fill%3D%22%23696969%22%20class%3D%22bi%20bi-cloud-upload%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M4.406%201.342A5.53%205.53%200%200%201%208%200c2.69%200%204.923%202%205.166%204.579C14.758%204.804%2016%206.137%2016%207.773%2016%209.569%2014.502%2011%2012.687%2011H10a.5.5%200%200%201%200-1h2.688C13.979%2010%2015%208.988%2015%207.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188%202.825%2010.328%201%208%201a4.53%204.53%200%200%200-2.941%201.1c-.757.652-1.153%201.438-1.153%202.055v.448l-.445.049C2.064%204.805%201%205.952%201%207.318%201%208.785%202.23%2010%203.781%2010H6a.5.5%200%200%201%200%201H3.781C1.708%2011%200%209.366%200%207.318c0-1.763%201.266-3.223%202.942-3.593.143-.863.698-1.723%201.464-2.383z%22%2F%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M7.646%204.146a.5.5%200%200%201%20.708%200l3%203a.5.5%200%200%201-.708.708L8.5%205.707V14.5a.5.5%200%200%201-1%200V5.707L5.354%207.854a.5.5%200%201%201-.708-.708l3-3z%22%2F%3E%3C%2Fsvg%3E`;
	#onDragoverCSS    = `
		/* Added by EasyDropFiles.js */
		.ondragover {
			background-color    : #A9A9A9; 
			background-image    : url('data:image/svg+xml;utf8,${this.#uploadIcon}');
			background-repeat   : no-repeat;
			background-size     : auto;
			background-position : center center;
			padding             : 10% 20%;
			z-index             : 1;
		}
	`;
	#dropAreaInfo = {};
	#dropAreaCSS = `
		/* Added by EasyDropFiles.js */
		.drop-area {
			border     : 2px dashed #99999980;
			padding    : 20px;
			text-align : center;
			transition : background-color 0.3s; 
		}
	`;

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// constructor
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Constructs a new EasyDropFiles instance.
	 * @constructor
	 */
	constructor() {
		this.addCssForDrag();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// getter / setter
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * getter and setter for the DragAndDrop class.
	 */
	get loadedFiles() {
		return this.#loadedFiles;
	}
	get loadedArrayBuffers() {
		return this.#loadedFiles.map( file => file.arrayBuffer);
	}
	get loadedBlobs() {
		return this.#loadedFiles.map( file => file.getBlob());
	}
	get loadedDataURLs() {
		return this.#loadedFiles.map( file => file.getDataURL());
	}
	get loadedTexts() {
		return this.#loadedFiles.map( file => file.getText());
	}
	get loadedJoinedText() {
		return this.loadedTexts.join(this.#separatorForJoin);
	}
	get loadedFileCount() {
		return this.#loadedFiles.length;
	}
	get dropAreaInfo() {
		return this.#dropAreaInfo;
	}
	set separatorForJoin(newValue) {
		this.#separatorForJoin = newValue;
	}
	set onDragoverCSS(newValue) {
		this.#onDragoverCSS = newValue;
	}
	set dropAreaCSS(newValue) {
		this.#dropAreaCSS = newValue;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Conversion functions
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Converts an array buffer to text.
	 * @param   {ArrayBuffer} arrayBuffer - The array buffer to convert.
	 * @returns {string}      The converted text.
	 */
	toText(arrayBuffer) {
		return (new TextDecoder('utf-8')).decode(arrayBuffer);
	}

	/**
	 * Converts an array buffer to a Blob.
	 * @param   {ArrayBuffer} arrayBuffer - The array buffer to convert.
	 * @param   {string}      mimeType    - The MIME type of the data.
	 * @returns {string}      The converted Blob.
	 */
	toBlob(arrayBuffer, mimeType) {
		return new Blob([arrayBuffer], { type: mimeType });
	}

	/**
	 * Converts an array buffer to a data URL.
	 * @param   {ArrayBuffer} arrayBuffer - The array buffer to convert.
	 * @param   {string}      mimeType    - The MIME type of the data.
	 * @returns {string}      The converted data URL.
	 */
	toDataURL(arrayBuffer, mimeType) {
		const blob = new Blob([arrayBuffer], { type: mimeType });
		return URL.createObjectURL(blob);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// addCssForDrag
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Adds CSS styles for the dragover event to create visual feedback for the drop area.
	 */
	addCssForDrag() {
		try {
			//Existing Check
			let isIncluded = false;
			document.querySelectorAll('style').forEach( element => isIncluded = isIncluded || element.innerText.includes('.ondragover') );

			// Add CSS for dragover event
			if ( !isIncluded ) {
				const styleElement = document.createElement('style');
				styleElement.textContent = this.#onDragoverCSS;
				const headElement = document.head || document.getElementsByTagName('head')[0];
				headElement.appendChild(styleElement);
			}

		} catch(error) {
			console.error(error);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// loadFiles
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Asynchronously loads files from a drag-and-drop event or file input change event.
	 * @param   {Event} event  - The event object representing the drag-and-drop or file input change event.
	 * @returns {Promise<Array>} A promise that resolves with an array of objects representing the loaded files.
	 */
	async loadFiles(event) {
		try {
			// File load processing
			const loadFile = file => {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = event => {
						const item = {
							 "name"         : file.name
							,"size"         : file.size
							,"type"         : file.type
							,"lastModified" : file.lastModified
							,"arrayBuffer"  : event.target.result
							,"getText"      : () => this.toText(event.target.result)
							,"getBlob"      : () => this.toBlob(event.target.result, file.type)
							,"getDataURL"   : () => this.toDataURL(event.target.result, file.type)
						};
						this.#loadedFiles.push(item);
						resolve(true);
					};
					reader.onerror = error => {
						reject(error);
					};
					reader.readAsArrayBuffer(file);
				});
			};

			// Check event and get target files
			const eventObject = event.dataTransfer ?? event.target;
			const files       = eventObject ? eventObject.files : "";

			// Load files
			this.#loadedFiles = [];
			for (const file of files) {
				await loadFile(file);
			}
			return this.#loadedFiles;
		} catch(error) {
			console.error(error);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// resetLoadedFiles
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * delete loaded files.
	 */
	resetLoadedFiles() {
		this.#loadedFiles = [];
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// createDropArea
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Creates a drag and drop area within the specified parent element.
	 *
	 * @param {string} parentSelector              - The CSS selector for the parent element where the drop area will be added.
	 * @param {string} [accept=""]                 - The accepted file types for the file input element (e.g., ".jpg, .png, .pdf").
	 * @param {string} [position="beforeend"]      - The position relative to the parent element where the drop area will be inserted.
	 * @param {string} [dropAreaId="dropAreaId"]   - The ID for the drop area element.
	 * @param {string} [inputId="dropAreaInputId"] - The ID for the hidden file input element.
	 * @returns {Object|boolean} - Returns an object containing the drop area and input element information, or false if the parent element is not found.
	 */
	createDropArea(parentSelector, accept="", position="beforeend", dropAreaId= "dropAreaId", inputId="dropAreaInputId") {
		try {
			//Drop area tags
			const DROPAREA_TAGS = `
				<!-- Added by EasyDropFiles.js -->
				<div class="drop-area" id="${dropAreaId}">
					<span>Drag and drop files here, or click to select files.</span>
					<input type="file" id="${inputId}" accept="${accept}" style="display: none;" multiple>
				</div>
			`;

			// Add DropArea Tags
			const element = parentSelector && document.querySelector(parentSelector);
			if (element) {
				element.insertAdjacentHTML(position, DROPAREA_TAGS);
			} else {
				console.log('createDropArea: parentSelector is invalid argument.');
				return false;
			}

			// Add CSS for DropArea Tags
			const styleElement       = document.createElement('style');
			styleElement.textContent = this.#dropAreaCSS;
			const headElement        = document.head || document.getElementsByTagName('head')[0];
			headElement.appendChild(styleElement);

			const dropAreaElement = document.getElementById(dropAreaId);
			const inputElement    = document.getElementById(inputId);

			// on click, undo droparea background color and read file
			dropAreaElement.addEventListener('click', () => inputElement.click());

			// Return created drop area ID
			this.#dropAreaInfo[parentSelector] = {
				  "dropAreaId"       : dropAreaId
				, "inputId"          : inputId
				, "dropAreaSelector" : "#" + dropAreaId
				, "inputSelector"    : "#" + inputId
			};
			return this.#dropAreaInfo[parentSelector];

		} catch(error) {
			console.error(error);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// addDragEventListener
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Adds drag event listeners to a drop area element.
	 * @param {string} dropAreaSelector - The CSS selector of the drop area element where the listeners will be added.
	 */
	addDragEventListener(dropAreaSelector) {
		try {
			const dropAreaElement = dropAreaSelector && document.querySelector(dropAreaSelector);
			if (dropAreaElement) {
				// on dragover, change droparea background color
				dropAreaElement.addEventListener('dragover', event => {
					event.preventDefault();
					dropAreaElement.classList.add('ondragover'); 
				});

				// on dragleave, undo droparea background color
				dropAreaElement.addEventListener('dragleave', event => {
					event.preventDefault();
					dropAreaElement.classList.remove('ondragover');
				});
			}

		} catch(error) {
			console.error(error);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// addDropEventListener
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Adds a drop event listener to a drop area element.
	 * @param {string}   dropAreaSelector - The CSS Selector of the drop area element where the listener will be added.
	 * @param {Function} callbackFunction - The function to be executed when the drop event occurs.
	 * @param {...any}   args             - Additional arguments to be passed to the callback function.
	 */
	addDropEventListener(dropAreaSelector, callbackFunction, ...args) {
		try {
			// Load the dropped file and executes the callback function afterwards.
			const dropAreaElement = dropAreaSelector && document.querySelector(dropAreaSelector);
			if (dropAreaElement) {
				dropAreaElement.addEventListener('drop', async (event) => {
					event.preventDefault();
					dropAreaElement.classList.remove('ondragover');
					await this.loadFiles(event);
					const postProcessing = callbackFunction ? callbackFunction : () => {};
					await postProcessing.call(this, event, ...args);
				});
			} else {
				console.log('addDropEventListener: dropAreaSelector is invalid argument.');
			}

		} catch(error) {
			console.error(error);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// addChangeEventListener
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Adds a change event listener to a file input element.
	 * @param {string}   inputSelector    - The CSS Selector of the file input element where the listener will be added.
	 * @param {Function} callbackFunction - The function to be executed when the change event occurs.
	 * @param {...any}   args             - Additional arguments to be passed to the callback function.
	 */
	addChangeEventListener(inputSelector, callbackFunction, ...args) {
		try {
			// Load the selected files in the FileDialog and executes the callback function afterwards.
			const inputElement = inputSelector && document.querySelector(inputSelector);
			if (inputElement) {
				inputElement.addEventListener('change', async (event) => {
					await this.loadFiles(event);
					const postProcessing = callbackFunction ? callbackFunction : () => {};
					await postProcessing.call(this, event, ...args);
				});
			} else {
				console.log('addChangeEventListener: inputSelector is invalid argument.');
			}

		} catch(error) {
			console.error(error);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// addDragAndDropEventListener
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Adds drag and drop event listeners to the specified drop area and input element.
	 *
	 * @param {string}   dropAreaSelector - The CSS selector for the drop area element.
	 * @param {string}   inputSelector    - The CSS selector for the input element.
	 * @param {Function} callbackFunction - The callback function to be executed when files are selected.
	 * @param {...any}   args             - Additional arguments to be passed to the callback function.
	 */
	addDragAndDropEventListener(dropAreaSelector, inputSelector, callbackFunction, ...args) {
		try {
			//Add DragEventListener
			this.addDragEventListener(dropAreaSelector);

			// Add DropEventListener
			this.addDropEventListener(dropAreaSelector, callbackFunction, ...args);

			// Add ChangeEventListener
			this.addChangeEventListener(inputSelector, callbackFunction, ...args);

		} catch(error) {
			console.error(error);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// setLoadedDataToElement
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Sets the loaded data to the specified HTML element based on the file type and provided options.
	 *
	 * @param {string} outputSelector - The CSS selector or ID for the output element.
	 * @param {string} fileType       - The type of file to determine how to set the data (e.g., "text", "image", "audio", "video", "pdf").
	 * @param {Object} [options]      - Optional parameters to customize data setting.
	 * @param {string} [options.dataType="joinedText"] - The type of loaded data to use (e.g., "text", "blob", "dataURL", "joinedText", "arrayBuffer").
	 * @param {string} [options.property="value"]      - The property of the output element to set (e.g., "value", "src").
	 * @param {number|string} [options.index="0"]      - The index of the data array to use.
	 */
	setLoadedDataToElement(outputSelector, fileType, options) {
		try {
			//Get parameters for output
			const fileTypes = {
				 "text"  : {"dataType":"joinedText", "property":"value", "index":"0"}
				,"image" : {"dataType":"dataURL"   , "property":"src"  , "index":"0"}
				,"audio" : {"dataType":"dataURL"   , "property":"src"  , "index":"0"}
				,"video" : {"dataType":"dataURL"   , "property":"src"  , "index":"0"}
				,"pdf"   : {"dataType":"dataURL"   , "property":"src"  , "index":"0"}
			};
			const loadedData = {
				 "text"        : this.loadedTexts
				,"blob"        : this.loadedBlobs
				,"dataURL"     : this.loadedDataURLs
				,"joinedText"  : [this.loadedJoinedText]
				,"arrayBuffer" : this.loadedArrayBuffers
			};
			const { dataType, property, index } = {
				  ...{"dataType":"joinedText", "property":"value", "index":"0"}
				, ...fileTypes[fileType]
				, ...options
			};

			//Set loaded value to output element
			const outputElement = document.querySelector(outputSelector);
			outputElement[property] = loadedData[dataType][index];

		} catch(error) {
			console.error(error);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// addDragAndDropHandler
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Adds a drag and drop event handler to the specified drop area and sets the loaded data to the output element.
	 *
	 * @param {string} dropAreaSelector   - The CSS selector for the drop area element.
	 * @param {string} outputSelector     - The CSS selector for the output element.
	 * @param {string} [inputSelector=""] - The CSS selector for the input element (optional).
	 * @param {string} [fileType="text"]  - The type of file to determine how to set the data (e.g., "text", "image", "audio", "video", "pdf").
	 * @param {Object} [options] - Optional parameters to customize data setting.
	 * @param {string} [options.dataType="joinedText"] - The type of loaded data to use (e.g., "text", "blob", "dataURL", "joinedText", "arrayBuffer").
	 * @param {string} [options.property="value"]      - The property of the output element to set (e.g., "value", "src").
	 * @param {number|string} [options.index="0"]      - The index of the data array to use.
	 */
	addDragAndDropHandler(dropAreaSelector, outputSelector, inputSelector="", fileType="text", options) {
		try {
			const callbackFunction = ()=> this.setLoadedDataToElement(outputSelector, fileType, options);
			this.addDragAndDropEventListener(dropAreaSelector, inputSelector, callbackFunction);
		} catch(error) {
			console.error(error);
		}
	}
};

