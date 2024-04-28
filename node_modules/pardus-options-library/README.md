# Pardus-Options-Library
The Pardus Options Library is a script designed to add useful and easy ways to interact with the Options page within other scripts related to the online game Pardus (https://pardus.at). It is written entirely in ECMAScript 6.

## Installation
At the top of your Tampermonkey script, ensure you have the following lines:
```javascript
// @include     http*://*.pardus.at/options.php
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://raw.githubusercontent.com/Tro95/Pardus-Options-Library/v2.6.1/dist/pardus-options-library.js
```
The `GM_setValue` and `GM_getValue` methods are required to persistently store the user's settings.

### Multiple Scripts

This library is safe to be included by multiple scripts.

## Building the Library

If you wish to build the library from source, you can do this simply by running `npm run build`

## Usage

Within your script you should check `document.location.pathname` to see if you're on the `options.php` page, as the library is only defined and available on this page.
```javascript
if (document.location.pathname === '/options.php') {
    // Option-related logic goes here
}
```
The library is available through a static object `PardusOptions`. It is recommended to abstract your options logic into a separate function.

```javascript
function myOptionsLogic() {
    /**
     *  Create the tab for your script
     */
    const myScriptsTab = PardusOptions.addTab({
        heading: 'My Script',
        id: 'my-script'
    });

    /**
     *  Create a box for your options
     */
    const mainOptionsBox = myScriptsTab.addBox({
        heading: 'Main Options',
        description: 'These are the main options for my script'
    });

    /**
     *  Create a boolean option, and bind it to the universe-specific variable.
     */
    const mainOptionsBox.addBooleanOption({
        variable: 'enable_super_cool_feature',
        description: 'Enable the super cool feature',
        defaultValue: true
    });
}

if (document.location.pathname === '/options.php') {
    // Call the options logic
    myOptionsLogic();
}
```

## Reference

### PardusOptions Object
`PardusOptions`
#### Creation
This is a static object that you should not construct, and as such the constructor is not documented here. Including the library in your script will automatically initialise it on the relevant options page.
#### Methods

##### version
Returns the version of the library.
```javascript
PardusOptions.version();
```
##### addTab
Creates a new tab and returns an object allowing manipulation of the content of the tab. Recommended usage is one tab per script.
```javascript
PardusOptions.addTab({
    id,
    heading,
    saveFunction = PardusOptionsUtility.defaultSaveFunction,
    getFunction = PardusOptionsUtility.defaultGetFunction,
});
```
**id** [*Required*]: An identification string with no spaces that must be unique across all scripts using this library.  
**heading** [*Required*]: The heading of the tab. You should ensure this string is not too long to break the formatting.  
**saveFunction** [*Optional*]: A reference to a function that can save a persistent value for you. This is automatically set to the script's `GM_setValue` method.  
**getFunction** [*Optional*]: A reference to a function that can retrieve a persistent value for you. This is automatically set to the script's `GM_getValue` method.  

Returns an object of type OptionsContent, allowing manipulation of the content within the tab's content area.

Example:
```javascript
const myTab = PardusOptions.addTab({
    id: 'my-scripts-tab',
    heading: 'My Script',
    saveFunction: GM_setValue,
    getFunction: GM_getValue,
});
```

### Class OptionsContent
Represents all the content within a single tab, allowing for easy creation of OptionsBoxes.
#### Creation
You should use the `PardusOptions.addTab()` method to obtain an OptionsContent object, and as such the constructor is not documented here.
#### Methods

##### addBox
Creates a new box in the contents area of the tab, and returns an object allowing manipulation of the content of the box. Recommended usage is one box per group of related options. This box will be placed on either the left or right side of the screen depending on the length of all the other boxes. If you wish to control the placing, see `addBoxLeft` and `addBoxRight`.
```javascript
OptionsContent.addBox({
    heading,
    description = '',
    imageLeft = '',
    imageRight = '',
    premium = false,
    saveFunction = this.saveFunction,
    getFunction = this.getFunction,
});
```
**heading** [*Required*]: The heading of the box.  
**description** [*Optional*]: The description text for the box, to be displayed under the heading.  
**imageLeft** [*Optional*]: The src value of an image to appear to the left of the description.  
**imageRight** [*Optional*]: The src value of an image to appear to the right of the description.  
**premium** [*Optional*]: A boolean value on whether to style the box with the premium styling or not. Useful for separating options relating to features exclusive for premium members.   
**saveFunction** [*Optional*]: A reference to a function that can save a persistent value for you. Will inherit the save function of the tab.  
**getFunction** [*Optional*]: A reference to a function that can retrieve a persistent value for you. Will inherit the get function of the tab.  

Returns an object of type OptionsBox, allowing creation of options within the box.

Example:
```javascript
const myBox = myTab.addBox({
    heading: 'Main Options',
    description: 'These are the main options for my script.',
});
```

##### addBoxLeft
Creates a new box in the left column of the contents area of the tab, and returns an object allowing manipulation of the content of the box. Recommended usage is one box per group of related options. This box will be placed on the left side of the screen..
```javascript
OptionsContent.addBoxLeft({
    heading,
    description = '',
    imageLeft = '',
    imageRight = '',
    premium = false,
    saveFunction = this.saveFunction,
    getFunction = this.getFunction,
});
```
**heading** [*Required*]: The heading of the box.  
**description** [*Optional*]: The description text for the box, to be displayed under the heading.  
**imageLeft** [*Optional*]: The src value of an image to appear to the left of the description.  
**imageRight** [*Optional*]: The src value of an image to appear to the right of the description.  
**premium** [*Optional*]: A boolean value on whether to style the box with the premium styling or not. Useful for separating options relating to features exclusive for premium members.  
**saveFunction** [*Optional*]: A reference to a function that can save a persistent value for you. Will inherit the save function of the tab.  
**getFunction** [*Optional*]: A reference to a function that can retrieve a persistent value for you. Will inherit the get function of the tab.  

Returns an object of type OptionsBox, allowing creation of options within the box.

Example:
```javascript
const myBox = myTab.addBoxLeft({
    heading: 'Main Options',
    description: 'These are the main options for my script.',
});
```

##### addBoxRight
Creates a new box in the right column of the contents area of the tab, and returns an object allowing manipulation of the content of the box. Recommended usage is one box per group of related options. This box will be placed on the right side of the screen..
```javascript
OptionsContent.addBoxLeft({
    heading,
    description = '',
    imageLeft = '',
    imageRight = '',
    premium = false,
    saveFunction = this.saveFunction,
    getFunction = this.getFunction,
});
```
**heading** [*Required*]: The heading of the box.  
**description** [*Optional*]: The description text for the box, to be displayed under the heading.  
**imageLeft** [*Optional*]: The src value of an image to appear to the left of the description.  
**imageRight** [*Optional*]: The src value of an image to appear to the right of the description.  
**premium** [*Optional*]: A boolean value on whether to style the box with the premium styling or not. Useful for separating options relating to features exclusive for premium members.  
**saveFunction** [*Optional*]: A reference to a function that can save a persistent value for you. Will inherit the save function of the tab.  
**getFunction** [*Optional*]: A reference to a function that can retrieve a persistent value for you. Will inherit the get function of the tab.  

Returns an object of type OptionsBox, allowing creation of options within the box.

Example:
```javascript
const myBox = myTab.addBoxLeft({
    heading: 'Main Options',
    description: 'These are the main options for my script.',
});
```




### Class OptionsBox
Represents a box that contains options.
#### Creation
You should use the `OptionsContent.addBox()` method to obtain an OptionsBox object, and as such the constructor is not documented here.
#### Methods

##### addBooleanOption
Creates a checkbox within the options box, and binds its value to a variable that can be saved persistently using the `saveFunction`.
```javascript
OptionsBox.addBooleanOption({
    variable,
    description,
    defaultValue = false,
    customSaveFunction = this.saveFunction,
    customGetFunction = this.getFunction,
});
```
**variable** [*Required*]: The variable to bind the boolean value to. This will be translated into `${universe}-${variable}` when passed into the save function, to ensure uniqueness across all the universes.  
**description** [*Required*]: A small amount of text describing what the option is for.  
**defaultValue** [*Optional*]: The default value to set. It is recommended to always define a default value.  
**saveFunction** [*Optional*]: A reference to a function that can save a persistent value for you. Will inherit the save function of the OptionsContent.  
**getFunction** [*Optional*]: A reference to a function that can retrieve a persistent value for you. Will inherit the get function of the OptionsContent.  

Returns an object of type BooleanOption, although this isn't used for anything.

Example:
```javascript
myBox.addBooleanOption({
    variable: 'enable_super_cool_feature',
    description: 'Enable the super cool feature',
    defaultValue: true,
});
```


##### addNumericOption
Creates a numeric field within the options box, and binds its value to a variable that can be saved persistently using the `saveFunction`.
```javascript
OptionsBox.addNumericOption({
    variable,
    description,
    defaultValue = 0,
    min = 0,
    max = 0,
    step = 1,
    saveFunction = this.saveFunction,
    getFunction = this.getFunction,
});
```
**variable** [*Required*]: The variable to bind the boolean value to. This will be translated into `${universe}-${variable}` when passed into the save function, to ensure uniqueness across all the universes.  
**description** [*Required*]: A small amount of text describing what the option is for.  
**defaultValue** [*Optional*]: The default value to set. It is recommended to always define a default value.  
**min** [*Optional*]: The minimum value the field may have.  
**max** [*Optional*]: The maximum value the field may have.  
**step** [*Optional*]: The increments between values.  
**saveFunction** [*Optional*]: A reference to a function that can save a persistent value for you. Will inherit the save function of the OptionsContent.  
**getFunction** [*Optional*]: A reference to a function that can retrieve a persistent value for you. Will inherit the get function of the OptionsContent.  

Returns an object of type NumericOption, although this isn't used for anything.

Example:
```javascript
myBox.addNumericOption({
    variable: 'amount_of_power',
    description: 'Amount of power to use',
    defaultValue: 50,
    min: 1,
    max: 100,
});
```


##### addSelectOption
Creates a dropdown selection field within the options box, and binds its value to a variable that can be saved persistently using the `saveFunction`.
```javascript
OptionsBox.addSelectOption({
    variable,
    description,
    options = [],
    defaultValue = null,
    saveFunction = this.saveFunction,
    getFunction = this.getFunction,
});
```
**variable** [*Required*]: The variable to bind the boolean value to. This will be translated into `${universe}-${variable}` when passed into the save function, to ensure uniqueness across all the universes.  
**description** [*Required*]: A small amount of text describing what the option is for.  
**options** [*Optional*]: An array of dropdown options to give. The array must be in the format `[{value: 'value-to-save', text: 'value to display to the user'}, ...]`. Additionally, one element may contain a `default: true` field instead of passing in a default value.
**defaultValue** [*Optional*]: The default value to set. It is recommended to always define a default value. This should correspond to one of the `value` fields in the `options` parameter.  
**saveFunction** [*Optional*]: A reference to a function that can save a persistent value for you. Will inherit the save function of the OptionsContent.  
**getFunction** [*Optional*]: A reference to a function that can retrieve a persistent value for you. Will inherit the get function of the OptionsContent.  

Returns an object of type NumericOption, although this isn't used for anything.

Example:
```javascript
myBox.addSelectOption({
    variable: 'attack_style',
    description: 'Attack style to use',
    options: [
        {
            value: 'offensive',
            text: 'Offensive'
        },
        {
            value: 'balanced',
            text: 'Balanced',
            default: true
        },
        {
            value: 'defensive',
            text: 'Defensive'
        },
    ],
});
```

