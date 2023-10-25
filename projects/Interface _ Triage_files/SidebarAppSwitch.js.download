

function settingConnexHub() {

    // connex hub
    var hubRoot = document.getElementById('app-hub');

    // connex overlay
    var hubOverlay = document.getElementById('app-hub-overlay');

    // trigger element
    var toAppSwitcher = document.getElementById('to-app-switcher');

    // target element
    var appSwitcher = document.getElementById('app-switcher');

    // Toggle class function
    function toggleClass(element, className) {
        if (!element || !className) {
            return;
        }
        var classString = element.className, nameIndex = classString.indexOf(className);
        if (nameIndex == -1) {
            classString += ' ' + className;
        }
        else {
            classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
        }
        element.className = classString;
    }

    hubRoot.addEventListener('click', function (e) {
        if (appSwitcher.contains(e.target)) {
            // Clicked in appSwitcher
        } else {
            console.log('outside');
            hubRoot.classList.remove('active');
            appSwitcher.classList.remove('active');
            hubOverlay.classList.add('transparent');
        }
    });

    // Toggles active class
    toAppSwitcher.onclick = function () {
        console.log('toAppSwitcher');
        toggleClass(appSwitcher, 'active');
        toggleClass(hubRoot, 'active');
        toggleClass(hubOverlay, 'transparent');
    };

};

