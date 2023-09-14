/*
 * FILE:   MyLinks.js
 * AUTHOR: Christoph Gebauer
 * DATE:   14.09.2023
 */

/*
 * Verweisbaum JavaScript initialization
 */
function MyLinksInit( defaultTarget ) {
  /*
   * complete setup for all ul elements
   */
  var headers = document.getElementsByTagName( "ul" );

  var i = 0;

  while( i < headers.length ) {
    /*
     * div
     *
     * do this before (!) the span tag addition
     */
    // create wrapper container
    var div = document.createElement( 'div' );

    div.className = "nested";

    var first = headers[i].firstElementChild;
    // alert( "*** first " + first );

    // insert div before first child in the DOM tree
    first.parentNode.insertBefore( div, first );
  
    var children = headers[i].childNodes;

    var j;
  
    for( j=0; j<children.length; ++j ) {
      // move all children into div wrapper
      div.appendChild( children[j] );
    }


    /*
     * span
     */
    // alert( "*** loop " + i );

    var title = headers[i].title;

    // alert( "*** title " + title );

    // var first = headers[i].firstElementChild;
    // alert( "*** first " + first );

    var t = document.createElement( "span" );

    t.className = "caret";
  
    // both innerHTML and textContent will work
    // t.textContent = title;
    t.innerHTML = title;

    t.addEventListener( "click", function() {
      this.parentElement.querySelector( ".nested" ).classList.toggle( "active" );
      this.classList.toggle( "caret-down" );
    } );
  
    headers[i].prepend( t );


    /*
     * check for custom attribute (data-)initiallyOpen
     */
    var initiallyOpen = headers[i].getAttribute( "data-initiallyOpen" );

    // use != undefined instead of !== undefined here (or use initiallyOpen !== null)
    if( initiallyOpen !== null && (initiallyOpen == "1" || initiallyOpen.toLowerCase() == "true") ) {
      t.click();
    }


    /*
     * increment loop counter
     */
    i++;
  }

  /*
   * use target="_blank" as default for all a elements (if not otherwise specified)
   */
  // alert( "*** Number of arguments: " + arguments.length );

  if( defaultTarget === undefined ) {
    defaultTarget = '_blank';
  } else {
    switch( defaultTarget ) {
      case '_blank':
      case '_self':
      case '_parent':
      case '_top':
        break;

      default:
        defaultTarget = '_blank';
        break;
    } 
  }
  
  var anchors = document.getElementsByTagName( 'a' );

  // alert( "*** found " + anchors.length + " anchors" );

  i = 0;

  while( i < anchors.length ) {
    // alert( "*** anchor = " + anchors[i] );
    
    /*
     * customize target value
     *
     * (possible values are _blank _self _parent _top <frame name>
     */
    if( ! anchors[i].hasAttribute( 'target' ) ) {
      anchors[i].setAttribute( 'target', defaultTarget );
    }
      
    /*
     * increment loop counter
     */
    i++;
  }
}


/*
 * JavaScript support for Show All / Hide All buttons
 */
function showAll() {
  // alert( "*** showAll()" );
  
  // var allDivs = document.getElementsByTagName( "div" );
  var allDivs = document.querySelectorAll( 'div.nested' ); // returns an array of all div elements with class nested

  // alert( "*** Number of div elements = " + allDivs.length );

  var i;
  
  for( i=0; i<allDivs.length; ++i ) {
    if( !allDivs[i].classList.contains( "active" ) ) {
      allDivs[i].parentNode.firstChild.click();
    }
  }

  // for use in forms
  return true;
}


function hideAll() {
  // alert( "*** hideAll()" );
  
  // var allDivs = document.getElementsByTagName( "div" );
  var allDivs = document.querySelectorAll( 'div.nested' ); // returns an array of all div elements with class nested

  // alert( "*** Number of div elements = " + allDivs.length );

  var i;
  
  for( i=0; i<allDivs.length; ++i ) {
    if( allDivs[i].classList.contains( "active" ) ) {
      allDivs[i].parentNode.firstChild.click();
    }
  }

  // for use in forms
  return true;
}


/*
 * Stichwortverzeichnis table style JavaScript support
 */
