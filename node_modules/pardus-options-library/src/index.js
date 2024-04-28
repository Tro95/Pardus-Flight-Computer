import PardusOptions from './classes/pardus-options.js';
import PardusOptionsUtility from './classes/pardus-options-utility.js';

/**
  *  Add the Options object to the page for all scripts to use
  */
if (document.location.pathname === '/options.php') {
    PardusOptions.init();
}

PardusOptionsUtility.addGlobalListeners();

export { PardusOptions, PardusOptionsUtility };