function zeigeStichwoerter( kategorie, abschnitt ) {
  // alert( "*** zeigeStichwoerter( " + kategorie + ", " + abschnitt + " )" );

  if( abschnitt == "A-Z" ) {
    /*
     * zeigeStichwoerter( kategorie, "A" );
     * ...
     * zeigeStichwoerter( kategorie, "Z" );
     */
    for( var i=0; i<26; ++i ) {
      var grossbuchstabe = String.fromCharCode( 65 + i );
      
      // alert( "*** fromCharCode( " + (65 + i) + " ) = " + grossbuchstabe );

      try {
        zeigeStichwoerter( kategorie, grossbuchstabe );
      } catch ( e ) {
        // ignore errors
      }
    }
  } else {
    var id = kategorie + "_" + abschnitt;
  
    element = document.getElementById( id );
    element.classList.toggle( "active" );
  }
  
  return false;
}


/*
 * detect browser type and version
 *
 * https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
 * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browsers
 */
function isFirefox() {
  var browserVersion = navigator.userAgent;

  // expected match is "Firefox"
  var firefoxMatch = browserVersion.match( /firefox/i );

  return ( firefoxMatch != null );
}


function checkLinkCallback( element, isReachable ) {
  // alert( "*** checkLinkCallback( " + element + ", " + isReachable + " )" );

  // alert( "*** Element " + element + " is reachable: \"" + isReachable + "\" )" );

  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty
   */
  // alert( "*** background-color = \"" + element.style.getPropertyValue( "background-color" ) + "\"" );
  
  if( isReachable ) {
    element.style.setProperty( "background-color", "lime" ); // lightgreen
  } else {
    element.style.setProperty( "background-color", "salmon" ); // lightred
  }
}


function checkLink( element, link ) {
  // alert( "*** checkLink( " + element + ", " + link + " )" );

  /*
   * static check if URL syntax is valid
   */
  let isValid = true;

  try { 
    isValid = Boolean( new URL( link ) );
  } catch( e ) {
    alert( "!!! URL \"" + link + "\" is invalid!" );
    isValid = false;
  }

  if( !isValid ) {
    checkLinkCallback( element, isValid );
    return;
  }


  /*
   * dynamic check if URL is reachable
   *
   * just use the HEAD method and then
   * check the HTTP status (200 or <400)
   */
  let isReachable = null;

  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest?retiredLocale=de
   *
   * Despite its name, XMLHttpRequest can be used to retrieve any type of data, not just XML.
   */
  let xhr = new XMLHttpRequest();

  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
   *
   * method     "GET", "POST", "PUT", "DELETE", etc. [HEAD CONNECT OPTIONS TRACE PATCH]
   * url        Uniform Resource Locator [https://nutzer:kennwort@www.example.com:8080/index.html?p1=A&p2=B#ressource]
   * async      defaulting to true / If ... false, the send() method does not return until the response is received.
   */
  xhr.open( "GET", link, true );


  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readystatechange_event
   *
   * The readystatechange event is fired whenever the readyState property of the XMLHttpRequest changes.
   *
   * addEventListener("readystatechange", (event) => {});
   * onreadystatechange = (event) => {};
   *
   * xhr.onreadystatechange = () => {...}
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/Event/target
   *
   * The read-only target property of the Event interface is a reference to the object onto which the event was dispatched.
   *
   */
  xhr.onreadystatechange = function( event ) {
    //            xhr.readyState === 4 && xhr.status == 200
    isReachable = event.target.readyState == 4 && event.target.status == 200;

    if( this.readyState == this.DONE ) {
      isReachable = event.target.status != 0 && event.target.status < 400;

      checkLinkCallback( element, isReachable );
    }

    // var headers = this.getAllResponseHeaders(); // .toLowerCase()
    // console.log( headers );
  }
 
  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
   *
   * body (optional)
   *   send() accepts an optional parameter which lets you specify the request's body;
   *   this is primarily used for requests such as PUT.
   *   If the request method is GET or HEAD, the body parameter is ignored and the request body is set to null. 
   */
  xhr.send();
}


function checkLinks() {
  // alert( "*** checkLinks()" );

  if( !isFirefox() ) {
    alert( '!!! The link checker only works in Firefox with the "CORS Everywhere" extension installed and switched on.' )
    return;
  }
  
  showAll();

  var allAnchors = document.getElementsByTagName( "a" );

  for( i=0; i<allAnchors.length; ++i ) {
    let a = allAnchors[i];

    // remove background color (if necessary) with "" or mark anchor as unprocessed with "black" / "gray"
    // (see https://htmlcolorcodes.com/)  
    a.style.setProperty( "background-color", "gray" );

    checkLink( a, a.href );
  }

  // for use in forms
  return true;
}
